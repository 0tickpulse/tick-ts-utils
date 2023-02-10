import assert from "assert";

/**
 * # Deep Cloning
 *
 * Deep cloning is a technique where an object is copied, but the copy is not a reference to the original object.
 * Take this example:
 *
 * ```ts
 * const a = { b: 5 };
 * const c = a;
 * c.b = 6;
 * console.log(a.b); // 6
 * ```
 *
 * In this example, `a` and `c` are references to the same object in memory. If we change `c`, `a` will also change.
 *
 * ```ts
 * const a = { b: 5 };
 * const c = deepClone(a);
 * c.b = 6;
 * console.log(a.b); // 5
 * ```
 *
 * In this example, `a` and `c` are not references to the same object in memory. If we change `c`, `a` will not change.
 *
 * This is useful for immutable data structures, where you want to create a new object based on an existing object, but you don't want to change the existing object.
 *
 * This method does just that - it deep clones a value. Note how it does the deep cloning though.
 * Internally, this function has a few cases:
 *
 * 1. If the value has a `deepClone` method that has an arity of 0 (in other words, it has zero arguments), that method will be called and its result will be returned.
 * 1. If the value is an array, a new array will be created with the same elements, but each element will be recursively deep cloned.
 * 1. If the value is an object, a new object will be created with the same keys and values, but each value will be recursively deep cloned.
 * 1. Otherwise, the value will be returned as-is.
 *
 * @param value The value to deep clone.
 * @returns The deep clone of the value.
 */
export function deepClone<T>(value: T): T {
    if (hasDeepCloneMethod(value)) {
        return value.deepClone();
    }
    if (Array.isArray(value)) {
        return [...value.map(deepClone)] as T;
    }
    if (typeof value === "object") {
        const result = {} as T;
        for (const key in value) {
            result[key] = deepClone(value[key]);
        }
        return result;
    }
    return value;
}

function hasDeepCloneMethod<T>(value: T): value is T & { deepClone(): T } {
    return (
        Object.prototype.hasOwnProperty.call(value, "deepClone") &&
        typeof (value as { deepClone: () => T }).deepClone === "function" &&
        (value as { deepClone: () => T }).deepClone.length === 0
    );
}

assert.deepStrictEqual(1, 1)