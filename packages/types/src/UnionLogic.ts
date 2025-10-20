import type { Simplify } from './ObjectManipulation';

/**
 * Converts a union type to an intersection type
 * @typeParam UnionType - The union type to convert to an intersection
 *
 * @example
 * ```ts
 * type A = { a: number };
 * type B = { b: string };
 * type C = { c: boolean };
 * type Union = A | B | C;
 * type Intersection = UnionToIntersection<Union>; //  A & B & C
 * ```
 */
export type UnionToIntersection<UnionType> = (UnionType extends unknown ? (k: UnionType) => void : never) extends (
    k: infer Intersection
) => void
    ? Intersection
    : never;

/**
 * Gets the last type from a union type
 * @typeParam UnionType - The union type to get the last member from
 *
 * @example
 * ```ts
 * type Last = LastOf<'a' | 'b' | 'c'>; // Result: 'c'
 * ```
 */
export type LastOf<UnionType> =
    UnionToIntersection<UnionType extends unknown ? (x: UnionType) => 0 : never> extends (x: infer L) => 0 ? L : never;

/**
 * Converts a union type to a tuple type
 * @typeParam UnionType - The union type to convert to a tuple
 *
 * @example
 * ```ts
 * type Tuple = UnionToTuple<'a' | 'b' | 'c'>; // Result: ['a', 'b', 'c'] (order may vary)
 * ```
 */
export type UnionToTuple<UnionType, TupleArray extends unknown[] = []> = [UnionType] extends [never]
    ? TupleArray
    : UnionToTuple<Exclude<UnionType, LastOf<UnionType>>, [LastOf<UnionType>, ...TupleArray]>;

/**
 * Gets all keys from all members of a union type. (Distributive keyof). Shallow.
 * @typeParam UnionType - The union type to extract keys from
 *
 * @example
 * ```ts
 * type Union = { a: number } | { b: string } | { c: boolean };
 * type Keys = KeysOfUnion<Union>; // Result: 'a' | 'b' | 'c'
 * ```
 */
export type UnionOfKeys<UnionType> = UnionType extends unknown ? keyof UnionType : never;

/**
 * Gets a union of all values from the properties of an object type (Distributive value extraction). Shallow.
 * @typeParam ObjectType - The object type to extract values from
 *
 * @example
 * ```ts
 * type Example = { a: 1; b: 2; c: 3 };
 * type Values = UnionOfValues<Example>; // Result: 1 | 2 | 3
 * ```
 */
export type UnionOfValues<ObjectType> = ObjectType[keyof ObjectType];

/**
 * Omits specific keys from all members of a distributive union type.
 * @typeParam UnionType - The union type to omit keys from
 * @typeParam KeysToOmit - The keys to omit
 *
 * @example
 * ```ts
 * type Union = { a: number; b: string } | { a: boolean; c: string };
 * type Omitted = OmitFromUnion<Union, 'a'>; // Result: { b: string } | { c: string }
 * ```
 */
export type OmitFromUnion<UnionType, KeysToOmit extends UnionOfKeys<UnionType>> = UnionType extends unknown
    ? Simplify<Omit<UnionType, KeysToOmit>>
    : never;

/**
 * Picks specific keys from all members of a distributive union type.
 * @typeParam UnionType - The union type to pick keys from
 * @typeParam KeysToPick - The keys to pick
 *
 * @example
 * ```ts
 * type Union = { a: number; b: string } | { a: boolean; c: string };
 * type Picked = PickFromUnion<Union, 'a'>; // Result: { a: number } | { a: boolean }
 * ```
 */
export type PickFromUnion<UnionType, KeysToPick extends UnionOfKeys<UnionType>> = UnionType extends unknown
    ? Simplify<Pick<UnionType, KeysToPick>>
    : never;

/**
 * Keeps only those union members where PropertyKey exists and matches PropertyValue.
 * @typeParam UnionType - The union type to filter
 * @typeParam PropKey - The property key to check
 * @typeParam PropertyValue - The property value to match
 *
 * @example
 * ```ts
 * type Shape =
 *   | { type: 'circle'; radius: number }
 *   | { type: 'square'; sideLength: number }
 *   | { type: 'rectangle'; width: number; height: number };
 *
 * type Circles = FilterUnionByProperty<Shape, 'type', 'circle'>;
 * // Result: { type: 'circle'; radius: number }
 * ```
 */
export type FilterUnionByProperty<
    UnionType,
    PropKey extends UnionOfKeys<UnionType>,
    PropertyValue extends UnionOfValues<UnionType>
> = UnionType extends Record<PropKey, PropertyValue> ? UnionType : never;

/**
 * Creates a union type representing a range of numbers
 * @typeParam Lower - The lower bound of the range
 * @typeParam Upper - The upper bound of the range
 *
 * @example
 * ```ts
 * type Range = NumberRange<2, 5>; // Result: 2 | 3 | 4 | 5
 * ```
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
