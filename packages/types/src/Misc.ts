/**
 * Makes at least one property of an object type required. It will make all properties of ObjectType optional if `Keys` is not provided.
 * @typeParam ObjectType - The object type to modify
 * @typeParam Keys - The keys of the object type to make required (defaults to all keys)
 */
export type RequireAtLeastOne<ObjectType, Keys extends keyof ObjectType = keyof ObjectType> = Omit<ObjectType, Keys> &
    {
        [Key in Keys]-?: Required<Pick<ObjectType, Key>> & Partial<Omit<Pick<ObjectType, Keys>, Key>>;
    }[Keys];

/**
 * Makes exactly one property of an object type required, and all others optional.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make exactly one required (defaults to all keys)
 */
export type RequireExactlyOne<ObjectType, PropertyKeys extends keyof ObjectType = keyof ObjectType> = Omit<
    ObjectType,
    PropertyKeys
> &
    {
        [Property in PropertyKeys]-?: Required<Pick<ObjectType, Property>> &
            Partial<Record<Exclude<PropertyKeys, Property>, never>>;
    }[PropertyKeys];

/**
 * Makes a type nullable by adding null and undefined
 * @typeParam Value - The type to make nullable
 */
export type Nullable<Value = null> = Value extends null ? null | undefined : Value | null | undefined;

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
 * Creates a tuple of repeated elements with a specific length
 * @typeParam Element - The type of element to repeat in the tuple
 * @typeParam Length - The desired length of the tuple
 */
export type TupleOf<Element, Length extends number, Result extends unknown[] = []> = Result['length'] extends Length
    ? Result
    : TupleOf<Element, Length, [...Result, Element]>;

/**
 * Removes properties from Source that exist in Excluded
 * @typeParam Source - The source type to remove properties from
 * @typeParam Excluded - The type containing properties to exclude
 */
export type Without<Source, Excluded> = Partial<Record<Exclude<keyof Source, keyof Excluded>, never>>;

/**
 * Creates an exclusive OR type - allows either one type or the other, but not both
 * @typeParam ThisObj - The first type option
 * @typeParam OtherObj - The second type option
 */
export type XOR<ThisObj, OtherObj> = ThisObj | OtherObj extends object
    ? (Without<ThisObj, OtherObj> & OtherObj) | (Without<OtherObj, ThisObj> & ThisObj)
    : ThisObj | OtherObj;

/** Represents any constructor function that can be instantiated with new */
export type ConstructorFunction = new (...args: any[]) => unknown;

/**
 * Filters string union types to only include those that start with a specific string
 * @typeParam BaseUnion - The union of strings to filter
 * @typeParam StartingString - The string that valid members must start with
 */
export type StartsWith<
    BaseUnion extends string,
    StartingString extends string
> = BaseUnion extends `${StartingString}${string}` ? BaseUnion : never;

/**
 * Converts a union type to an intersection type
 * @typeParam UnionType - The union type to convert to an intersection
 */
export type UnionToIntersection<UnionType> = (UnionType extends unknown ? (k: UnionType) => void : never) extends (
    k: infer Intersection
) => void
    ? Intersection
    : never;

/**
 * Gets the last type from a union type
 * @typeParam UnionType - The union type to get the last member from
 */
export type LastOf<UnionType> =
    UnionToIntersection<UnionType extends unknown ? (x: UnionType) => 0 : never> extends (x: infer L) => 0 ? L : never;

/**
 * Extracts all parameters after the first one from a tuple type
 * @typeParam TArgs - The tuple type to extract the tail from
 */
export type Tail<TArgs extends unknown[]> = TArgs extends [unknown, ...infer R] ? R : never;

/**
 * Converts a union type to a tuple type
 * @typeParam UnionType - The union type to convert to a tuple
 */
export type UnionToTuple<UnionType, TupleArray extends unknown[] = []> = [UnionType] extends [never]
    ? TupleArray
    : UnionToTuple<Exclude<UnionType, LastOf<UnionType>>, [LastOf<UnionType>, ...TupleArray]>;

/**
 * Renames a key in an object type
 * @typeParam BaseObj - The object type containing the key to rename
 * @typeParam FromKey - The key to rename
 * @typeParam ToKey - The new name for the key
 */
export type RenameKey<BaseObj, FromKey extends PropertyKey, ToKey extends PropertyKey> = {
    [K in keyof BaseObj as K extends FromKey ? ToKey : K]: BaseObj[K];
};

/**
 * Brands a type with a unique identifier to create nominal typing
 * @typeParam BaseType - The base type to brand
 * @typeParam BrandingLabel - A unique string to identify the brand
 */
export type Brand<BaseType, BrandingLabel extends string> = BaseType & { readonly __brand: BrandingLabel };

/**
 * Simplifies a complex type by resolving intersections and mapped types making it easier to read
 * @typeParam TypeToSimplify - The type to simplify
 */
export type Simplify<TypeToSimplify> = { [Property in keyof TypeToSimplify]: TypeToSimplify[Property] } & {};

/**
 * Merges two object types, with properties from the right type overriding those from the left in case of conflicts
 * @typeParam LeftType - The first object type
 * @typeParam RightType - The second object type
 */
export type Merge<LeftType, RightType> = Simplify<Omit<LeftType, keyof RightType> & RightType>;

/**
 * Primitive value types in TypeScript
 */
export type PrimitiveValue = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Represents any function type
 */
export type AnyFunction = (...args: any[]) => unknown;

/**
 * Represents any asynchronous function type
 */
export type AnyAsyncFunction = (...args: any[]) => Promise<unknown>;

/**
 * A type that can be either a value of TypeModel or a Promise that resolves to TypeModel
 * @typeParam TypeModel - The type to make awaitable
 */
export type Awaitable<TypeModel> = TypeModel | Promise<TypeModel>;

/**
 * Recursively makes all properties of a type mutable (removes readonly)
 * @typeParam TypeModel - The type to make mutable
 */
export type MutableDeep<TypeModel> = TypeModel extends PrimitiveValue | AnyFunction
    ? TypeModel
    : { -readonly [Property in keyof TypeModel]: MutableDeep<TypeModel[Property]> };

/**
 * Shallowly makes all properties of a type mutable (removes readonly)
 * @typeParam TypeModel - The type to make mutable
 */
export type ShallowMutable<TypeModel> = {
    -readonly [Property in keyof TypeModel]: TypeModel[Property];
};

/**
 * Recursively makes all properties of a type readonly
 * @typeParam TypeModel - The type to make readonly
 */
export type DeepReadonly<TypeModel> = TypeModel extends PrimitiveValue | AnyFunction
    ? TypeModel
    : { readonly [Property in keyof TypeModel]: DeepReadonly<TypeModel[Property]> };

/**
 * Shallowly makes all properties of a type readonly
 * @typeParam TypeModel - The type to make readonly
 */
export type ShallowReadonly<TypeModel> = {
    readonly [Property in keyof TypeModel]: TypeModel[Property];
};

/**
 * Gets the keys of an object type that match a specific value type
 * @typeParam ObjectType - The object type to filter keys from
 * @typeParam ValueType - The value type to match keys against
 */
export type KeysMatching<ObjectType, ValueType> = {
    [Property in keyof ObjectType]-?: ObjectType[Property] extends ValueType ? Property : never;
}[keyof ObjectType];

/**
 * Picks the properties of an object type that match a specific value type
 * @typeParam ObjectType - The object type to pick properties from
 * @typeParam ValueType - The value type to match properties against
 */
export type PickByValue<ObjectType, ValueType> = Pick<ObjectType, KeysMatching<ObjectType, ValueType>>;

/**
 * Builds a record type whose properties are all readonly.
 * @typeParam KeyType - Keys for the resulting record.
 * @typeParam ValueType - Value for every key in the record.
 */
export type ReadonlyRecord<KeyType extends PropertyKey, ValueType> = Readonly<Record<KeyType, ValueType>>;
