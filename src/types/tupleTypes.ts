/**
 * Converts a tuple to a union type.
 * @example
 * ```ts
 * type Test = TupleToUnion<[1, 2, 3, 4, 5]>;
 * // 1 | 2 | 3 | 4 | 5
 * ```
 */
export type TupleToUnion<T extends readonly unknown[]> = T[number];
/**
 * Picks a specific type from a tuple based on an index.
 * @example
 * ```ts
 * type Test = TuplePick<[1, 2, 3, 4, 5], 2>;
 * // 3
 * ```
 */
export type TuplePick<T, K extends number> = T extends unknown[] ? T[K] : never;
/**
 * Gets the type of an array's elements.
 * @example
 * ```ts
 * type Test = ArrayType<number[]>;
 * // number
 * ```
 */
export type ArrayType<T> = T extends (infer U)[] ? U : never;
