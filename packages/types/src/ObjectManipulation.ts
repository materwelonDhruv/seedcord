import type { AnyFunction } from './FunctionTypes';
import type { UnionOfKeys } from './UnionLogic';

/**
 * Simplifies a complex type by resolving intersections and mapped types making it easier to read
 * @typeParam TypeToSimplify - The type to simplify
 *
 * @example
 * ```ts
 * type ComplexType = { a: number } & { b: string };
 * type SimplifiedType = Simplify<ComplexType>; // Result: { a: number; b: string }
 * ```
 */
export type Simplify<TypeToSimplify> = {
    [Property in keyof TypeToSimplify]: TypeToSimplify[Property];
} & {};

/**
 * Merges two object types, with properties from the right type overriding those from the left in case of conflicts
 * @typeParam LeftType - The first object type
 * @typeParam RightType - The second object type
 *
 * @example
 * ```ts
 * type Left = { a: number; b: string };
 * type Right = { b: boolean; c: string };
 * type Merged = Merge<Left, Right>; // Result: { a: number; b: boolean; c: string }
 * ```
 */
export type Merge<LeftType, RightType> = Simplify<Omit<LeftType, keyof RightType> & RightType>;

/**
 * Recursively merges two object types, with properties from the right type overriding those from the left in case of conflicts
 * @typeParam LeftType - The first object type
 * @typeParam RightType - The second object type
 *
 * @example
 * ```ts
 * type Left = { a: { x: number; y: string }; b: string };
 * type Right = { a: { y: boolean; z: string }; c: string };
 * type Merged = DeepMerge<Left, Right>; // Result: { a: { x: number; y: boolean; z: string }; b: string; c: string }
 * ```
 */
export type DeepMerge<LeftType, RightType> = [LeftType] extends [object]
    ? [RightType] extends [object]
        ? LeftType extends AnyFunction | readonly unknown[]
            ? RightType
            : RightType extends AnyFunction | readonly unknown[]
              ? RightType
              : {
                    [Key in keyof LeftType | keyof RightType]: Key extends keyof RightType
                        ? Key extends keyof LeftType
                            ? DeepMerge<LeftType[Key], RightType[Key]>
                            : RightType[Key]
                        : Key extends keyof LeftType
                          ? LeftType[Key]
                          : never;
                }
        : RightType
    : RightType;

/**
 * Builds a record type whose properties are all readonly and have the specified value type.
 * @typeParam KeyType - Keys for the resulting record.
 * @typeParam ValueType - Value for every key in the record.
 *
 * @example
 * ```ts
 * type ReadonlyStringNumberRecord = ReadonlyRecord<string, number>;
 * // Result: { readonly [key: string]: number }
 * ```
 */
export type ReadonlyRecord<KeyType extends PropertyKey, ValueType> = Readonly<Record<KeyType, ValueType>>;

/**
 * Builds a record type whose properties are all optional and have the specified value type.
 * @typeParam KeyType - Keys for the resulting record.
 * @typeParam ValueType - Value for every key in the record.
 *
 * @example
 * ```ts
 * type PartialStringNumberRecord = PartialRecord<string, number>;
 * // Result: { [key: string]?: number }
 * ```
 */
export type PartialRecord<KeyType extends PropertyKey, ValueType> = Partial<Record<KeyType, ValueType>>;

/**
 * Renames a key in an object type
 * @typeParam BaseObj - The object type containing the key to rename
 * @typeParam FromKey - The key to rename
 * @typeParam ToKey - The new name for the key
 *
 * @example
 * ```ts
 * type Original = { oldKey: string; anotherKey: number };
 * type Renamed = RenameKey<Original, 'oldKey', 'newKey'>;
 * // Result: { newKey: string; anotherKey: number }
 * ```
 */
export type RenameKey<BaseObj, FromKey extends UnionOfKeys<BaseObj>, ToKey extends PropertyKey> = {
    [K in keyof BaseObj as K extends FromKey ? ToKey : K]: BaseObj[K];
};

/**
 * Marks properties from `Source` that are not in `Excluded` as optional and `never`
 * @typeParam Source - The source type to remove properties from
 * @typeParam Excluded - The type containing properties to exclude
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type _ForbidExtraKeys<Source, Excluded> = Partial<Record<Exclude<keyof Source, keyof Excluded>, never>>;

/**
 * Creates an exclusive OR type - allows either one type or the other, but not both
 * @typeParam ThisObj - The first type option
 * @typeParam OtherObj - The second type option
 *
 * @example
 * ```ts
 * type A = { a: number; b: string };
 * type B = { c: boolean; d: string };
 * type Result = XOR<A, B>;
 *
 * const example1: Result = { a: 42, b: 'hello' }; // Valid
 * const example2: Result = { c: true, d: 'world' }; // Valid
 * const example3: Result = { a: 42, b: 'hello', c: true }; // Error
 * ```
 */
export type XOR<ThisObj, OtherObj> = ThisObj | OtherObj extends object
    ? (_ForbidExtraKeys<ThisObj, OtherObj> & OtherObj) | (_ForbidExtraKeys<OtherObj, ThisObj> & ThisObj)
    : ThisObj | OtherObj;
