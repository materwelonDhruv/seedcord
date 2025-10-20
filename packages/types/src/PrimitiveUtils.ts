/**
 * Creates a union type representing a range of numbers
 * @typeParam Lower - The lower bound of the range
 * @typeParam Upper - The upper bound of the range
 */
export type NumberRange<
    Lower extends number,
    Upper extends number,
    Accumulator extends unknown[] = []
> = Accumulator['length'] extends Upper
    ? [...Accumulator, Accumulator['length']][number]
    : Accumulator['length'] extends Lower
      ? NumberRange<number, Upper, [...Accumulator, Accumulator['length']]>
      : NumberRange<Lower, Upper, [...Accumulator, Lower]>;

/**
 * Primitive value types in TypeScript
 */
export type PrimitiveValue = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Converts a key to a string type.
 * @typeParam Key - The key to convert
 */
export type StringKey<Key> = Key extends string | number ? `${Key}` : never;

/**
 * Joins a prefix and key string with a separator, handling empty prefixes.
 * @typeParam Prefix - The prefix string
 * @typeParam KeyStr - The key string
 * @typeParam Separator - The separator string
 */
export type JoinPath<Prefix extends string, KeyStr extends string, Separator extends string> = [Prefix] extends ['']
    ? KeyStr
    : `${Prefix}${Separator}${KeyStr}`;
