import type { AnyFunction } from './FunctionTypes';
import type { StringKey, JoinPath } from './PrimitiveUtils';

/**
 * Builds a union of all valid path strings in an object, e.g. "a", "a.b", "a.b.c".
 * - Arrays and functions are treated as terminal (no recursion into them).
 * - Supports a custom separator.
 * @typeParam ObjectType - The object type to extract paths from
 * @typeParam Separator - The separator string
 */
export type UnionOfPathsInObject<ObjectType, Separator extends string = '.', Prefix extends string = ''> = {
    [Key in keyof ObjectType]: StringKey<Key> extends infer KeyStr extends string
        ? NonNullable<ObjectType[Key]> extends object
            ? ObjectType[Key] extends AnyFunction | readonly unknown[]
                ? JoinPath<Prefix, KeyStr, Separator>
                :
                      | JoinPath<Prefix, KeyStr, Separator>
                      | UnionOfPathsInObject<ObjectType[Key], Separator, JoinPath<Prefix, KeyStr, Separator>>
            : JoinPath<Prefix, KeyStr, Separator>
        : never;
}[keyof ObjectType];

/**
 * Helper type to recursively get the nested property type.
 * @typeParam Obj - The object type
 * @typeParam Path - The path string
 * @typeParam Separator - The separator string
 *
 * @internal
 */
export type GetInternal<
    Obj,
    Path extends string,
    Separator extends string
> = Path extends `${infer Head}${Separator}${infer Tail}`
    ? Head extends keyof Obj
        ? GetInternal<NonNullable<Obj[Head]>, Tail, Separator>
        : never
    : Path extends keyof Obj
      ? Obj[Path]
      : never;

/**
 * Get the nested property type using a dotted path (e.g. "a.b.c").
 * Supports object paths (no array indexes in this minimal variant).
 * @typeParam ObjectType - The object type to get the property from
 * @typeParam Path - The dotted path string representing the nested property
 */
export type Get<
    ObjectType,
    Path extends UnionOfPathsInObject<ObjectType, Separator>,
    Separator extends string = '.'
> = GetInternal<ObjectType, Path & string, Separator>;
