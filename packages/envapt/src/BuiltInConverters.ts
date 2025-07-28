import type { ArrayConverter, BuiltInConverter, EnvaptConverter } from './Types';

export const BuiltInConvertersArray = [
  'string',
  'number',
  'boolean',
  'bigint',
  'symbol',
  'integer',
  'float',
  'json',
  'array',
  'url',
  'regexp',
  'date'
] as const;

/**
 * Built-in converter implementations
 * @internal
 */
export class BuiltInConverters {
  static string(raw: string | undefined, fallback?: string): string | undefined {
    return raw ?? fallback;
  }

  static number(raw: string | undefined, fallback?: number): number | undefined {
    if (raw === undefined) return fallback;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  static boolean(raw: string | undefined, fallback?: boolean): boolean | undefined {
    if (raw === undefined) return fallback;
    const lower = raw.toLowerCase().trim();

    const truthyValues = ['1', 'yes', 'true', 'on'];
    const falsyValues = ['0', 'no', 'false', 'off'];

    if (truthyValues.includes(lower)) return true;
    if (falsyValues.includes(lower)) return false;
    return fallback;
  }

  static bigint(raw: string | undefined, fallback?: bigint): bigint | undefined {
    if (raw === undefined) return fallback;
    try {
      return BigInt(raw);
    } catch {
      return fallback;
    }
  }

  static symbol(raw: string | undefined, fallback?: symbol): symbol | undefined {
    return raw ? Symbol(raw) : fallback;
  }

  static integer(raw: string | undefined, fallback?: number): number | undefined {
    if (raw === undefined) return fallback;
    const parsed = parseInt(raw, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  static float(raw: string | undefined, fallback?: number): number | undefined {
    if (raw === undefined) return fallback;
    const parsed = parseFloat(raw);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  static json<ParsedJson = unknown>(raw: string | undefined, fallback?: ParsedJson): ParsedJson | undefined {
    if (raw === undefined) return fallback;
    try {
      return JSON.parse(raw) as ParsedJson;
    } catch {
      return fallback;
    }
  }

  static array(raw: string | undefined, fallback?: string[], delimiter = ','): string[] | undefined {
    if (raw === undefined) return fallback;
    if (raw.trim() === '') return [];
    return raw
      .split(delimiter)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  static url(raw: string | undefined, fallback?: URL): URL | undefined {
    if (raw === undefined) return fallback;
    try {
      return new URL(raw);
    } catch {
      return fallback;
    }
  }

  static regexp(raw: string | undefined, fallback?: RegExp): RegExp | undefined {
    if (raw === undefined) return fallback;
    try {
      // Handle flags if provided in format: /pattern/flags
      const match = raw.match(/^\/(.+)\/([gimsuvy]*)$/);
      if (match) return new RegExp(match[1] as string, match[2]);

      return new RegExp(raw);
    } catch {
      return fallback;
    }
  }

  static date(raw: string | undefined, fallback?: Date): Date | undefined {
    if (raw === undefined) return fallback;

    // Try parsing as timestamp first (if it's all digits)
    if (/^\d+$/.test(raw)) {
      const timestamp = parseInt(raw, 10);
      const parsed = new Date(timestamp);
      return Number.isNaN(parsed.getTime()) ? fallback : parsed;
    }

    // Try parsing as regular date string
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? fallback : parsed;
  }

  /**
   * Process array with custom converter config
   */
  static processArrayConverter(
    raw: string | undefined,
    fallback: unknown,
    config: ArrayConverter
  ): unknown[] | undefined {
    // if (raw === undefined) return fallback;
    if (raw === undefined) {
      if (Array.isArray(fallback)) return fallback;
      throw new Error(`ArrayConverter requires that the fallback be an array, got ${typeof fallback}`);
    }

    if (raw.trim() === '') return [];

    const items = raw
      .split(config.delimiter)
      .map((item) => String(item).trim())
      .filter(Boolean);

    // If no type specified, return as string array
    if (!config.type) return items;

    // Convert each item using the specified type
    const converter = BuiltInConverters.getConverter(config.type);
    return items.map((item) => {
      const converted = converter(item, undefined);
      return converted !== undefined ? converted : item;
    });
  }

  /**
   * Check if a value is an ArrayConverter configuration object
   */
  static isArrayConverter(value: unknown): value is ArrayConverter {
    return (
      typeof value === 'object' &&
      value !== null &&
      'delimiter' in value &&
      typeof (value as ArrayConverter).delimiter === 'string'
    );
  }

  /**
   * Check if a value is a valid ArrayConverter type
   */
  static isValidArrayConverterType(value: unknown): value is Exclude<BuiltInConverter, 'array' | 'json' | 'regexp'> {
    if (typeof value !== 'string') return false;

    const validTypes: Exclude<BuiltInConverter, 'array' | 'json' | 'regexp'>[] = [
      'string',
      'number',
      'boolean',
      'integer',
      'bigint',
      'symbol',
      'float',
      'url',
      'date'
    ];

    return validTypes.includes(value as Exclude<BuiltInConverter, 'array' | 'json' | 'regexp'>);
  }

  /**
   * Validate ArrayConverter configuration with runtime checks
   */
  static validateArrayConverter(value: unknown): ArrayConverter {
    if (!this.isArrayConverter(value)) {
      // TODO: add warning logger
      throw new Error('Invalid ArrayConverter configuration: must have delimiter property');
    }

    if (value.type !== undefined && !this.isValidArrayConverterType(value.type)) {
      // TODO: add warning logger
      throw new Error(`Invalid ArrayConverter type: "${value.type}" is not a valid converter type`);
    }

    return value;
  }

  /**
   * Get the converter function for a built-in converter type
   */

  static getConverter(type: BuiltInConverter): Function {
    switch (type) {
      case 'string':
        return BuiltInConverters.string;
      case 'number':
        return BuiltInConverters.number;
      case 'boolean':
        return BuiltInConverters.boolean;
      case 'integer':
        return BuiltInConverters.integer;
      case 'bigint':
        return BuiltInConverters.bigint;
      case 'symbol':
        return BuiltInConverters.symbol;
      case 'float':
        return BuiltInConverters.float;
      case 'json':
        return BuiltInConverters.json;
      case 'array':
        return BuiltInConverters.array;
      case 'url':
        return BuiltInConverters.url;
      case 'regexp':
        return BuiltInConverters.regexp;
      case 'date':
        return BuiltInConverters.date;
      default:
        throw new Error(`Unknown built-in converter: ${type}`);
    }
  }

  /**
   * Check if a value is a built-in converter type
   */
  static isBuiltInConverter(value: EnvaptConverter<unknown>): value is BuiltInConverter {
    if (typeof value === 'string') return BuiltInConvertersArray.includes(value);
    return false;
  }

  /**
   * Validate that a string is a valid built-in converter type
   */
  static validateBuiltInConverter(value: unknown): BuiltInConverter {
    if (typeof value !== 'string') {
      // TODO: add warning logger
      throw new Error(`Invalid converter type: expected string, got ${typeof value}`);
    }

    if (!BuiltInConvertersArray.includes(value as BuiltInConverter)) {
      // TODO: add warning logger
      throw new Error(
        `Invalid built-in converter: "${value}" is not a valid converter type. Valid types are: ${BuiltInConvertersArray.join(', ')}`
      );
    }

    return value as BuiltInConverter;
  }
}
