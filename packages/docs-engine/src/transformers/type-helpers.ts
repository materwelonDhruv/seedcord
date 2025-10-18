import { Serializer } from 'typedoc';

import type { DocType } from '../types';
import type { SomeType, ReflectionType } from 'typedoc';

const serializer = new Serializer();

export const typeToken = (type: SomeType | ReflectionType | undefined): string => {
    if (!type) return 't';

    try {
        const serialized = serializer.toObject(type) as { type?: unknown };
        const primitive = serialized.type;
        if (typeof primitive === 'string' && primitive.length > 0) return primitive;
    } catch {
        // ignore
    }

    return 't';
};

export const toDocType = (type: SomeType | ReflectionType | undefined): DocType | null => {
    if (!type) return null;

    try {
        return serializer.toObject(type);
    } catch {
        return type as unknown as DocType;
    }
};
