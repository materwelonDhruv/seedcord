/**
 * Creates a tuple of repeated elements with a specific length
 * @typeParam Element - The type of element to repeat in the tuple
 * @typeParam Length - The desired length of the tuple
 */

export type TupleOf<Element, Length extends number, Result extends unknown[] = []> = Result['length'] extends Length
    ? Result
    : TupleOf<Element, Length, [...Result, Element]>;
/**
 * Extracts all parameters after the first one from a tuple type
 * @typeParam TArgs - The tuple type to extract the tail from
 */

export type Tail<TArgs extends unknown[]> = TArgs extends [unknown, ...infer R] ? R : never;
/**
 * A tuple that guarantees at least one element.
 * @typeParam ElementType - The type of elements in the array
 */

export type NonEmptyArray<ElementType> = [ElementType, ...ElementType[]];
/**
 * Accept a single value or an array of values.
 * @typeParam ElementType - The type of the element(s)
 */

export type OneOrArray<ElementType> = ElementType | ElementType[];
