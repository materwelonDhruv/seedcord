import { highlightToHtml } from '@lib/shiki';

import { resolveReferenceHref } from './references';

import type { DocsEngine } from './engine';
import type {
    DocComment,
    InlineType,
    RenderedDeclarationHeader,
    RenderedSignature,
    SigPart
} from '@seedcord/docs-engine';

export interface FormatContext {
    engine: DocsEngine;
    manifestPackage: string;
}

export interface CodeRepresentation {
    text: string;
    html: string | null;
}

const SPACE = ' ';

export const createFormatContext = (engine: DocsEngine, manifestPackage: string): FormatContext => ({
    engine,
    manifestPackage
});

function resolveOptions(context: FormatContext): { engine: DocsEngine; currentPackage: string } {
    return { engine: context.engine, currentPackage: context.manifestPackage };
}

function renderSigParts(parts: SigPart[], context: FormatContext): string {
    let result = '';

    for (const part of parts) {
        switch (part.kind) {
            case 'space':
                if (!result.endsWith(SPACE) && result.length > 0) {
                    result += SPACE;
                }
                break;
            case 'ref': {
                const href = resolveReferenceHref(part.ref, resolveOptions(context));
                result += href ? `[${part.text}](${href})` : part.text;
                break;
            }
            default:
                result += part.text;
                break;
        }
    }

    return result;
}

export async function formatDeclarationHeader(
    header: RenderedDeclarationHeader,
    context: FormatContext
): Promise<CodeRepresentation> {
    const segments: string[] = [];

    if (header.modifiers.length) {
        segments.push(header.modifiers.join(' '));
    }

    if (header.keyword) {
        segments.push(header.keyword);
    }

    let nameSegment = header.name;

    if (header.typeParams?.length) {
        const renderedParams = header.typeParams
            .map((param) => {
                const pieces: string[] = [param.name];
                if (param.constraint) {
                    pieces.push(`extends ${renderInlineType(param.constraint, context)}`);
                }
                if (param.default) {
                    pieces.push(`= ${renderInlineType(param.default, context)}`);
                }
                return pieces.join(' ');
            })
            .join(', ');
        nameSegment += `<${renderedParams}>`;
    }

    if (header.type) {
        nameSegment += `: ${renderInlineType(header.type, context)}`;
    }

    const headerWithValue = header as RenderedDeclarationHeader & { value?: InlineType };
    if (headerWithValue.value) {
        nameSegment += ` = ${renderInlineType(headerWithValue.value, context)}`;
    }

    segments.push(nameSegment);

    if (header.heritage?.extends?.length) {
        const clause = header.heritage.extends.map((entry) => renderInlineType(entry, context)).join(', ');
        segments.push(`extends ${clause}`);
    }

    if (header.heritage?.implements?.length) {
        const clause = header.heritage.implements.map((entry) => renderInlineType(entry, context)).join(', ');
        segments.push(`implements ${clause}`);
    }

    const text = segments.join(' ').trim();

    return {
        text,
        html: await highlightToHtml(text)
    };
}

export async function formatSignature(
    signature: RenderedSignature,
    context: FormatContext
): Promise<CodeRepresentation> {
    const name = renderSigParts(signature.name, context);

    let typeParams = '';
    if (signature.typeParams?.length) {
        const renderedParams = signature.typeParams
            .map((param) => {
                const pieces: string[] = [param.name];
                if (param.constraint) {
                    pieces.push(`extends ${renderInlineType(param.constraint, context)}`);
                }
                if (param.default) {
                    pieces.push(`= ${renderInlineType(param.default, context)}`);
                }
                return pieces.join(' ');
            })
            .join(', ');
        typeParams = `<${renderedParams}>`;
    }

    const parameters = signature.parameters
        .map((param) => {
            const pieces: string[] = [param.name + (param.optional ? '?' : '')];
            if (param.type) {
                pieces.push(`: ${renderInlineType(param.type, context)}`);
            }
            if (param.defaultValue) {
                pieces.push(`= ${param.defaultValue}`);
            }
            return pieces.join(' ');
        })
        .join(', ');

    const returnType = signature.returnType ? `: ${renderInlineType(signature.returnType, context)}` : '';
    const text = `${name}${typeParams}(${parameters})${returnType}`.trim();

    return {
        text,
        html: await highlightToHtml(text)
    };
}

export function renderInlineType(type: InlineType | undefined, context: FormatContext): string {
    if (!type) {
        return '';
    }

    return renderSigParts(type.parts, context);
}

export function formatComment(comment: DocComment | null | undefined): string[] {
    if (!comment?.summary) {
        return [];
    }

    return comment.summary
        .split(/\n{2,}/)
        .map((segment) => segment.replace(/\n/g, ' ').trim())
        .filter(Boolean);
}

export async function highlightCode(code: string): Promise<CodeRepresentation> {
    return {
        text: code,
        html: await highlightToHtml(code)
    };
}
