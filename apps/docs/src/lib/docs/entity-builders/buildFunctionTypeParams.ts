import { highlightCode, renderInlineType } from '../formatting';

import type { FunctionTypeParameterModel, FormatContext } from '../types';
import type { InlineType, RenderedSignature } from '@seedcord/docs-engine';

const isInlineType = (v: unknown): v is InlineType =>
    !!v && typeof v === 'object' && Array.isArray((v as { parts?: unknown }).parts);

export async function buildFunctionTypeParams(
    rendered: RenderedSignature | undefined,
    context: FormatContext
): Promise<FunctionTypeParameterModel[]> {
    if (!rendered?.typeParams?.length) return [];

    return Promise.all(
        rendered.typeParams.map(async (tp) => {
            const constraint = isInlineType(tp.constraint) ? renderInlineType(tp.constraint, context) : undefined;
            const defaultVal = isInlineType(tp.default) ? renderInlineType(tp.default, context) : undefined;

            const codeText = [
                tp.name,
                constraint ? `extends ${constraint}` : undefined,
                defaultVal ? `= ${defaultVal}` : undefined
            ]
                .filter(Boolean)
                .join(' ');

            return {
                name: tp.name,
                constraint,
                default: defaultVal,
                description: undefined,
                code: await highlightCode(codeText)
            };
        })
    );
}
