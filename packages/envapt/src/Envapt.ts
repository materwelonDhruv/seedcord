/* eslint-disable security/detect-bidi-characters */
import { Envapter, EnvaptCache } from './Envapter';
import { Envarser, type EnvaptConverter as EnvaptConverter } from './Parser';

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
   * Built-in converter, custom converter function, or legacy constructor (String, Number, Boolean)
   */
  converter?: EnvaptConverter<FallbackType>;
}

function createPropertyDecorator<FallbackType>(
  key: string,
  fallback: FallbackType | undefined,
  converter: EnvaptConverter<FallbackType> | undefined,
  hasFallback = true
): PropertyDecorator {
  return function (target: object, prop: string | symbol): void {
    const propKey = String(prop);
    const cacheKey = `${target.constructor.name}.${propKey}`;

    // Create a property with a getter that handles environment changes
    Object.defineProperty(target, propKey, {
      get: function () {
        // Check if the environment cache has been cleared (indicating config change)
        // If so, we need to re-evaluate our cached value
        let value = EnvaptCache.get(cacheKey) as FallbackType | null | undefined;

        // Re-evaluate if we don't have a cached value
        if (value === undefined) {
          const parser = new Envarser(new Envapter());
          value = parser.convertValue(key, fallback, converter, hasFallback);
          EnvaptCache.set(cacheKey, value);
        }

        return value;
      },
      configurable: false,
      enumerable: true
    });
  };
}

/**
 * Property decorator that automatically loads and converts environment variables.
 *
 * **IMPORTANT: This decorator is designed for STATIC class properties only.**\
 * Values are set before the class is instantiated.
 *
 * Supports both modern options-based API and legacy parameter-based API.
 * Automatically detects types from fallback values and provides caching for performance.
 *
 * Note: Using \@Envapt on a variable for an env that doesn't exist will set the value to `null` if no fallback is provided, regardless of a converter being used.
 *
 * @param key - Environment variable name to load
 * @param options - Configuration options (modern API)
 *
 * @example Modern API (recommended):
 * ```ts
 * class Config extends Envapter {
 * ‎ ‎ \@Envapt('PORT', { fallback: 3000 })
 * ‎ ‎ static readonly port: number;
 *
 * ‎ ‎ \@Envapt('FEATURES', { fallback: ['auth'], converter: 'array' })
 * ‎ ‎ static readonly features: string[];
 *
 * ‎ ‎ \@Envapt('CONFIG', { converter: 'json' })
 * ‎ ‎ static readonly config: object;
 *
 * ‎ ‎ \@Envapt('API_URL', { converter: 'url' })
 * ‎ ‎ static readonly apiUrl: URL;
 *
 * ‎ ‎ \@Envapt('CUSTOM_LIST', {
 * ‎ ‎ ‎ ‎ fallback: ['default'],
 * ‎ ‎ ‎ ‎ converter: (raw, fallback) => raw ? raw.split('~') : fallback
 * ‎ ‎ })
 * ‎ ‎ static readonly customList: string[];
 * }
 * ```
 *
 * @param key - Environment variable name to load
 * @param fallback - Default value if variable is not found (legacy API)
 * @param converter - Custom converter function or built-in converter (legacy API)
 *
 * @example Legacy API (still supported):
 * ```ts
 * class Config extends Envapter {
 * ‎ ‎ \@Envapt('PORT', 3000, Number)
 * ‎ ‎ static readonly port: number;
 * }
 * ```
 *
 * @public
 */
export function Envapt<FallbackType = unknown>(key: string, options?: EnvaptOptions<FallbackType>): PropertyDecorator;
export function Envapt<FallbackType = unknown>(
  key: string,
  fallback?: FallbackType,
  converter?: EnvaptConverter<FallbackType>
): PropertyDecorator;
export function Envapt<FallbackType = unknown>(
  key: string,
  fallbackOrOptions?: FallbackType | EnvaptOptions<FallbackType>,
  converter?: EnvaptConverter<FallbackType>
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!Reflect)
    throw new Error(
      "@Envapt annotation used without Reflect, have you called import 'reflect-metadata'; in your code?"
    );

  // Determine if using new options API or legacy API
  let fallback: FallbackType | undefined;
  let actualConverter: EnvaptConverter<FallbackType> | undefined;
  let hasFallback = true;

  if (
    fallbackOrOptions &&
    typeof fallbackOrOptions === 'object' &&
    ('fallback' in fallbackOrOptions || 'converter' in fallbackOrOptions)
  ) {
    // New options API
    const options = fallbackOrOptions;
    fallback = options.fallback;
    actualConverter = options.converter;
    hasFallback = 'fallback' in options;
  } else {
    // Legacy API
    fallback = fallbackOrOptions as FallbackType;
    actualConverter = converter;
    hasFallback = arguments.length > 1;
  }

  return createPropertyDecorator(key, fallback, actualConverter, hasFallback);
}
