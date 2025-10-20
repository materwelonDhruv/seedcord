/**
 * Simplifies a complex type by resolving intersections and mapped types making it easier to read
 * @typeParam TypeToSimplify - The type to simplify
 */
export type Simplify<TypeToSimplify> = {
    [Property in keyof TypeToSimplify]: TypeToSimplify[Property];
} & {};

/**
 * Merges two object types, with properties from the right type overriding those from the left in case of conflicts
 * @typeParam LeftType - The first object type
 * @typeParam RightType - The second object type
 */
export type Merge<LeftType, RightType> = Simplify<Omit<LeftType, keyof RightType> & RightType>; /**

* Builds a record type whose properties are all readonly.
 * @typeParam KeyType - Keys for the resulting record.
 * @typeParam ValueType - Value for every key in the record.
 */
export type ReadonlyRecord<KeyType extends PropertyKey, ValueType> = Readonly<Record<KeyType, ValueType>>; /**

* Renames a key in an object type
 * @typeParam BaseObj - The object type containing the key to rename
 * @typeParam FromKey - The key to rename
 * @typeParam ToKey - The new name for the key
 */
export type RenameKey<BaseObj, FromKey extends PropertyKey, ToKey extends PropertyKey> = {
    [K in keyof BaseObj as K extends FromKey ? ToKey : K]: BaseObj[K];
};
