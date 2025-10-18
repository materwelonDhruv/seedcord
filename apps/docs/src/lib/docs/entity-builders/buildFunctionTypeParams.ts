import { formatCommentRich } from '../commentFormatting';
import { highlightCode, renderInlineType } from '../formatting';

import type { FunctionTypeParameterModel, FormatContext } from '../types';
import type { InlineType, RenderedSignature, DocSignature } from '@seedcord/docs-engine';

const isInlineType = (v: unknown): v is InlineType =>
    !!v && typeof v === 'object' && Array.isArray((v as { parts?: unknown }).parts);

export async function buildFunctionTypeParams(
    signature: DocSignature | undefined,
    rendered: RenderedSignature | undefined,
    context: FormatContext
): Promise<FunctionTypeParameterModel[]> {
    const renderedParams = rendered?.typeParams ?? [];
    if (!renderedParams.length) return [];

    return Promise.all(
        renderedParams.map(async (tp, idx) => {
            const constraint = isInlineType(tp.constraint) ? renderInlineType(tp.constraint, context) : undefined;
            const defaultVal = isInlineType(tp.default) ? renderInlineType(tp.default, context) : undefined;

            const codeText = [
                tp.name,
                constraint ? `extends ${constraint}` : undefined,
                defaultVal ? `= ${defaultVal}` : undefined
            ]
                .filter(Boolean)
                .join(' ');

            let description: string | undefined = undefined;
            const docParam = signature ? signature.typeParameters[idx] : undefined;
            if (docParam?.comment) {
                const formatted = await formatCommentRich(docParam.comment, context);
                if (formatted.paragraphs.length) {
                    description = formatted.paragraphs.map((p) => p.html).join('\n\n');
                }
            }

            return {
                name: tp.name,
                constraint,
                default: defaultVal,
                description,
                code: await highlightCode(codeText)
            };
        })
    );
}
