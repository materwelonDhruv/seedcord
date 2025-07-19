import { Envuments } from '../Envuments';

export type EnvInput = string | undefined;
type EnvParser<T> = (raw: EnvInput, fallback?: T) => T;
type EnvType<T> = typeof Number | typeof Boolean | typeof String | EnvParser<T>;

const envCache: Record<string, unknown> = {};

/**
 * Decorator that pulls a key from the environment once,
 * converts it with the chosen converter, and caches the result.
 */
export function Env<T = string>(key: string, fallback?: T, converter: EnvType<T> = String) {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!Reflect)
    throw new Error("@Env annotation used without Reflect, have you called import 'reflect-metadata'; in your code?");

  return function (target: object, prop: string): void {
    let value = envCache[key] as T | undefined;

    if (value !== undefined) {
      Object.defineProperty(target, prop, { value });
      return;
    }

    if (converter === Number) {
      value = Envuments.getNumber(key, Number(fallback)) as unknown as T;
    } else if (converter === Boolean) {
      value = Envuments.getBoolean(key, Boolean(fallback)) as unknown as T;
    } else if (converter === String) {
      value = Envuments.get(key, String(fallback)) as unknown as T;
    } else {
      const raw = Envuments.get(key, undefined) as EnvInput;
      value = (converter as EnvParser<T>)(raw, fallback);
    }

    envCache[key] = value;

    Object.defineProperty(target, prop, { value });
  };
}
