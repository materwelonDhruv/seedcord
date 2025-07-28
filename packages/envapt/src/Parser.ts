import { BuiltInConverters } from './BuiltInConverters';

import type { EnvaptConverter, ConverterFunction, BuiltInConverter } from './Types';

/**
 * @internal
 */
export interface EnvapterService {
  getRaw(key: string): string | undefined;
  get(key: string, def?: string): string;
  getNumber(key: string, def?: number): number;
  getBoolean(key: string, def?: boolean): boolean;
}

/**
 * Parser class for handling environment variable template resolution and type conversion
 * @internal
 */
export class Parser {
  private readonly TEMPLATE_REGEX = /\${\w*}/g;

  constructor(private readonly envService: EnvapterService) {}

  resolveValueString(key: string, value: string, stack = new Set<string>()): string {
    if (stack.has(key)) return value; // direct cycle, keep as is

    stack.add(key);

    const out = value.replace(this.TEMPLATE_REGEX, (template) => {
      const variable = template.slice(2, -1);
      if (!variable) return template; // empty name, preserve

      if (stack.has(variable)) return template; // cycle, preserve

      const raw = this.envService.getRaw(variable);
      if (!raw || raw === '') return template; // missing or empty, preserve

      const resolved = this.resolveValueString(variable, raw, new Set(stack));

      // If resolution still references the current key, skip replacement (indirect cycle)
      if (resolved.includes(`\${${key}}`)) return template;

      // If nothing changed (unresolved placeholders stayed), also preserve original template
      if (resolved === raw && /\$\{[^}]*\}/.test(resolved)) return template;

      return resolved;
    });

    stack.delete(key);
    return out;
  }

  convertValue<FallbackType>(
    key: string,
    fallback: FallbackType | undefined,
    converter: EnvaptConverter<FallbackType> | undefined,
    hasFallback = true
  ): FallbackType | null | undefined {
    // Determine which converter to use
    let resolvedConverter = this.resolveConverter(converter, fallback);

    if (resolvedConverter === Number) resolvedConverter = 'number';
    else if (resolvedConverter === Boolean) resolvedConverter = 'boolean';
    else if (resolvedConverter === String) resolvedConverter = 'string';
    else if (resolvedConverter === BigInt) resolvedConverter = 'bigint';
    else if (resolvedConverter === Symbol) resolvedConverter = 'symbol';

    // Check if it's an ArrayConverter object
    if (BuiltInConverters.isArrayConverter(resolvedConverter)) {
      const parsed = this.envService.get(key, undefined);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (parsed === undefined) return hasFallback ? fallback : null;

      return BuiltInConverters.processArrayConverter(parsed, fallback, resolvedConverter) as FallbackType;
    }

    // Check if it's a built-in converter
    if (BuiltInConverters.isBuiltInConverter(resolvedConverter as EnvaptConverter<unknown>)) {
      const parsed = this.envService.get(key, undefined);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (parsed === undefined) return hasFallback ? fallback : null;

      const converterFn = BuiltInConverters.getConverter(resolvedConverter as BuiltInConverter);
      return converterFn(parsed, fallback);
    }

    // Custom converter function
    const raw = this.envService.get(key, undefined);

    // If no fallback provided and no value found, return null
    // If explicit undefined fallback and no value found, return undefined
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (raw === undefined) return hasFallback ? fallback : null;

    return (resolvedConverter as ConverterFunction<FallbackType>)(raw, fallback);
  }

  private resolveConverter<FallbackType>(
    converter: EnvaptConverter<FallbackType> | undefined,
    fallback: FallbackType | undefined
  ): EnvaptConverter<FallbackType> {
    // User provided explicit converter. Use it
    if (converter) return converter;

    // Auto-detect type from fallback using typeof
    const fallbackType = typeof fallback;
    if (fallbackType === 'number') return 'number';
    if (fallbackType === 'boolean') return 'boolean';
    return 'string';
  }
}
