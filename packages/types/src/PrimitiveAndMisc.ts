/**
 * Primitive value types in TypeScript
 */
export type PrimitiveValue = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Converts a key to a string type.
 * @typeParam Key - The key to convert
 *
 * @example
 * ```ts
 * type KeyAsString = StringKey<42>; // Result: "42"
 * ```
 */
export type StringKey<Key> = Key extends string | number ? `${Key}` : never;

/**
 * JSON-safe value type.
 */
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

/**
 * Makes a type nullable by adding null and undefined
 * @typeParam Value - The type to make nullable
 *
 * @example
 * ```ts
 * type NullableString = Nullable<string>; // Result: string | null | undefined
 * type NullableNull = Nullable<null>; // Result: null | undefined
 * ```
 */
export type Nullable<Value = null> = Value extends null ? null | undefined : Value | null | undefined;
