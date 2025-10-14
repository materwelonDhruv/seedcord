import {
    ReflectionKind,
    type Comment,
    type DeclarationReflection,
    type ParameterReflection,
    type Reflection
} from 'typedoc';

import type { DocFlags } from '../types';

const hasModifier = (comment: Comment | null, modifier: '@internal' | '@external'): boolean => {
    const modifiers = comment?.modifierTags;
    return modifiers?.has(modifier) ?? false;
};

const hasDecoratorBlockTag = (comment: Comment | null): boolean => {
    const blockTags = comment?.blockTags;
    return Array.isArray(blockTags) ? blockTags.some((tag) => tag.tag === '@decorator') : false;
};

const hasDecoratorMetadata = (reflection: Reflection | ParameterReflection): boolean => {
    const decorators = (reflection as { decorators?: unknown[] }).decorators;
    return Array.isArray(decorators) && decorators.length > 0;
};

const resolveAccessor = (reflection: Reflection | ParameterReflection): DocFlags['accessor'] => {
    if (!('kind' in reflection) || reflection.kind !== ReflectionKind.Accessor) {
        return null;
    }

    const { getSignature, setSignature } = reflection as DeclarationReflection;
    const hasGetter = Boolean(getSignature);
    const hasSetter = Boolean(setSignature);

    if (hasGetter && hasSetter) {
        return 'getter-setter';
    }
    if (hasGetter) {
        return 'getter';
    }
    if (hasSetter) {
        return 'setter';
    }
    return null;
};

const isInheritedReflection = (reflection: Reflection | ParameterReflection): boolean => {
    if ('inheritedFrom' in reflection && reflection.inheritedFrom) {
        return true;
    }
    if ('implementationOf' in reflection && reflection.implementationOf) {
        return true;
    }
    if ('overwrites' in reflection && reflection.overwrites) {
        return true;
    }
    return false;
};

const isOverwritingReflection = (reflection: Reflection | ParameterReflection): boolean => {
    if ('overwrites' in reflection && reflection.overwrites) {
        return true;
    }
    return false;
};

export const mapFlags = (reflection: Reflection | ParameterReflection): DocFlags => {
    const flags = reflection.flags;
    const access = flags.isPrivate ? 'private' : flags.isProtected ? 'protected' : flags.isPublic ? 'public' : null;
    const comment = (reflection as { comment?: Comment | null }).comment ?? null;
    const accessor = resolveAccessor(reflection);
    const isDecorator = hasDecoratorBlockTag(comment) || hasDecoratorMetadata(reflection);
    const inherited = Boolean((flags as { isInherited?: boolean }).isInherited) || isInheritedReflection(reflection);

    return {
        access,
        accessor,
        isStatic: Boolean(flags.isStatic),
        isAbstract: Boolean(flags.isAbstract),
        isConst: Boolean((flags as { isConst?: boolean }).isConst),
        isReadonly: Boolean(flags.isReadonly),
        isOptional: Boolean(flags.isOptional),
        isDeprecated: Boolean((flags as { isDeprecated?: boolean }).isDeprecated),
        isInherited: inherited,
        isDecorator,
        isInternal: Boolean((flags as { isInternal?: boolean }).isInternal) || hasModifier(comment, '@internal'),
        isExternal: Boolean((flags as { isExternal?: boolean }).isExternal) || hasModifier(comment, '@external'),
        isOverwriting: isOverwritingReflection(reflection)
    };
};
