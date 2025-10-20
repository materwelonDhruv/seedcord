/**
 * Represents any function type
 */
export type AnyFunction = (...args: any[]) => unknown;

/** Represents any constructor function that can be instantiated with new */
export type ConstructorFunction = new (...args: any[]) => unknown;

/**
 * Represents any asynchronous function type
 */
export type AnyAsyncFunction = (...args: any[]) => Promise<unknown>;

/**
 * A type that can be either a value of TypeModel or a Promise that resolves to TypeModel
 * @typeParam TypeModel - The type to make awaitable
 */
export type Awaitable<TypeModel> = TypeModel | Promise<TypeModel>;
