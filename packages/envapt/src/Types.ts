import type { BuiltInConvertersArray } from './BuiltInConverters';

/**
 * Built-in converter types for common environment variable patterns
 * @public
 */
type BuiltInConverter = (typeof BuiltInConvertersArray)[number];

/**
 * Primitive types supported by Envapter
 * @public
 */
type PrimitiveConstructor = typeof String | typeof Number | typeof Boolean | typeof BigInt | typeof Symbol;

/**
 * Array converter configuration for custom delimiters and element types
 * @public
 */
interface ArrayConverter {
  /**
   * Delimiter to split the string by
   */
  delimiter: string;
  /**
   * Type to convert each array element to (excludes array, json, and regexp types)
   */
  type?: Exclude<BuiltInConverter, 'array' | 'json' | 'regexp'>;
}

/**
 * String value from a .env file or environment variable
 * @public
 */
type BaseInput = string | undefined;

/**
 * Custom parser function type for environment variables
 * @param raw - Raw string value from environment
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed value of type T
 * @public
 */
type ConverterFunction<FallbackType = unknown> = (raw: BaseInput, fallback?: FallbackType) => FallbackType;

/**
 * Environment variable converter - can be a primitive constructor, built-in converter string, array converter object, or custom parser function
 * @see {@link PrimitiveConstructor} for primitive types
 * @see {@link BuiltInConverter} for built-in types
 * @see {@link ArrayConverter} for array converter configuration
 * @see {@link ConverterFunction} for custom parser functions
 * @public
 */
type EnvaptConverter<FallbackType> =
  | PrimitiveConstructor
  | BuiltInConverter
  | ArrayConverter
  | ConverterFunction<FallbackType>;

/**
 * Options for the \@Envapt decorator (modern API)
 * @public
 */
interface EnvaptOptions<FallbackType = string> {
  /**
   * Default value to use if environment variable is not found
   */
  fallback?: FallbackType;
  /**
   * Built-in converter, custom converter function, or boxed-primitives (String, Number, Boolean)
   */
  converter?: EnvaptConverter<FallbackType>;
}

export type {
  BuiltInConverter,
  PrimitiveConstructor,
  ArrayConverter,
  BaseInput,
  ConverterFunction,
  EnvaptConverter,
  EnvaptOptions
};
