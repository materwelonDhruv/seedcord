/**
 * Makes a type nullable by adding null and undefined
 * @typeParam Value - The type to make nullable
 */
export type Nullable<Value = null> = Value extends null ? null | undefined : Value | null | undefined;
