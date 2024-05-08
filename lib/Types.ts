export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

type _Array<N extends number, T, R extends unknown[]> = R['length'] extends N
  ? R
  : _Array<N, T, [T, ...R]>;

export type FixedLengthArray<N extends number, T> = N extends N
  ? number extends N
    ? T[]
    : _Array<N, T, []>
  : never;
