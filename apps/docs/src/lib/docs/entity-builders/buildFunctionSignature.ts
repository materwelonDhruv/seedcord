import { formatCommentRich } from '../commentFormatting';
import { formatSignature, highlightCode, renderInlineType } from '../formatting';
import { ensureSignatureAnchor } from '../memberBuilders';
import { buildFunctionParameters } from './buildFunctionParameters';
import { buildFunctionTypeParams } from './buildFunctionTypeParams';

import type { CodeRepresentation, FormatContext, FunctionSignatureModel } from '../types';
import type { DocSignature, RenderedSignature } from '@seedcord/docs-engine';

export async function buildFunctionSignature(
    signature: DocSignature,
    context: FormatContext
): Promise<FunctionSignatureModel> {
    const rendered = (signature as unknown as { render?: RenderedSignature }).render;
    const code: CodeRepresentation = rendered
        ? await formatSignature(rendered, context)
        : await highlightCode(signature.name);

    const parameters = await buildFunctionParameters(signature, rendered, context);
    const comment = await formatCommentRich(signature.comment, context);
    const typeParameters = await buildFunctionTypeParams(rendered, context);

    const model: FunctionSignatureModel = {
        id: ensureSignatureAnchor(signature),
        code,
        overloadIndex: signature.overloadIndex,
        parameters,
        typeParameters,
        summary: comment.paragraphs,
        examples: comment.examples.slice()
    };

    if (rendered?.returnType) {
        model.returnType = renderInlineType(rendered.returnType, context);
    }

    if (signature.sourceUrl) {
        model.sourceUrl = signature.sourceUrl;
    }

    return model;
}
