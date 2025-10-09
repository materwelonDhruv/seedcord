import { ReflectionKind } from 'typedoc';

type ReflectionKindWithSingular = typeof ReflectionKind & {
    singularString?: (value: ReflectionKind) => string;
};

export const kindLabel = (kind: ReflectionKind): string => {
    const singular = (ReflectionKind as ReflectionKindWithSingular).singularString;
    if (typeof singular === 'function') {
        return singular(kind);
    }

    const fallback = ReflectionKind[kind];
    return typeof fallback === 'string' ? fallback : `#${kind}`;
};
