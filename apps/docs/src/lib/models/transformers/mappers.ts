import {
    ReflectionKind,
    Serializer,
    type Comment,
    type DeclarationReflection,
    type ParameterReflection,
    type Reflection,
    type ReflectionGroup,
    type ReflectionType,
    type SignatureReflection,
    type SomeType,
    type SourceReference,
    type TypeParameterReflection
} from 'typedoc';

import type {
    DocComment,
    DocFlags,
    DocInheritance,
    DocMembersGroup,
    DocNode,
    DocReference,
    DocSignature,
    DocSignatureParameter,
    DocSource,
    DocType,
    DocTypeParameter
} from '../types';
import type { TransformContext } from './transform-context';

const serializer = new Serializer();

const toDocType = (type: SomeType | ReflectionType | undefined): DocType | null => {
    if (!type) {
        return null;
    }

    try {
        return serializer.toObject(type);
    } catch {
        // Fallback to the raw object shape if serialization fails for exotic types.
        return type as unknown as DocType;
    }
};

export const mapType = (type: SomeType | ReflectionType | undefined): DocType | null => toDocType(type);

export const mapComment = (context: TransformContext, comment?: Comment | null): DocComment | null =>
    context.commentTransformer.toDocComment(comment ?? undefined);

export const mapFlags = (reflection: Reflection | ParameterReflection): DocFlags => {
    const flags = reflection.flags;
    const access = flags.isPrivate ? 'private' : flags.isProtected ? 'protected' : flags.isPublic ? 'public' : null;

    return {
        access,
        isStatic: Boolean(flags.isStatic),
        isAbstract: Boolean(flags.isAbstract),
        isReadonly: Boolean(flags.isReadonly),
        isOptional: Boolean(flags.isOptional),
        isDeprecated: Boolean((flags as { isDeprecated?: boolean }).isDeprecated),
        isInherited: Boolean((flags as { isInherited?: boolean }).isInherited)
    };
};

export const mapSources = (sources: SourceReference[] | undefined): DocSource[] => {
    if (!Array.isArray(sources)) {
        return [];
    }

    return sources.map((source) => {
        const result: DocSource = {
            fileName: source.fileName,
            line: source.line,
            character: source.character
        };

        if (typeof source.url === 'string' && source.url.length > 0) {
            result.url = source.url;
        }

        return result;
    });
};

export const mapSignatureParameters = (
    context: TransformContext,
    parameters: readonly ParameterReflection[] | undefined
): DocSignatureParameter[] => {
    if (!parameters) return [];

    return parameters.map((parameter) => {
        const docParameter: DocSignatureParameter = {
            id: parameter.id,
            name: parameter.name,
            kind: parameter.kind,
            type: mapType(parameter.type),
            defaultValue: parameter.defaultValue,
            comment: mapComment(context, parameter.comment),
            flags: mapFlags(parameter)
        };

        return docParameter;
    });
};

export const mapTypeParameters = (
    context: TransformContext,
    parameters: readonly TypeParameterReflection[] | undefined
): DocTypeParameter[] => {
    if (!parameters) return [];

    return parameters.map((parameter) => {
        const out: DocTypeParameter = {
            id: parameter.id,
            name: parameter.name
        };

        const constraint = mapType(parameter.type);
        if (constraint !== null) {
            out.constraint = constraint;
        }

        const def = mapType(parameter.default);
        if (def !== null) {
            out.default = def;
        }

        const variance = parameter.varianceModifier;
        if (variance !== undefined) {
            out.variance = variance;
        }

        const comment = mapComment(context, parameter.comment);
        if (comment !== null) {
            out.comment = comment;
        }

        return out;
    });
};

export const mapReference = (reference: unknown): DocReference | null => {
    if (!reference || typeof reference !== 'object') {
        return null;
    }

    const candidate = reference as {
        name?: string;
        packageName?: string;
        package?: string;
        qualifiedName?: string;
        target?: number | string | null;
        externalUrl?: string;
        url?: string;
        id?: number;
        sources?: { url?: string }[];
    };

    if (!candidate.name) {
        return null;
    }

    const sourceUrl = candidate.externalUrl ?? candidate.url ?? candidate.sources?.[0]?.url;

    const result: DocReference = {
        name: candidate.name
    };

    const packageName = candidate.packageName ?? candidate.package;
    if (packageName) {
        result.packageName = packageName;
    }

    if (candidate.qualifiedName) {
        result.qualifiedName = candidate.qualifiedName;
    }

    if (sourceUrl) {
        result.externalUrl = sourceUrl;
    }

    const resolvedTarget = candidate.target ?? (typeof candidate.id === 'number' ? candidate.id : null);
    if (resolvedTarget !== null) {
        result.target = resolvedTarget;
    }

    return result;
};

export const mapGroups = (group: ReflectionGroup, lookup: Map<number, DocNode>): DocMembersGroup => {
    const rawChildren = Array.isArray(group.children) ? group.children : [];
    const resolveChild = (child: unknown): DocNode | null => {
        if (typeof child === 'number') {
            return lookup.get(child) ?? null;
        }

        if (typeof child === 'object' && child !== null) {
            const childId = (child as { id?: number }).id;
            if (typeof childId === 'number') {
                return lookup.get(childId) ?? null;
            }
        }

        return null;
    };

    const children = rawChildren
        .map((child) => resolveChild(child))
        .filter((child): child is DocNode => Boolean(child));

    return {
        title: group.title,
        kind: 'kind' in group ? ((group as { kind?: ReflectionKind }).kind ?? null) : null,
        children
    };
};

function sigFragment(s: SignatureReflection): string {
    const HASH_BASE = 36;
    const name = s.name;
    const params = (s.parameters ?? [])
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        .map((p) => (p.type ? (serializer.toObject(p.type).type ?? 't') : 't'))
        .join(',');
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const ret = s.type ? (serializer.toObject(s.type).type ?? 't') : 't';
    let djb2HashSeed = 5381;
    for (const ch of `${name}(${params}):${ret}`) djb2HashSeed = (djb2HashSeed << 5) + djb2HashSeed + ch.charCodeAt(0);
    return `${name}-${(djb2HashSeed >>> 0).toString(HASH_BASE)}`;
}

export const mapSignature = (
    context: TransformContext,
    signature: SignatureReflection,
    parent: { id: number; name: string; slug: string },
    index: number
): DocSignature => {
    const comment = mapComment(context, signature.comment);
    const returnsTag = signature.comment?.getTag('@returns') ?? null;
    const throwsTags = signature.comment?.getTags('@throws') ?? [];

    const fragment = sigFragment(signature);
    const anchor = `${parent.slug}#${fragment}`;
    let kindLabel: string;
    if (typeof ReflectionKind.singularString === 'function') {
        kindLabel = ReflectionKind.singularString(signature.kind);
    } else {
        const maybeLabel = ReflectionKind[signature.kind];
        kindLabel = typeof maybeLabel === 'string' ? maybeLabel : `Signature ${signature.kind}`;
    }

    const identifier = typeof signature.id === 'number' ? signature.id : parent.id * 1000 + index;
    const name = signature.name && signature.name.length > 0 ? signature.name : parent.name;

    return {
        id: identifier,
        name,
        kind: signature.kind,
        kindLabel,
        fragment,
        anchor,
        overloadIndex: index,
        type: mapType(signature.type),
        parameters: mapSignatureParameters(context, signature.parameters),
        typeParameters: mapTypeParameters(context, signature.typeParameters),
        comment,
        returnsComment: returnsTag ? context.commentTransformer.toBlockTag(returnsTag) : null,
        throws: throwsTags.map((tag) => context.commentTransformer.toBlockTag(tag)),
        sources: mapSources(signature.sources),
        overwrites: mapReference(signature.overwrites),
        inheritedFrom: mapReference(signature.inheritedFrom),
        implementationOf: mapReference(signature.implementationOf)
    };
};

const mapDocTypeArray = (types: readonly (SomeType | ReflectionType)[] | undefined): DocType[] => {
    const results: DocType[] = [];
    for (const type of types ?? []) {
        const mapped = mapType(type);
        if (mapped) {
            results.push(mapped);
        }
    }
    return results;
};

export const mapInheritance = (reflection: DeclarationReflection): DocInheritance => ({
    extends: mapDocTypeArray(reflection.extendedTypes),
    implements: mapDocTypeArray(reflection.implementedTypes),
    extendedBy: mapDocTypeArray(reflection.extendedBy),
    implementedBy: mapDocTypeArray(reflection.implementedBy)
});
