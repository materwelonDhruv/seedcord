/**
 * Type-safe version of Omit that ensures the keys exist on the target object
 * @typeParam TargetObj - The object type to omit properties from
 * @typeParam ObjKeys - The keys to omit from the object
 */
export type TypedOmit<TargetObj, ObjKeys extends keyof TargetObj> = Omit<TargetObj, ObjKeys>;
/**
 * Type-safe version of Exclude that ensures the excluded types are valid members
 * @typeParam Target - The union type to exclude from
 * @typeParam UnionKeys - The types to exclude from the union
 */

export type TypedExclude<Target, UnionKeys extends Target> = Exclude<Target, UnionKeys>;
/**
 * Type-safe version of Extract that ensures the extracted types are valid members
 * @typeParam Target - The union type to extract from
 * @typeParam UnionKeys - The types to extract from the union
 */

export type TypedExtract<Target, UnionKeys extends Target> = Extract<Target, UnionKeys>;

/**
 * Extracts the constructor signature from a constructor type
 * @typeParam ConstructorType - The constructor type to extract the signature from
 */
export type TypedConstructor<ConstructorType> = ConstructorType extends new (...args: infer A) => infer R
    ? new (...args: A) => R
    : ConstructorType extends abstract new (...args: infer A) => infer R
      ? new (...args: A) => R
      : never;
