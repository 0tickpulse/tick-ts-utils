/**
 * Gets the values of an object as a union type. This can be useful as an alternative to an enum:
 *
 * ```ts
 * const MY_VALUES {
 *     A = "a",
 *     B = "b",
 *     C = "c",
 * }
 *
 * type MyValues = ObjectValues<typeof MY_VALUES>;
 * // "a" | "b" | "c"
 *
 * export function doSomething(value: MyValues) {
 *     // ...
 * }
 *
 * doSomething("a"); // OK
 * doSomething(MY_VALUES.A); // OK
 * ```
 */
export type ObjectValues<T> = T[keyof T];
