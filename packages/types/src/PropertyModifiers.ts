import type { AnyFunction } from './FunctionTypes';
import type { Simplify } from './ObjectManipulation';
import type { PrimitiveValue } from './PrimitiveAndMisc';

/**
 * Makes at least one property of an object type required. It will make all properties of ObjectType optional if `Keys` is not provided.
 * @typeParam ObjectType - The object type to modify
 * @typeParam Keys - The keys of the object type to make required (defaults to all keys)
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; c: boolean; }
 *
 * type Result = RequireAtLeastOne<Example>;
 * // Result:
 * | { a: string; b?: number; c?: boolean; }
 * | { a?: string; b: number; c?: boolean; }
 * | { a?: string; b?: number; c: boolean; }
 * ```
 */

export type RequireAtLeastOne<ObjectType, Keys extends keyof ObjectType = keyof ObjectType> = Simplify<
    Omit<ObjectType, Keys> &
        {
            [Key in Keys]-?: Required<Pick<ObjectType, Key>> & Partial<Omit<Pick<ObjectType, Keys>, Key>>;
        }[Keys]
>;

/**
 * Makes exactly one property of an object type required, and all others optional.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make exactly one required (defaults to all keys)
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; c: boolean; }
 *
 * type Result = RequireExactlyOne<Example>;
 * // Result:
 * | { a: string; b?: never; c?: never; }
 * | { a?: never; b: number; c?: never; }
 * | { a?: never; b?: never; c: boolean; }
 * ```
 */
export type RequireExactlyOne<ObjectType, PropertyKeys extends keyof ObjectType = keyof ObjectType> = Simplify<
    Omit<ObjectType, PropertyKeys> &
        {
            [Property in PropertyKeys]-?: Required<Pick<ObjectType, Property>> &
                Partial<Record<Exclude<PropertyKeys, Property>, never>>;
        }[PropertyKeys]
>;

/**
 * Either all of the provided keys must be present (and required) or none of them may appear.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make all-or-none
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; c: boolean; }
 *
 * type Result = RequireAllOrNone<Example, 'a' | 'b'>;
 * // Result: { a: string; b: number; c?: boolean; } | { c?: boolean; }
 * ```
 */
export type RequireAllOrNone<ObjectType, PropertyKeys extends keyof ObjectType> = Simplify<
    | (Omit<ObjectType, PropertyKeys> & Required<Pick<ObjectType, PropertyKeys>>)
    | (Omit<ObjectType, PropertyKeys> & Partial<Record<PropertyKeys, never>>)
>;

/**
 * Makes all properties of an object type optional except for the specified required keys.
 * @typeParam ObjectType - The object type to modify
 * @typeParam RequiredPropertyKeys - The keys of the object type to keep required
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; c: boolean; }
 *
 * type Result = PartialExcept<Example, 'a' | 'b'>;
 * // Result: { a: string; b: number; c?: boolean; }
 * ```
 */
export type PartialExcept<ObjectType, RequiredPropertyKeys extends keyof ObjectType> = Simplify<
    Pick<ObjectType, RequiredPropertyKeys> & Partial<Omit<ObjectType, RequiredPropertyKeys>>
>;

/**
 * Makes just the specified keys optional; everything else remains as-is.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make optional
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; c: boolean; }
 *
 * type Result = PartialBy<Example, 'a' | 'b'>;
 * // Result: { a?: string; b?: number; c: boolean; }
 * ```
 */
export type PartialBy<ObjectType, PropertyKeys extends keyof ObjectType> = Simplify<
    Omit<ObjectType, PropertyKeys> & Partial<Pick<ObjectType, PropertyKeys>>
>;

/**
 * Makes just the specified keys required; everything else remains as-is.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make required
 *
 * @example
 * ```ts
 * type Example = { a?: string; b?: number; c?: boolean; }
 *
 * type Result = RequiredBy<Example, 'a' | 'b'>;
 * // Result: { a: string; b?: number; c: boolean; }
 * ```
 */
export type RequiredBy<ObjectType, PropertyKeys extends keyof ObjectType> = Simplify<
    Omit<ObjectType, PropertyKeys> & Required<Pick<ObjectType, PropertyKeys>>
>;

/**
 * Makes all properties required except for the specified optional keys.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make optional
 *
 * @example
 * ```ts
 * type Example = { a?: string; b: number; c?: boolean; }
 *
 * type Result = RequiredExcept<Example, 'a'>;
 * // Result: { a?: string; b: number; c: boolean; }
 * ```
 */
export type RequiredExcept<ObjectType, PropertyKeys extends keyof ObjectType> = Simplify<
    Required<Omit<ObjectType, PropertyKeys>> & Pick<ObjectType, PropertyKeys>
>;

/**
 * Makes just the specified keys readonly; everything else remains as-is.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make readonly
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; c: boolean; }
 *
 * type Result = ReadonlyBy<Example, 'a' | 'b'>;
 * // Result: { readonly a: string; readonly b: number; c: boolean; }
 * ```
 */
export type ReadonlyBy<ObjectType, PropertyKeys extends keyof ObjectType> = Simplify<
    Omit<ObjectType, PropertyKeys> & Readonly<Pick<ObjectType, PropertyKeys>>
>;

/**
 * Makes all properties readonly except for the specified mutable keys.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make mutable
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; c: boolean; }
 *
 * type Result = ReadonlyExcept<Example, 'b' | 'c'>;
 * // Result: { readonly a: string; b: number; c: boolean; }
 * ```
 */
export type ReadonlyExcept<ObjectType, PropertyKeys extends keyof ObjectType> = Simplify<
    Pick<ObjectType, PropertyKeys> & Readonly<Omit<ObjectType, PropertyKeys>>
>;

/**
 * Shallowly makes all properties of a type mutable (removes readonly)
 * @typeParam TypeModel - The type to make mutable
 *
 * @example
 * ```ts
 * type Example = { readonly a: string; readonly b: number; }
 * type Result = MakeMutable<Example>;
 * // Result: { a: string; b: number; }
 * ```
 */
export type MakeMutable<TypeModel> = Simplify<{
    -readonly [Property in keyof TypeModel]: TypeModel[Property];
}>;

/**
 * Shallowly makes all properties of a type readonly
 * @typeParam TypeModel - The type to make readonly
 *
 * @example
 * ```ts
 * type Example = { a: string; b: number; }
 * type Result = MakeReadonly<Example>;
 * // Result: { readonly a: string; readonly b: number; }
 * ```
 */
export type MakeReadonly<TypeModel> = Simplify<{
    readonly [Property in keyof TypeModel]: TypeModel[Property];
}>;

/**
 * Recursively makes all properties of a type mutable (removes readonly)
 * @typeParam TypeModel - The type to make mutable
 *
 * @example
 * ```ts
 * type Example = { readonly a: { readonly b: string; }; readonly c: number; }
 * type Result = MakeDeepMutable<Example>;
 * // Result: { a: { b: string; }; c: number; }
 * ```
 */
export type MakeDeepMutable<TypeModel> = TypeModel extends PrimitiveValue | AnyFunction
    ? TypeModel
    : Simplify<{
          -readonly [Property in keyof TypeModel]: MakeDeepMutable<TypeModel[Property]>;
      }>;

/**
 * Recursively makes all properties of a type readonly
 * @typeParam TypeModel - The type to make readonly
 *
 * @example
 * ```ts
 * type Example = { a: { b: string; }; c: number; }
 * type Result = MakeDeepReadonly<Example>;
 * // Result: { readonly a: { readonly b: string; }; readonly c: number; }
 * ```
 */
export type MakeDeepReadonly<TypeModel> = TypeModel extends PrimitiveValue | AnyFunction
    ? TypeModel
    : Simplify<{
          readonly [Property in keyof TypeModel]: MakeDeepReadonly<TypeModel[Property]>;
      }>;

/**
 * Recursively makes every property optional.
 * @typeParam TypeModel - The type to make partial
 *
 * @example
 * ```ts
 * type Example = { a: { b: string; }; c: number; }
 * type Result = DeepPartial<Example>;
 * // Result: { a?: { b?: string; }; c?: number; }
 * ```
 */
export type DeepPartial<TypeModel> = TypeModel extends AnyFunction
    ? TypeModel
    : TypeModel extends object
      ? Simplify<{ [Property in keyof TypeModel]?: DeepPartial<TypeModel[Property]> }>
      : TypeModel;

/**
 * Recursively makes every property required and removes null/undefined at each level.
 * @typeParam TypeModel - The type to make required
 *
 * @example
 * ```ts
 * type Example = { a?: { b: string | null; } | null; c: number | undefined; }
 * type Result = DeepRequired<Example>;
 * // Result: { a: { b: string; }; c: number; }
 * ```
 */
export type DeepRequired<TypeModel> = TypeModel extends AnyFunction
    ? TypeModel
    : TypeModel extends object
      ? Simplify<{ [Property in keyof TypeModel]-?: DeepRequired<NonNullable<TypeModel[Property]>> }>
      : NonNullable<TypeModel>;

/**
 * Recursively removes null and undefined from a type.
 * @typeParam TypeModel - The type to modify
 *
 * @example
 * ```ts
 * type Example = { a: { b: string | null; } | undefined; c?: number | null; d: null | undefined; }
 * type Result = DeepNonNullable<Example>;
 * // Result: { a: { b: string; }; c: number; d: never; }
 * ```
 */
export type DeepNonNullable<TypeModel> = TypeModel extends AnyFunction
    ? TypeModel
    : TypeModel extends object
      ? Simplify<{ [Property in keyof TypeModel]-?: DeepNonNullable<NonNullable<TypeModel[Property]>> }>
      : NonNullable<TypeModel>;

/**
 * Remove properties from `Source`, preserving the rest exactly.
 * @typeParam Source - The source object type
 * @typeParam KeysOrObj - The keys to omit, or an object type whose keys will be omitted from Source
 *
 * @example
 * ```ts
 * type Source = { a: number; b: string; c: boolean; }
 * type Result1 = OmitProps<Source, 'a' | 'c'>;
 * // Result1: { b: string; }
 *
 * type KeysToOmit = { a: any; c: any; }
 * type Result2 = OmitProps<Source, KeysToOmit>;
 * // Result2: { b: string; }
 * ```
 */
export type OmitProps<Source, KeysOrObj> = Simplify<
    Pick<Source, Exclude<keyof Source, KeysOrObj extends PropertyKey ? KeysOrObj : keyof KeysOrObj>>
>;

/**
 * Ensures that optional properties in an object type explicitly include `undefined` in their type.
 * @typeParam ObjectType - The object type to modify
 *
 * @example
 * ```ts
 * type Example = {
 *   requiredKey: string;
 *   optionalKey?: number;
 * }
 *
 * type Result = EnsureUndefinedForOptionalProps<Example>;
 * // Result: {
 * //   requiredKey: string;
 * //   optionalKey: number | undefined;
 * // }
 * ```
 */
export type EnsureUndefinedForOptionalProps<ObjectType> = Simplify<{
    [Property in keyof ObjectType]: {} extends Pick<ObjectType, Property>
        ? ObjectType[Property] | undefined
        : ObjectType[Property];
}>;
