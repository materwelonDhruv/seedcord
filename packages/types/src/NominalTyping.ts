/**
 * Brands a type with a unique identifier to create nominal typing
 * @typeParam BaseType - The base type to brand
 * @typeParam BrandingLabel - A unique string to identify the brand
 */
export type Brand<BaseType, BrandingLabel extends string> = BaseType & { readonly __brand: BrandingLabel };

/**
 * Creates a union type that includes specific literal types as well as any other values of a base type
 * @typeParam LiteralSubset - The specific literal types to include in the union
 * @typeParam BaseType - The broader base type to allow
 */
export type LiteralUnion<LiteralSubset extends BaseType, BaseType = string> =
    | LiteralSubset
    | (BaseType & Record<never, never>);

/**
 * A unique symbol used for branding types
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export declare const __brand: unique symbol;
/**
 * Brands a type strictly by using a unique symbol as key to create nominal typing
 * @typeParam BaseType - The base type to brand
 * @typeParam BrandingLabel - A unique string to identify the brand
 */
export type StrictBrand<BaseType, BrandingLabel extends string> = BaseType & { readonly [__brand]: BrandingLabel };
