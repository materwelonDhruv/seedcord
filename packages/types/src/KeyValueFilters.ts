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
