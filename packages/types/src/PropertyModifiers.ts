import type { AnyFunction } from './FunctionTypes';
import type { Simplify } from './ObjectManipulation';
import type { PrimitiveValue } from './PrimitiveUtils';

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
 * Either all of the provided keys must be present (and required) or none of them may appear.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make all-or-none
 */

export type RequireAllOrNone<ObjectType, PropertyKeys extends keyof ObjectType> =
    | (Omit<ObjectType, PropertyKeys> & Required<Pick<ObjectType, PropertyKeys>>)
    | (Omit<ObjectType, PropertyKeys> & Partial<Record<PropertyKeys, never>>);

/**
 * Makes all properties of an object type optional except for the specified required keys.
 * @typeParam ObjectType - The object type to modify
 * @typeParam RequiredPropertyKeys - The keys of the object type to keep required
 */

export type PartialExcept<ObjectType, RequiredPropertyKeys extends keyof ObjectType> = Simplify<
    Pick<ObjectType, RequiredPropertyKeys> & Partial<Omit<ObjectType, RequiredPropertyKeys>>
>;

/**
 * Makes just the specified keys optional; everything else remains as-is.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make optional
 */

export type PartialBy<ObjectType, PropertyKeys extends keyof ObjectType> = Simplify<
    Omit<ObjectType, PropertyKeys> & Partial<Pick<ObjectType, PropertyKeys>>
>;

/**
 * Makes just the specified keys required; everything else remains as-is.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make required
 */
export type RequiredBy<ObjectType, PropertyKeys extends keyof ObjectType> = Simplify<
    Omit<ObjectType, PropertyKeys> & Required<Pick<ObjectType, PropertyKeys>>
>;

/**
 * Makes just the specified keys readonly; everything else remains as-is.
 * @typeParam ObjectType - The object type to modify
 * @typeParam PropertyKeys - The keys of the object type to make readonly
 */
export type ReadonlyBy<ObjectType, PropertyKeys extends keyof ObjectType> = Simplify<
    Omit<ObjectType, PropertyKeys> & Readonly<Pick<ObjectType, PropertyKeys>>
>;

/**
 * Recursively makes all properties of a type mutable (removes readonly)
 * @typeParam TypeModel - The type to make mutable
 */
export type DeepMutable<TypeModel> = TypeModel extends PrimitiveValue | AnyFunction
    ? TypeModel
    : {
          -readonly [Property in keyof TypeModel]: DeepMutable<TypeModel[Property]>;
      };

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
    : {
          readonly [Property in keyof TypeModel]: DeepReadonly<TypeModel[Property]>;
      };

/**
 * Shallowly makes all properties of a type readonly
 * @typeParam TypeModel - The type to make readonly
 */
export type ShallowReadonly<TypeModel> = {
    readonly [Property in keyof TypeModel]: TypeModel[Property];
};

/**
 * Recursively makes every property optional.
 * @typeParam TypeModel - The type to make partial
 */
export type DeepPartial<TypeModel> = TypeModel extends AnyFunction
    ? TypeModel
    : TypeModel extends object
      ? { [Property in keyof TypeModel]?: DeepPartial<TypeModel[Property]> }
      : TypeModel;

/**
 * Recursively makes every property required and removes null/undefined at each level.
 * @typeParam TypeModel - The type to make required
 */
export type DeepRequired<TypeModel> = TypeModel extends AnyFunction
    ? TypeModel
    : TypeModel extends object
      ? { [Property in keyof TypeModel]-?: DeepRequired<NonNullable<TypeModel[Property]>> }
      : NonNullable<TypeModel>;

/**
 * Recursively removes null and undefined from a type.
 * @typeParam TypeModel - The type to modify
 */
export type DeepNonNullable<TypeModel> = TypeModel extends AnyFunction
    ? TypeModel
    : TypeModel extends object
      ? { [Property in keyof TypeModel]-?: DeepNonNullable<NonNullable<TypeModel[Property]>> }
      : NonNullable<TypeModel>;
