import { kindName, type DocNode, type DocSignature } from '@seedcord/docs-engine';

import { resolveEntityTone, type EntityTone } from '@lib/entity-metadata';

import { formatCommentRich, type CommentExample, type CommentParagraph } from './comment-format';
import {
    createFormatContext,
    formatSignature,
    highlightCode,
    renderInlineType,
    type CodeRepresentation,
    type FormatContext
} from './formatting';
import {
    buildMemberSummary,
    buildTypeParameterSummaries,
    ensureSignatureAnchor,
    ensureSlug,
    resolveHeaderSignature
} from './member-builders';
import { formatDisplayPackageName } from './packages';

import type { DocsEngine } from './engine';
import type { EntityMemberSummary } from '@components/docs/entity/member-types';

export type EntityKind = EntityTone;

interface BaseEntityModel {
    kind: EntityKind;
    name: string;
    slug: string;
    qualifiedName: string;
    manifestPackage: string;
    displayPackage: string;
    version?: string;
    summary: CommentParagraph[];
    summaryExamples: CommentExample[];
    signature: CodeRepresentation;
    sourceUrl?: string;
    isDeprecated: boolean;
}

export interface ClassLikeEntityModel extends BaseEntityModel {
    typeParameters: EntityMemberSummary[];
    properties: EntityMemberSummary[];
    methods: EntityMemberSummary[];
    constructors: EntityMemberSummary[];
}

export interface EnumMemberModel {
    id: string;
    label: string;
    value?: string;
    summary: CommentParagraph[];
    signature: CodeRepresentation;
    sourceUrl?: string;
}

export interface EnumEntityModel extends BaseEntityModel {
    kind: 'enum';
    members: EnumMemberModel[];
}

export interface TypeEntityModel extends BaseEntityModel {
    kind: 'type';
    declaration: CodeRepresentation;
    typeParameters: EntityMemberSummary[];
}

export interface FunctionSignatureParameterModel {
    name: string;
    optional: boolean;
    type?: string;
    defaultValue?: string;
    documentation: CommentParagraph[];
}

export interface FunctionSignatureModel {
    id: string;
    code: CodeRepresentation;
    overloadIndex: number;
    parameters: FunctionSignatureParameterModel[];
    returnType?: string;
    summary: CommentParagraph[];
    examples: CommentExample[];
    sourceUrl?: string;
}

export interface FunctionEntityModel extends BaseEntityModel {
    kind: 'function';
    signatures: FunctionSignatureModel[];
}

export interface VariableEntityModel extends BaseEntityModel {
    kind: 'variable';
    declaration: CodeRepresentation;
}

export type EntityModel =
    | (ClassLikeEntityModel & { kind: 'class' })
    | (ClassLikeEntityModel & { kind: 'interface' })
    | EnumEntityModel
    | TypeEntityModel
    | FunctionEntityModel
    | VariableEntityModel;

const PROPERTY_KINDS = new Set(['kind_property', 'kind_accessor']);
const METHOD_KINDS = new Set(['kind_method']);
const CONSTRUCTOR_KIND = 'kind_constructor';
const ENUM_MEMBER_KIND = 'kind_enum_member';

const createBaseEntityModel = ({
    node,
    kind,
    manifestPackage,
    displayPackage,
    summary,
    summaryExamples,
    signature
}: {
    node: DocNode;
    kind: EntityKind;
    manifestPackage: string;
    displayPackage: string;
    summary: CommentParagraph[];
    summaryExamples: CommentExample[];
    signature: CodeRepresentation;
}): BaseEntityModel => {
    const base: BaseEntityModel = {
        kind,
        name: node.name,
        slug: ensureSlug(node),
        qualifiedName: node.qualifiedName,
        manifestPackage,
        displayPackage,
        summary,
        summaryExamples,
        signature,
        isDeprecated: node.flags.isDeprecated
    };

    if (node.packageVersion) base.version = node.packageVersion;
    if (node.sourceUrl) base.sourceUrl = node.sourceUrl;

    return base;
};

const buildEnumMember = async (node: DocNode, context: FormatContext): Promise<EnumMemberModel> => {
    const code = await highlightCode(node.headerText ?? node.name);
    const comment = await formatCommentRich(node.comment, context);
    const member: EnumMemberModel = {
        id: ensureSlug(node),
        label: node.name,
        summary: comment.paragraphs,
        signature: code
    };

    if (node.defaultValue !== undefined) {
        member.value = node.defaultValue;
    }

    if (node.sourceUrl) {
        member.sourceUrl = node.sourceUrl;
    }

    return member;
};

const buildFunctionSignature = async (
    signature: DocSignature,
    context: FormatContext
): Promise<FunctionSignatureModel> => {
    const rendered = signature.render;
    const code = rendered ? await formatSignature(rendered, context) : await highlightCode(signature.name);
    const parameters = await Promise.all(
        signature.parameters.map(async (param, index) => {
            const renderedParam = rendered?.parameters ? rendered.parameters[index] : undefined;
            const parameter: FunctionSignatureParameterModel = {
                name: param.name,
                optional: param.flags.isOptional,
                documentation: []
            };

            if (renderedParam?.type) {
                parameter.type = renderInlineType(renderedParam.type, context);
            }

            if (renderedParam?.defaultValue !== undefined) {
                parameter.defaultValue = renderedParam.defaultValue;
            } else if (param.defaultValue !== undefined) {
                parameter.defaultValue = param.defaultValue;
            }

            const formatted = await formatCommentRich(param.comment, context);
            parameter.documentation = formatted.paragraphs;

            return parameter;
        })
    );

    const comment = await formatCommentRich(signature.comment, context);

    const model: FunctionSignatureModel = {
        id: ensureSignatureAnchor(signature),
        code,
        overloadIndex: signature.overloadIndex,
        parameters,
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
};

const buildClassLikeEntity = async <Kind extends 'class' | 'interface'>(
    base: BaseEntityModel & { kind: Kind },
    node: DocNode,
    context: FormatContext
): Promise<ClassLikeEntityModel & { kind: Kind }> => {
    const properties = await Promise.all(
        node.children
            .filter((child) => PROPERTY_KINDS.has(child.kindLabel))
            .map((child) => buildMemberSummary(child, context))
    );

    const constructors = await Promise.all(
        node.children
            .filter((child) => child.kindLabel === CONSTRUCTOR_KIND)
            .map((child) => buildMemberSummary(child, context))
    );

    const methods = await Promise.all(
        node.children
            .filter((child) => METHOD_KINDS.has(child.kindLabel))
            .map((child) => buildMemberSummary(child, context))
    );

    const typeParameters = await buildTypeParameterSummaries(node.header, context);

    return {
        ...base,
        typeParameters,
        constructors,
        properties,
        methods
    };
};

const buildEnumEntity = async (
    base: BaseEntityModel & { kind: 'enum' },
    node: DocNode,
    context: FormatContext
): Promise<EnumEntityModel> => {
    const members = await Promise.all(
        node.children
            .filter((child) => child.kindLabel === ENUM_MEMBER_KIND)
            .map((child) => buildEnumMember(child, context))
    );

    return {
        ...base,
        members
    };
};

const buildTypeEntity = async (
    base: BaseEntityModel & { kind: 'type' },
    node: DocNode,
    context: FormatContext
): Promise<TypeEntityModel> => {
    const typeParameters = await buildTypeParameterSummaries(node.header, context);

    return {
        ...base,
        declaration: base.signature,
        typeParameters
    };
};

const buildFunctionEntity = async (
    base: BaseEntityModel & { kind: 'function' },
    node: DocNode,
    context: FormatContext
): Promise<FunctionEntityModel> => {
    const signatures = await Promise.all(node.signatures.map((sig) => buildFunctionSignature(sig, context)));

    return {
        ...base,
        signatures
    };
};

const buildVariableEntity = (base: BaseEntityModel & { kind: 'variable' }): VariableEntityModel => ({
    ...base,
    declaration: base.signature
});

const resolveEntityKind = (node: DocNode): EntityKind => resolveEntityTone(kindName(node.kind));

export async function buildEntityModel(engine: DocsEngine, node: DocNode): Promise<EntityModel> {
    const manifestPackage = node.packageName;
    const context = createFormatContext(engine, manifestPackage);
    const formattedSummary = await formatCommentRich(node.comment, context);
    const signature = await resolveHeaderSignature(node, context);
    const kind = resolveEntityKind(node);

    const base = createBaseEntityModel({
        node,
        kind,
        manifestPackage,
        displayPackage: formatDisplayPackageName(manifestPackage),
        summary: formattedSummary.paragraphs,
        summaryExamples: formattedSummary.examples,
        signature
    });

    switch (kind) {
        case 'class':
            return buildClassLikeEntity({ ...base, kind: 'class' }, node, context);
        case 'interface':
            return buildClassLikeEntity({ ...base, kind: 'interface' }, node, context);
        case 'enum':
            return buildEnumEntity({ ...base, kind: 'enum' }, node, context);
        case 'type':
            return buildTypeEntity({ ...base, kind: 'type' }, node, context);
        case 'function':
            return buildFunctionEntity({ ...base, kind: 'function' }, node, context);
        default:
            return buildVariableEntity({ ...base, kind: 'variable' });
    }
}
