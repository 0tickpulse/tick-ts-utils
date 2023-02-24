/**
 * This function compares two values for deep equality.
 *
 * In JavaScript, the strict equality operator (`===`) only works for primitive values (numbers, strings, booleans, etc.).
 * This is because objects are compared by the pointer to the object in memory, not by the value of the object.
 * In other words, even if you have two objects that have the same properties and values, they are not equal if they are not the same object.
 * This can be problematic especially when you want to compare two objects for equality:
 *
 * ```ts
 * const a = { b: 5 };
 * const c = { b: 5 };
 * console.log(a === c); // false
 * ```
 *
 * In this example, `a` and `c` do not point to the same object in memory, and hence, the equality operator returns false even though they have the same properties and values.
 *
 * Deep equality attempts to solve this problem by comparing the values of objects recursively.
 *
 * This function has a few cases:
 *
 * 1. If the **first value** has an `equals` method that has an arity of 1 (in other words, it has one argument), that method will be called and its result will be returned.
 * 1. If the **second value** has an `equals` method that has an arity of 1 (in other words, it has one argument), that method will be called and its result will be returned.
 * 1. If the values are strictly equal (`===`), `true` will be returned.
 * 1. If either value is `undefined`, `false` will be returned.
 * 1. If either value is `null`, `true` will be returned.
 * 1. If the types of the values are not equal (using `typeof`), `false` will be returned.
 * 1. If the values are both arrays, all of the elements will be compared recursively.
 * 1. If the values are both objects, the keys of the objects will be compared.
 * 1. Finally, returns `false`.
 *
 * If you want to implement your own `equals` method, you can increase type safety by using the {@link DeepEquals} type. For example:
 *
 * ```ts
 * class MyClass implements DeepEquals {
 *     constructor(public value: number) {}
 *     equals(other: unknown): boolean {
 *          if (!(other instanceof MyClass)) {
 *              return false;
 *          }
 *          return this.value === other.value;
 *     }
 * }
 * ```
 *
 * @param value1 The first value to compare.
 * @param value2 The second value to compare.
 * @returns `true` if the values are deeply equal, `false` otherwise.
 */
export function deepEquals(value1: unknown, value2: unknown): boolean {
    if (hasEqualFunction(value1)) {
        return value1.equals(value2);
    }
    if (hasEqualFunction(value2)) {
        return value2.equals(value1);
    }
    if (value1 === value2) {
        return true;
    }
    if (value1 === undefined || value2 === undefined) {
        return false;
    }
    if (value1 === null || value2 === null) {
        return false;
    }
    if (typeof value1 !== typeof value2) {
        return false;
    }
    if (Array.isArray(value1) && Array.isArray(value2)) {
        if (value1.length !== value2.length) {
            return false;
        }
        for (let i = 0; i < value1.length; i++) {
            if (!deepEquals(value1[i], value2[i])) {
                return false;
            }
        }
        return true;
    }
    if (typeof value1 === "object") {
        const aKeys = Object.keys(value1);
        const bKeys = Object.keys(value2);
        if (aKeys.length !== bKeys.length) {
            return false;
        }
        for (const key of aKeys) {
            if (!deepEquals((value1 as Record<string, unknown>)[key], (value2 as Record<string, unknown>)[key])) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function hasEqualFunction<T>(value: T): value is T & { equals: (other: unknown) => boolean } {
    return (
        value !== null &&
        value !== undefined &&
        typeof value === "object" &&
        "equals" in value &&
        typeof (value as unknown as { equals: unknown }).equals === "function" &&
        (value as unknown as { equals: (other: unknown) => boolean }).equals.length === 1
    );
}

/**
 * This interface represents a type that can be compared for deep equality.
 * This is used to allow objects to define their own equality logic.
 */
export interface DeepEquals {
    equals(other: unknown): boolean;
}
