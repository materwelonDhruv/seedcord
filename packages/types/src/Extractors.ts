import type { Equals } from './Validation';

/**
 * Extracts the keys that are optional on an object type.
 * @typeParam ObjectType - The object type to extract from
 *
 * @example
 * ```ts
 * type Example = {
 *   requiredKey: string;
 *   optionalKey?: number;
 * }
 *
 * type Result = OptionalKeys<Example>; // "optionalKey"
 * ```
 */
export type OptionalKeys<ObjectType> = {
    [Key in keyof ObjectType]-?: {} extends Pick<ObjectType, Key> ? Key : never;
}[keyof ObjectType];

/**
 * Extracts the keys that are required on an object type.
 * @typeParam ObjectType - The object type to extract from
 *
 * @example
 * ```ts
 * type Example = {
 *   requiredKey: string;
 *   optionalKey?: number;
 * }
 * type Result = RequiredKeys<Example>; // "requiredKey"
 * ```
 */
export type RequiredKeys<ObjectType> = {
    [Key in keyof ObjectType]-?: {} extends Pick<ObjectType, Key> ? never : Key;
}[keyof ObjectType];

/**
 * Extracts the keys that are readonly on an object type (shallow).
 * @typeParam ObjectType - The object type to extract from
 *
 * @example
 * ```ts
 * type Example = {
 *   readonly readOnlyKey: string;
 *   mutableKey: number;
 * }
 * type Result = ReadonlyKeys<Example>; // "readOnlyKey"
 * ```
 */
export type ReadonlyKeys<ObjectType> = {
    [Key in keyof ObjectType]-?: Equals<
        { [P in Key]: ObjectType[P] },
        { -readonly [P in Key]: ObjectType[P] },
        never,
        Key
    >;
}[keyof ObjectType];

/**
 * Extracts the keys that are *not* readonly on an object type (shallow).
 * @typeParam ObjectType - The object type to extract from
 *
 * @example
 * ```ts
 * type Example = {
 *   readonly readOnlyKey: string;
 *   mutableKey: number;
 * }
 * type Result = WritableKeys<Example>; // "mutableKey"
 * ```
 */
export type WritableKeys<ObjectType> = {
    [Key in keyof ObjectType]-?: Equals<
        { [P in Key]: ObjectType[P] },
        { -readonly [P in Key]: ObjectType[P] },
        Key,
        never
    >;
}[keyof ObjectType];
