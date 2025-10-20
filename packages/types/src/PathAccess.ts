import type { AnyFunction } from './FunctionTypes';
import type { StringKey } from './PrimitiveAndMisc';

/**
 * Joins a prefix and key string with a separator, handling empty prefixes.
 * @typeParam Prefix - The prefix string
 * @typeParam KeyStr - The key string
 * @typeParam Separator - The separator string
 *
 * @example
 * ```ts
 * type Joined1 = JoinPath<'a.b', 'c', '.'>; // Result: 'a.b.c'
 * type Joined2 = JoinPath<'', 'c', '.'>;    // Result: 'c'
 * ```
 */
export type JoinPath<Prefix extends string, KeyStr extends string, Separator extends string> = [Prefix] extends ['']
    ? KeyStr
    : `${Prefix}${Separator}${KeyStr}`;

/**
 * Builds a union of all valid path strings in an object, e.g. "a", "a.b", "a.b.c".
 * - Arrays and functions are treated as terminal (no recursion into them).
 * - Supports a custom separator.
 * @typeParam ObjectType - The object type to extract paths from
 * @typeParam Separator - The separator string
 *
 * @example
 * ```ts
 * type Example = {
 *     a: {
 *         b: {
 *             c: number;
 *         };
 *     };
 *     d: string;
 *     e: () => void;
 *     f: { g: string }[];
 * };
 * type Paths = UnionOfPathsInObject<Example>;
 * // Result: "a" | "a.b" | "a.b.c" | "d" | "e" | "f"
 * ```
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
// eslint-disable-next-line @typescript-eslint/naming-convention
export type _Get<
    Obj,
    Path extends string,
    Separator extends string
> = Path extends `${infer Head}${Separator}${infer Tail}`
    ? Head extends keyof Obj
        ? _Get<NonNullable<Obj[Head]>, Tail, Separator>
        : never
    : Path extends keyof Obj
      ? Obj[Path]
      : never;

/**
 * Get the nested property type using a dotted path (e.g. "a.b.c").
 * Supports object paths (no array indexes in this minimal variant).
 * @typeParam ObjectType - The object type to get the property from
 * @typeParam Path - The dotted path string representing the nested property
 * @typeParam Separator - The separator string
 *
 * @example
 * ```ts
 * type Example = {
 *     a: {
 *         b: {
 *             c: number;
 *         };
 *     };
 *     d: string;
 * };
 *
 * type Test1 = Get<Example, 'a.b.c'>; // Result: number
 * type Test2 = Get<Example, 'd'>;     // Result: string
 * ```
 */
export type Get<
    ObjectType,
    Path extends UnionOfPathsInObject<ObjectType, Separator>,
    Separator extends string = '.'
> = _Get<ObjectType, Path & string, Separator>;
