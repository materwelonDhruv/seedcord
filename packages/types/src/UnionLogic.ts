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
 * Converts a union type to a tuple type
 * @typeParam UnionType - The union type to convert to a tuple
 */
export type UnionToTuple<UnionType, TupleArray extends unknown[] = []> = [UnionType] extends [never]
    ? TupleArray
    : UnionToTuple<Exclude<UnionType, LastOf<UnionType>>, [LastOf<UnionType>, ...TupleArray]>;
