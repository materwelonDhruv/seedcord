import { cloneCommentParagraphs, formatCommentRich } from '../commentFormatting';
import { formatSignature, highlightCode, renderInlineType } from '../formatting';
import { buildFunctionParameters } from './buildFunctionParameters';
import { buildFunctionTypeParams } from './buildFunctionTypeParams';
import { ensureSignatureAnchor } from './utils';

import type { CodeRepresentation, FormatContext, FunctionSignatureModel } from '../types';
import type { DocSignature } from '@seedcord/docs-engine';

export async function buildFunctionSignature(
    signature: DocSignature,
    context: FormatContext,
    isAsync = false
): Promise<FunctionSignatureModel> {
    const rendered = signature.render;
    const baseCode: CodeRepresentation = rendered
        ? await formatSignature(rendered, context)
        : await highlightCode(signature.name);

    const code: CodeRepresentation = isAsync ? await highlightCode(`async ${baseCode.text}`) : baseCode;

    const parameters = await buildFunctionParameters(signature, rendered, context);
    const comment = await formatCommentRich(signature.comment, context);
    const typeParameters = await buildFunctionTypeParams(rendered, context);

    const model: FunctionSignatureModel = {
        id: ensureSignatureAnchor(signature),
        code,
        overloadIndex: signature.overloadIndex,
        parameters,
        typeParameters,
        summary: cloneCommentParagraphs(comment.paragraphs),
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
