import { kindName, type DocNode, type DocSignature, type RenderedDeclarationHeader } from '@seedcord/docs-engine';

import { resolveEntityTone, type EntityTone } from '@lib/entity-metadata';

import {
    createFormatContext,
    formatComment,
    formatDeclarationHeader,
    formatSignature,
    highlightCode,
    renderInlineType,
    type CodeRepresentation,
    type FormatContext
} from './formatting';
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
    summary: string[];
    signature: CodeRepresentation;
    sourceUrl?: string;
    isDeprecated: boolean;
}

export interface ClassLikeEntityModel extends BaseEntityModel {
    typeParameters: EntityMemberSummary[];
    properties: EntityMemberSummary[];
    methods: EntityMemberSummary[];
}

export interface EnumMemberModel {
    id: string;
    label: string;
    value?: string;
    summary: string[];
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

export interface FunctionSignatureModel {
    id: string;
    code: CodeRepresentation;
    parameters: {
        name: string;
        optional: boolean;
        type?: string;
        defaultValue?: string;
    }[];
    returnType?: string;
    summary: string[];
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
const METHOD_KINDS = new Set(['kind_method', 'kind_constructor']);
const ENUM_MEMBER_KIND = 'kind_enum_member';

const FALLBACK_DESCRIPTION = 'Documentation will be sourced from TypeDoc soon.';

const ensureSlug = (node: DocNode): string =>
    typeof node.slug === 'string' && node.slug.length > 0 ? node.slug : String(node.id);

const ensureSignatureAnchor = (signature: DocSignature): string =>
    typeof signature.anchor === 'string' && signature.anchor.length > 0
        ? signature.anchor
        : `${signature.name}-${signature.overloadIndex}`;

const resolveHeaderSignature = async (node: DocNode, context: FormatContext): Promise<CodeRepresentation> => {
    if (node.header) return formatDeclarationHeader(node.header, context);
    const rendered = node.signatures[0]?.render;
    if (rendered) return formatSignature(rendered, context);
    return highlightCode(node.headerText ?? node.name);
};

const createBaseEntityModel = ({
    node,
    kind,
    manifestPackage,
    displayPackage,
    summary,
    signature
}: {
    node: DocNode;
    kind: EntityKind;
    manifestPackage: string;
    displayPackage: string;
    summary: string[];
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
        signature,
        isDeprecated: node.flags.isDeprecated
    };

    if (node.packageVersion) base.version = node.packageVersion;
    if (node.sourceUrl) base.sourceUrl = node.sourceUrl;

    return base;
};

const normalizeAccessor = (accessor?: string | null): EntityMemberSummary['accessorType'] => {
    if (!accessor) {
        return undefined;
    }
    if (accessor === 'getter' || accessor === 'setter') {
        return accessor;
    }
    return 'accessor';
};

const collectMemberTags = (node: DocNode): string[] => {
    const tags = new Set<string>();
    const { flags } = node;
    if (flags.isStatic) tags.add('static');
    if (flags.isReadonly) tags.add('readonly');
    if (flags.isAbstract) tags.add('abstract');
    if (flags.isOptional) tags.add('optional');
    if (flags.isDeprecated) tags.add('deprecated');
    return Array.from(tags);
};

const buildTypeParameterSummaries = async (
    header: RenderedDeclarationHeader | undefined,
    context: FormatContext
): Promise<EntityMemberSummary[]> => {
    const params = header?.typeParams ?? [];
    if (!params.length) return [];
    return Promise.all(
        params.map(async (param) => {
            const segments: string[] = [param.name];
            if (param.constraint) segments.push(`extends ${renderInlineType(param.constraint, context)}`);
            if (param.default) segments.push(`= ${renderInlineType(param.default, context)}`);
            const code = await highlightCode(segments.join(' '));
            return {
                id: `type-${param.name}`,
                label: param.name,
                description: 'Type parameter.',
                signature: code.text,
                signatureHtml: code.html
            } satisfies EntityMemberSummary;
        })
    );
};

const buildMemberSummary = async (node: DocNode, context: FormatContext): Promise<EntityMemberSummary> => {
    const signature = await resolveHeaderSignature(node, context);
    const primarySummary = formatComment(node.comment);
    const signatureComment = node.signatures[0]?.comment;
    const signatureSummary = signatureComment ? formatComment(signatureComment) : [];
    const description = signatureSummary[0] ?? primarySummary[0] ?? FALLBACK_DESCRIPTION;
    const remainingSignature = description === signatureSummary[0] ? signatureSummary.slice(1) : signatureSummary;
    const remainingPrimary = description === primarySummary[0] ? primarySummary.slice(1) : primarySummary;
    const documentationParts = [...remainingSignature, ...remainingPrimary];
    const summary: EntityMemberSummary = {
        id: ensureSlug(node),
        label: node.name,
        description,
        signature: signature.text,
        signatureHtml: signature.html
    };
    if (documentationParts.length) summary.documentation = documentationParts.join('\n\n');
    const tags = collectMemberTags(node);
    if (tags.length) summary.tags = tags;
    if (node.flags.access) summary.access = node.flags.access;
    const accessorType = normalizeAccessor(node.flags.accessor);
    if (accessorType) summary.accessorType = accessorType;
    if (node.sourceUrl) summary.sourceUrl = node.sourceUrl;
    return summary;
};

const buildEnumMember = async (node: DocNode): Promise<EnumMemberModel> => {
    const code = await highlightCode(node.headerText ?? node.name);
    const member: EnumMemberModel = {
        id: ensureSlug(node),
        label: node.name,
        summary: formatComment(node.comment),
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
    const parameters = (rendered?.parameters ?? []).map((param) => {
        const parameter: FunctionSignatureModel['parameters'][number] = {
            name: param.name,
            optional: param.optional
        };

        if (param.type) {
            parameter.type = renderInlineType(param.type, context);
        }

        if (param.defaultValue !== undefined) {
            parameter.defaultValue = param.defaultValue;
        }

        return parameter;
    });

    const model: FunctionSignatureModel = {
        id: ensureSignatureAnchor(signature),
        code,
        parameters,
        summary: formatComment(signature.comment)
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

    const methods = await Promise.all(
        node.children
            .filter((child) => METHOD_KINDS.has(child.kindLabel))
            .map((child) => buildMemberSummary(child, context))
    );

    const typeParameters = await buildTypeParameterSummaries(node.header, context);

    return {
        ...base,
        typeParameters,
        properties,
        methods
    };
};

const buildEnumEntity = async (base: BaseEntityModel & { kind: 'enum' }, node: DocNode): Promise<EnumEntityModel> => {
    const members = await Promise.all(
        node.children.filter((child) => child.kindLabel === ENUM_MEMBER_KIND).map((child) => buildEnumMember(child))
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
    const summary = formatComment(node.comment);
    const signature = await resolveHeaderSignature(node, context);
    const kind = resolveEntityKind(node);

    const base = createBaseEntityModel({
        node,
        kind,
        manifestPackage,
        displayPackage: formatDisplayPackageName(manifestPackage),
        summary,
        signature
    });

    switch (kind) {
        case 'class':
            return buildClassLikeEntity({ ...base, kind: 'class' }, node, context);
        case 'interface':
            return buildClassLikeEntity({ ...base, kind: 'interface' }, node, context);
        case 'enum':
            return buildEnumEntity({ ...base, kind: 'enum' }, node);
        case 'type':
            return buildTypeEntity({ ...base, kind: 'type' }, node, context);
        case 'function':
            return buildFunctionEntity({ ...base, kind: 'function' }, node, context);
        default:
            return buildVariableEntity({ ...base, kind: 'variable' });
    }
}
