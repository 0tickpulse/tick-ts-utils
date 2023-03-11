import { isTypedArray } from "util/types";
import { hasFunctionWithArity } from "../internal.js";

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
 * 1. If the value is a primitive, the value will be returned.
 * 1. If the value is a `Date`, a new `Date` object will be created with the same value and returned.
 * 1. If the value is a `RegExp`, a new `RegExp` object will be created with the same value and returned.
 * 1. Creates a new object with the same prototype as the original object, and copies all the properties over, recursively cloning values.
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
    return internalDeepClone(value);
}

function internalDeepClone<T>(value: T, map = new WeakMap()): T {
    if (hasDeepCloneMethod(value)) {
        return value.deepClone();
    }
    if (!isObjectOrFunction(value)) {
        return value;
    }

    if (typeof value === "function") {
        return value;
    }

    if (value instanceof Date) {
        return new Date(value) as T;
    }
    if (value instanceof RegExp) {
        return new RegExp(value) as T;
    }

    const toClone = value as unknown as Record<PropertyKey, unknown>;
    //      ^?

    if (map.has(toClone)) {
        return map.get(toClone);
    }

    const descriptors = Object.getOwnPropertyDescriptors(toClone);
    const cloned = Object.create(Object.getPrototypeOf(toClone), descriptors);
    map.set(toClone, cloned);
    Reflect.ownKeys(toClone).forEach((key) => {
        const val = toClone[key] as unknown;
        cloned[key] = val instanceof Object ? internalDeepClone(val, map) : val;
    });

    return cloned;
}

function isObjectOrFunction(value: unknown): value is object | Function {
    return typeof value === "object" || typeof value === "function";
}

function hasDeepCloneMethod<T>(value: T): value is T & { deepClone(): T } {
    return hasFunctionWithArity(value, "deepClone", 0);
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

