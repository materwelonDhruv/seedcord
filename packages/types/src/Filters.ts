/**
 * Filters string union types to only include those that start with a specific string
 * @typeParam BaseUnion - The union of strings to filter
 * @typeParam StartingString - The string that valid members must start with
 *
 * @example
 * ```ts
 * type Example = 'apple' | 'banana' | 'apricot' | 'cherry';
 * type Result = StartsWith<Example, 'ap'>; // Result: 'apple' | 'apricot'
 * ```
 */
export type StringStartsWith<
    BaseUnion extends string,
    StartingString extends string
> = BaseUnion extends `${StartingString}${string}` ? BaseUnion : never;

/**
 * Filters string union types to only include those that end with a specific string
 * @typeParam BaseUnion - The union of strings to filter
 * @typeParam EndingString - The string that valid members must end with
 *
 * @example
 * ```ts
 * type Example = 'apple' | 'banana' | 'apricot' | 'cherry' | 'strawberry';
 * type Result = EndsWith<Example, 'rry'>; // Result: 'cherry' | 'strawberry'
 * ```
 */
export type StringEndsWith<
    BaseUnion extends string,
    EndingString extends string
> = BaseUnion extends `${string}${EndingString}` ? BaseUnion : never;

/**
 * Filters string union types to only include those that contain a specific substring
 * @typeParam BaseUnion - The union of strings to filter
 * @typeParam Substring - The substring that valid members must contain
 *
 * @example
 * ```ts
 * type Example = 'apple' | 'banana' | 'apricot' | 'cherry' | 'strawberry';
 * type Result = Contains<Example, 'rr'>; // Result: 'cherry' | 'strawberry'
 * ```
 */
export type StringContains<
    BaseUnion extends string,
    Substring extends string
> = BaseUnion extends `${string}${Substring}${string}` ? BaseUnion : never;

/**
 * Picks the keys of an object type that exactly match a specific value type
 * @typeParam Source - The object type to filter keys from
 * @typeParam Value - The value type to match keys against
 *
 * @example
 * ```ts
 * type Example = { id: number; name: string; isActive: boolean; age: number; }
 * type Result = KeysMatchingStrict<Example, number>; // Result: "id" | "age"
 * ```
 */
export type KeysMatchingStrict<Source, Value> = {
    [Property in keyof Source]-?: Source[Property] extends Value ? Property : never;
}[keyof Source];

/**
 * Picks the keys of an object type whose values are assignable to a specific value type
 * @typeParam Source - The object type to filter keys from
 * @typeParam Value - The value type to match keys against
 *
 * @example
 * ```ts
 * type Example = { id: number; name: string; isActive: boolean; age?: number | null; }
 * type Result = KeysMatching<Example, number>; // Result: "id" | "age"
 * ```
 */
export type KeysMatching<Source, Value> = {
    [K in keyof Source]-?: NonNullable<Source[K]> extends Value ? K : never;
}[keyof Source];

/**
 * Picks the properties of an object type that match a specific value type
 * @typeParam Source - The object type to pick properties from
 * @typeParam Value - The value type to match properties against
 *
 * @example
 * ```ts
 * type Example = { id: number; name: string; isActive: boolean; age: number; }
 * type Result = PickByValueStrict<Example, number>; // Result: { id: number; age: number; }
 * ```
 */
export type PickByValueStrict<Source, Value> = Pick<Source, KeysMatchingStrict<Source, Value>>;

/**
 * Picks the properties of an object type whose values are assignable to a specific value type
 * @typeParam Source - The object type to pick properties from
 * @typeParam Value - The value type to match properties against
 *
 * @example
 * ```ts
 * type Example = { id: number; name: string; isActive: boolean; age?: number | null; }
 * type Result = PickByValue<Example, number>; // Result: { id: number; age?: number | null; }
 * ```
 */
export type PickByValue<Source, Value> = Pick<Source, KeysMatching<Source, Value>>;

/**
 * Omits the properties of an object type that match a specific value type
 * @typeParam Source - The object type to omit properties from
 * @typeParam Value - The value type to match properties against
 *
 * @example
 * ```ts
 * type Example = { id: number; name: string; isActive: boolean; age: number; }
 * type Result = OmitByValueStrict<Example, number>; // Result: { name: string; isActive: boolean; }
 * ```
 */
export type OmitByValueStrict<Source, Value> = Omit<Source, KeysMatchingStrict<Source, Value>>;

/**
 * Omits the properties of an object type whose values are assignable to a specific value type
 * @typeParam Source - The object type to omit properties from
 * @typeParam Value - The value type to match properties against
 *
 * @example
 * ```ts
 * type Example = { id: number; name: string; isActive: boolean; age?: number | null; }
 * type Result = OmitByValue<Example, number>; // Result: { name: string; isActive: boolean; }
 * ```
 */
export type OmitByValue<Source, Value> = Omit<Source, KeysMatching<Source, Value>>;
