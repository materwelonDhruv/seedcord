/**
 * Creates a union type that includes specific literal types as well as any other values of a base type
 * @typeParam LiteralSubset - The specific literal types to include in the union
 * @typeParam BaseType - The broader base type to allow
 *
 * @example
 * ```ts
 * type Color = LiteralUnion<'red' | 'green' | 'blue', string>;
 * let myColor: Color;
 * myColor = 'red'; // OK
 * myColor = 'yellow'; // OK
 * myColor = 42; // Error: Type 'number' is not assignable to type 'Color'
 * ```
 */
export type LiteralUnion<LiteralSubset extends BaseType, BaseType = string> =
    | LiteralSubset
    | (BaseType & Record<never, never>);

/**
 * A unique symbol used for branding types
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export declare const __brand: unique symbol;

/**
 * Brands a type strictly by using a unique symbol as key to create nominal typing.
 * @typeParam BaseType - The base type to brand
 * @typeParam BrandingLabel - A unique string to identify the brand
 *
 * @example
 * ```ts
 * type UserId = StrictBrand<number, 'UserId'>;
 * type OrderId = StrictBrand<number, 'OrderId'>;
 * let userId: UserId = 123 as UserId;
 * let orderId: OrderId = 456 as OrderId;
 *
 * // The following assignment would cause a TypeScript error
 * userId = orderId; // Error: Type 'OrderId' is not assignable to type 'UserId'
 *
 * // But you can still use the underlying type
 * let rawId: number = userId; // OK
 * ```
 */
export type Brand<BaseType, BrandingLabel extends string> = BaseType & { readonly [__brand]: BrandingLabel };
