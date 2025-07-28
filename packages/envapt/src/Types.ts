/**
 * Primitive types supported by Envapter
 * @public
 */
import type { BuiltInConverter } from './BuiltInConverters';

/**
 * Primitive types supported by Envapter
 * @public
 */
export type PrimitiveConstructor = typeof String | typeof Number | typeof Boolean | typeof BigInt | typeof Symbol;

/**
 * Options for the \@Envapt decorator (modern API)
 * @public
 */
export interface EnvaptOptions<FallbackType = string> {
  /**
   * Default value to use if environment variable is not found
   */
  fallback?: FallbackType;
  /**
   * Built-in converter, custom converter function, or boxed-primitives (String, Number, Boolean)
   */
  converter?: EnvaptConverter<FallbackType>;
}

/**
 * String value from a .env file or environment variable
 * @public
 */
export type BaseInput = string | undefined;

/**
 * Custom parser function type for environment variables
 * @param raw - Raw string value from environment
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed value of type T
 * @public
 */
export type ConverterFunction<FallbackType = unknown> = (raw: BaseInput, fallback?: FallbackType) => FallbackType;

/**
 * Environment variable converter - can be a built-in constructor, built-in converter string, or custom parser function
 * @see {@link BuiltInConverter} for built-in types
 * @see {@link ConverterFunction} for custom parser functions
 * @public
 */
export type EnvaptConverter<FallbackType> = PrimitiveConstructor | BuiltInConverter | ConverterFunction<FallbackType>;
