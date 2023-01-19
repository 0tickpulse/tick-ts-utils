/**
 * Converts an array to a union type.
 * @example
 * type Test = ArrayToUnion<[1, 2, 3, 4, 5]>;
 * // 1 | 2 | 3 | 4 | 5
 */
export type ArrayToUnion<T extends readonly unknown[]> = T[number];
/**
 * Picks a specific type from a union based on an index.
 * @example
 * type Test = UnionPick<[1, 2, 3, 4, 5], 2>;
 * // 3
 */
export type UnionPick<T, K extends number> = T extends unknown[] ? T[K] : never;
/**
 * Gets the type of an array's elements.
 * @example
 * type Test = ArrayType<number[]>;
 * // 1
 */
export type ArrayType<T> = T extends (infer U)[] ? U : never;