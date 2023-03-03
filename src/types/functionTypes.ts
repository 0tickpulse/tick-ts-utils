/**
 * A curry type that can be used to create a curried function.
 * Currying is the process of transforming a function that takes multiple arguments into a function that takes a single argument and returns another function that takes the next argument, and so on.
 * This is particularly prevalent in functional programming.
 *
 * @example
 * ```ts
 * // This is a normal function that takes two arguments.
 * const add: (number, number) => number = (a, b) => {
 *    return a + b;
 * }
 *
 * // This is the same function, but curried.
 * const add: Curry<[number, number, number]> = (a) => {
 *    return (b: number) => a + b;
 * }
 *
 * // This is how you would use the curried function.
 * const addOne = add(1);
 * addOne(2); // 3
 *
 * // This is how you would use the normal function.
 * add(1, 2); // 3
 * ```
 *
 * @category Types
 */
export type Curry<T extends readonly unknown[]> = T extends [infer A, ...infer B] ? B["length"] extends 0 ? A : (a: A) => Curry<B> : T[0];
