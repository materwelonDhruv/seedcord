import type { EnvaptConverter } from './Types';

const BuiltInConvertersArray = [
  'string',
  'number',
  'boolean',
  'bigint',
  'symbol',
  'integer',
  'float',
  'json',
  'array:comma',
  'array:space',
  'array:commaspace',
  'url',
  'regexp',
  'date'
] as const;

/**
 * Built-in converter types for common environment variable patterns
 * @public
 */
export type BuiltInConverter = (typeof BuiltInConvertersArray)[number];

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

  static arrayComma(raw: string | undefined, fallback?: string[]): string[] | undefined {
    return BuiltInConverters.array(raw, fallback, ',');
  }

  static arraySemicolon(raw: string | undefined, fallback?: string[]): string[] | undefined {
    return BuiltInConverters.array(raw, fallback, ';');
  }

  static arrayPipe(raw: string | undefined, fallback?: string[]): string[] | undefined {
    return BuiltInConverters.array(raw, fallback, '|');
  }

  static arraySpace(raw: string | undefined, fallback?: string[]): string[] | undefined {
    return BuiltInConverters.array(raw, fallback, ' ');
  }

  static arrayCommaSpace(raw: string | undefined, fallback?: string[]): string[] | undefined {
    return BuiltInConverters.array(raw, fallback, ', ');
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
      case 'array:comma':
        return BuiltInConverters.arrayComma;
      case 'array:space':
        return BuiltInConverters.arraySpace;
      case 'array:commaspace':
        return BuiltInConverters.arrayCommaSpace;
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
}
