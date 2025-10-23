import type { ILogger } from '@seedcord/types';
import type { JsonPrimitive } from 'type-fest';

/**
 * JSONify an arbitrary type while allowing any object position to be replaced
 * by a circular marker. Optional keys stay optional.
 */
export type JsonifyWithCirculars<BaseType, Marker extends string = '[Circular]'> =
    // primitives
    BaseType extends JsonPrimitive
        ? BaseType
        : // BigInt becomes string
          BaseType extends bigint
          ? string
          : // Dates serialize to ISO strings
            BaseType extends Date
            ? string
            : // Honor explicit toJSON
              BaseType extends { toJSON(): infer J }
              ? JsonifyWithCirculars<J, Marker>
              : // Arrays and tuples
                BaseType extends readonly (infer U)[]
                ? (JsonifyWithCirculars<U, Marker> | Marker)[]
                : // Maps and Sets get structural JSON forms
                  BaseType extends Map<infer K, infer V>
                  ? [JsonifyWithCirculars<K, Marker> | Marker, JsonifyWithCirculars<V, Marker> | Marker][]
                  : BaseType extends Set<infer U2>
                    ? (JsonifyWithCirculars<U2, Marker> | Marker)[]
                    : // Objects
                      BaseType extends object
                      ? { [K in keyof BaseType]: JsonifyWithCirculars<BaseType[K], Marker> | Marker }
                      : never;

/**
 * Configuration for {@link filterCirculars}.
 */
export interface FilterCircularsOptions<Marker extends string = '[Circular]'> {
    /** Optional {@link ILogger} (can use {@link Logger} from `@seedcord/services`) used to log any stringify or parse errors. */
    logger?: ILogger;
    /** Override the circular placeholder string. Default is `[Circular]`. */
    marker?: Marker;
}

/**
 * Creates a clean, JSON-safe copy of an object and replaces any circular references with "[Circular]".
 *
 * It works like `JSON.stringify` and `JSON.parse`, but handles common edge cases safely:
 * - Circular references won’t crash the process.
 * - `BigInt` values are converted to strings so they stay valid JSON.
 * - If something goes wrong during stringify or parse, it logs through the provided logger.
 *
 * @typeParam ObjType - Type of the input and returned value.
 *
 * @param value - The value or object to clone safely.
 * @param options - Optional configuration.
 *
 * @returns A new object or value with circular references replaced and other data preserved.
 *
 * @example
 * ```ts
 * interface Test {
 *   name: string;
 *   self?: Test;
 * }
 *
 * const obj: Test = { name: 'seedcord' };
 * obj.self = obj;
 *
 * const clean = filterCirculars(obj);
 * //     ^? { name: 'seedcord', self: "[Circular]" | ...; }
 * console.log(clean.self); // Output: "[Circular]"
 * ```
 */
export function filterCirculars<ObjType, Marker extends string = '[Circular]'>(
    value: ObjType,
    options?: FilterCircularsOptions<Marker>
): JsonifyWithCirculars<ObjType, Marker> {
    const seen = new WeakSet<object>();
    const logger = options?.logger;
    let json: string | undefined;

    try {
        json = JSON.stringify(value, (_k: string, v: unknown) => {
            if (typeof v === 'bigint') return v.toString();
            if (typeof v === 'object' && v !== null) {
                const obj = v;
                if (seen.has(obj)) return '[Circular]';
                seen.add(obj);
            }
            return v;
        });
    } catch (error) {
        logger?.error('filterCirculars stringify error', error);
        if (typeof value === 'object' && value !== null) {
            logger?.error('top level keys', Object.keys(value));
        }
        return value as JsonifyWithCirculars<ObjType, Marker>;
    }

    if (typeof json !== 'string') return value as JsonifyWithCirculars<ObjType, Marker>;

    try {
        return JSON.parse(json) as JsonifyWithCirculars<ObjType, Marker>;
    } catch (error) {
        logger?.error('filterCirculars parse error', error);
        logger?.error('bad JSON', json);
        return value as JsonifyWithCirculars<ObjType, Marker>;
    }
}
