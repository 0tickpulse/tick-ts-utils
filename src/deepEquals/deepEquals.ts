import { hasFunctionWithArity } from "../internal.js";

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
 * 1. If the values are equal checking by (`Object.is`), `true` will be returned.
 * 1. If either value is `null`, `undefined`, or not an object, `false` will be returned.
 * 1. If the values have different numbers of keys, `false` will be returned.
 * 1. If the values have the same keys, the *descriptors* of those keys will be compared recursively.
 *
 * If you want to add your own custom deep equality logic, you can increase type safety by implementing the `DeepEquals` interface.
 * This interface has a single method, `equals`, which returns whether the value is equal to another value.
 * For example:
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
 * This can allow developers to include more efficient and accurate deep equality checks for their own classes.
 *
 * @param value1 The first value to compare.
 * @param value2 The second value to compare.
 * @returns `true` if the values are deeply equal, `false` otherwise.
 * @category Equality
 */
export function deepEquals(value1: unknown, value2: unknown): boolean {
    if (hasEqualFunction(value1)) {
        return value1.equals(value2);
    }
    if (hasEqualFunction(value2)) {
        return value2.equals(value1);
    }

    if (Object.is(value1, value2)) {
        return true;
    }

    if (value1 === null || value2 === null || value1 === undefined || value2 === undefined) {
        return false;
    }

    if (typeof value1 !== "object" || typeof value2 !== "object") {
        return false;
    }

    const keys1 = Reflect.ownKeys(value1);
    const keys2 = Reflect.ownKeys(value2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    return keys1.every((key) => {
        if (!keys2.includes(key)) {
            return false;
        }

        // special case for functions
        if (
            typeof (value1 as Record<PropertyKey, unknown>)[key] === "function" &&
            typeof (value2 as Record<PropertyKey, unknown>)[key] === "function" &&
            (value1 as Record<PropertyKey, unknown>)[key]?.toString() !== (value2 as Record<PropertyKey, unknown>)[key]?.toString()
        ) {
            return false;
        }

        const descriptor1 = Reflect.getOwnPropertyDescriptor(value1, key);
        const descriptor2 = Reflect.getOwnPropertyDescriptor(value2, key);

        if (descriptor1 === undefined || descriptor2 === undefined) {
            return (value1 as Record<PropertyKey, unknown>)[key] === (value2 as Record<PropertyKey, unknown>)[key];
        }

        return (
            deepEquals(descriptor1.configurable, descriptor2.configurable) &&
            deepEquals(descriptor1.enumerable, descriptor2.enumerable) &&
            deepEquals(descriptor1.writable, descriptor2.writable) &&
            deepEquals(descriptor1.value, descriptor2.value) &&
            deepEquals(descriptor1.get, descriptor2.get)
        );
    });
}

function hasEqualFunction<T>(value: T): value is T & { equals: (other: unknown) => boolean } {
    return hasFunctionWithArity(value, "equals", 1);
}

/**
 * This interface represents a type that can be compared for deep equality.
 * This is used to allow objects to define their own equality logic.
 *
 * @category Equality
 */
export type DeepEquals = {
    equals(other: unknown): boolean;
}
