import { isTypedArray } from "util/types";

/**
 * # Deep Cloning
 *
 * **Note: If you are on node `17.0.0` or above, you can use the native `structuredClone` method instead.**
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
 * 1. If the value is an array, a typed array, or an arraybuffer, a new array will be created with the same elements, but each element will be recursively deep cloned.
 * 1. If the value is an object, a new object will be created with the same keys and values, but each value will be recursively deep cloned.
 * 1. If the value is a boxed primitive, a new boxed primitive will be created with the same value.
 * 1. If the value is a `DataView`, a new DataView will be created with the same buffer, byte offset, and byte length.
 * 1. If the value is a `Date`, a new Date will be created with the same value.
 * 1. If the value is a `RegExp`, a new RegExp will be created with the same value.
 * 1. If the value is a `Map`, a new Map will be created with the same keys and values, but each key and value will be recursively deep cloned.
 * 1. If the value is a `Set`, a new Set will be created with the same values, but each value will be recursively deep cloned.
 * 1. Otherwise, the value will be returned as-is.
 *
 * If you want to add your own custom deep cloning logic, you can increase type safety by implementing the `Cloneable` interface.
 * This interface has a single method, `deepClone`, which returns a deep clone of the value.
 * For example:
 *
 * ```ts
 * class Foo implements Cloneable {
 *     constructor(public bar: number) {}
 *     deepClone() {
 *         return new Foo(this.bar);
 *     }
 * }
 * ```
 *
 * @param value The value to deep clone.
 * @returns The deep clone of the value.
 * @category Cloning
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
    if (value instanceof ArrayBuffer) {
        return value.slice(0) as T;
    }
    if (value instanceof Boolean) {
        return new Boolean(value.valueOf()) as T;
    }
    if (value instanceof DataView) {
        return new DataView(value.buffer.slice(0), value.byteOffset, value.byteLength) as T;
    }
    if (value instanceof Date) {
        return new Date(value.getTime()) as T;
    }
    if (value instanceof Map) {
        const result = new Map();
        for (const [k, v] of value) {
            result.set(deepClone(k), deepClone(v));
        }
        return result as T;
    }
    if (value instanceof Number) {
        return new Number(value.valueOf()) as T;
    }
    if (value instanceof RegExp) {
        return new RegExp(value.source, value.flags) as T;
    }
    if (value instanceof Set) {
        const result = new Set();
        for (const v of value) {
            result.add(deepClone(v));
        }
        return result as T;
    }
    if (value instanceof String) {
        return new String(value.valueOf()) as T;
    }
    if (isTypedArray(value)) {
        return value.slice(0) as T;
    }
    return value;
}

function hasDeepCloneMethod<T>(value: T): value is T & { deepClone(): T } {
    return (
        value !== null &&
        value !== undefined &&
        typeof value === "object" &&
        "deepClone" in value &&
        typeof (value as { deepClone: () => T }).deepClone === "function" &&
        (value as { deepClone: () => T }).deepClone.length === 0
    );
}

/**
 * This interface represents a type that can be deep cloned.
 * This is used to allow objects to define their own cloning logic.
 *
 * @see {@link deepClone} This function uses this interface to allow objects to define their own cloning logic.
 * @category Cloning
 */
export interface Cloneable<T> {
    /**
     * Deep clones the value.
     */
    deepClone(): T;
}
