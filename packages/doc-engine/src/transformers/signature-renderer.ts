import { renderInlineType, textPart } from './type-renderer';

import type {
    DocSignature,
    DocSignatureParameter,
    DocTypeParameter,
    InlineType,
    RenderedDeclarationHeader,
    RenderedSignature,
    SigPart
} from '../types';
import type { TransformContext } from './transform-context';

interface RenderedParameter {
    name: string;
    optional: boolean;
    type?: InlineType;
    defaultValue?: string;
}

interface RenderedTypeParameter {
    name: string;
    constraint?: InlineType;
    default?: InlineType;
}

const renderParameter = (ctx: TransformContext, parameter: DocSignatureParameter): RenderedParameter => {
    const result: RenderedParameter = {
        name: parameter.name,
        optional: Boolean(parameter.flags.isOptional)
    };

    if (parameter.type) {
        const parameterType = renderInlineType(ctx, parameter.type);
        if (parameterType) {
            result.type = parameterType;
        }
    }

    if (typeof parameter.defaultValue === 'string') {
        result.defaultValue = parameter.defaultValue;
    }

    return result;
};

const renderTypeParameter = (ctx: TransformContext, parameter: DocTypeParameter): RenderedTypeParameter => {
    const rendered: RenderedTypeParameter = { name: parameter.name };

    if (parameter.constraint) {
        const constraint = renderInlineType(ctx, parameter.constraint);
        if (constraint) {
            rendered.constraint = constraint;
        }
    }

    if (parameter.default) {
        const defaultType = renderInlineType(ctx, parameter.default);
        if (defaultType) {
            rendered.default = defaultType;
        }
    }

    return rendered;
};

export const renderSignatureView = (ctx: TransformContext, signature: DocSignature): RenderedSignature => {
    const parameters = signature.parameters.map((parameter) => renderParameter(ctx, parameter));
    const view: RenderedSignature = {
        name: [textPart(signature.name)],
        parameters
    };

    if (signature.typeParameters.length > 0) {
        view.typeParams = signature.typeParameters.map((param) => renderTypeParameter(ctx, param));
    }

    const returnType = renderInlineType(ctx, signature.type ?? undefined);
    if (returnType) {
        view.returnType = returnType;
    }

    return view;
};

export const renderDeclarationHeader = (
    ctx: TransformContext,
    name: string,
    typeParams: DocTypeParameter[]
): RenderedDeclarationHeader => {
    const header: RenderedDeclarationHeader = { name };

    if (typeParams.length > 0) {
        header.typeParams = typeParams.map((param) => renderTypeParameter(ctx, param));
    }

    return header;
};

export { renderInlineType };

const sigPartsToText = (parts: SigPart[]): string => {
    let result = '';
    for (const part of parts) {
        if (part.kind === 'space') {
            if (!result.endsWith(' ')) {
                result += ' ';
            }
            continue;
        }

        result += part.text;
    }

    return result.trim();
};

const inlineTypeToText = (inline?: InlineType): string => (inline ? sigPartsToText(inline.parts) : '');

export const formatRenderedSignature = (render: RenderedSignature): string => {
    const nameText = sigPartsToText(render.name);
    const typeParams =
        render.typeParams && render.typeParams.length > 0
            ? `<${render.typeParams.map((param) => param.name).join(', ')}>`
            : '';
    const parameters = render.parameters
        .map((param) => {
            const optional = param.optional ? '?' : '';
            const typeText = param.type ? `: ${inlineTypeToText(param.type)}` : '';
            const defaultValue = param.defaultValue ? ` = ${param.defaultValue}` : '';
            return `${param.name}${optional}${typeText}${defaultValue}`;
        })
        .join(', ');
    const returnType = render.returnType ? `: ${inlineTypeToText(render.returnType)}` : '';

    return `${nameText}${typeParams}(${parameters})${returnType}`.trim();
};
