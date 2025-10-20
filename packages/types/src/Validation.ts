import type { Simplify } from './ObjectManipulation';
import type { UnionOfKeys } from './UnionLogic';

/**
 * Forbids extra properties beyond those in ExpectedShape.
 *
 * @typeParam ExpectedShape - The expected shape of the object
 * @typeParam Candidate - The candidate type to check for excess properties
 *
 * @example
 * ```ts
 * interface Expected = { a: number; b: string };
 *
 * function test<T extends Expected>(obj: StrictObject<Expected, T>) {...}
 *
 * const a = { a: 42, b: 'hello' };
 * const b = { a: 42, b: 'hello', c: 'okok' };
 *
 * test(a); // OK
 * test(b); // Error: Types of property 'c' are incompatible. Type 'string' is not assignable to type 'never'.
 * ```
 */
export type StrictObject<ExpectedShape, Candidate extends ExpectedShape> = {
    [Key in keyof Candidate]: Key extends Exclude<keyof Candidate, keyof ExpectedShape> ? never : Candidate[Key];
};

/**
 * Makes a union “strict”: for each variant, keys from other variants are set to never.
 * Great for discriminated unions so extra keys don’t silently pass.
 * @typeParam UnionType - The union type to make strict
 *
 * @example
 * ```ts
 * type Shape =
 *   | { type: 'circle'; radius: number }
 *   | { type: 'square'; sideLength: number };
 *
 * type StrictShape = StrictUnion<Shape>;
 *
 * const validCircle: StrictShape = { type: 'circle', radius: 10 }; // Valid
 * const invalidCircle: StrictShape = { type: 'circle', radius: 10, sideLength: 5 }; // Error
 * ```
 */
export type StrictUnion<UnionType> = UnionType extends unknown
    ? Simplify<UnionType & Partial<Record<Exclude<UnionOfKeys<UnionType>, keyof UnionType>, never>>>
    : never;

/**
 * Helper type to check if two types are equal.
 * @typeParam Left - The first type
 * @typeParam Right - The second type
 * @typeParam Then - The type to return if equal
 * @typeParam Else - The type to return if not equal
 *
 * @example
 * ```ts
 * type IsEqual = Equals<number, number, true, false>; // Result: true
 * type IsNotEqual = Equals<number, string, true, false>; // Result: false
 * ```
 */
export type Equals<Left, Right, Then, Else = never> =
    (<Temp>() => Temp extends Left ? 1 : 2) extends <Temp>() => Temp extends Right ? 1 : 2 ? Then : Else;
