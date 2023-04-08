import { fromIterator } from "./iterators.js";

/**
 * Groups the elements of an iterable into a map based on a specified key selector function.
 *
 * @example
 * ```ts
 * const array = [
 *     { name: "John", age: 20 },
 *     { name: "Jane", age: 20 },
 *     { name: "John", age: 30 },
 *     { name: "Jane", age: 30 },
 * ];
 *
 * const grouped = groupBy(array, item => item.name);
 * // Map {
 * //     "John" => [{ name: "John", age: 20 }, { name: "John", age: 30 }],
 * //     "Jane" => [{ name: "Jane", age: 20 }, { name: "Jane", age: 30 }],
 * // }
 * ```
 *
 * @param iterable    The iterable to group.
 * @param keySelector The function to select the key for each element.
 * @returns A map of the grouped elements.
 */
export function groupBy<T, K>(iterable: Iterable<T>, keySelector: (item: T) => K): Map<K, T[]> {
    const map = new Map<K, T[]>();
    for (const item of iterable) {
        const key = keySelector(item);
        const group = map.get(key);
        if (group) {
            group.push(item);
        } else {
            map.set(key, [item]);
        }
    }
    return map;
}

/**
 * Groups the elements of an iterable into an array of arrays based on a specified key selector function.
 *
 * @example
 * ```ts
 * const array = [
 *     { name: "John", age: 20 },
 *     { name: "Jane", age: 20 },
 *     { name: "Jack", age: 30 },
 * ];
 *
 * const grouped = groupArrayIntoArrayBy(array, item => item.age);
 * // [
 * //     [{ name: "John", age: 20 }, { name: "Jane", age: 20 }],
 * //     [{ name: "Jack", age: 30 }],
 * // ]
 * ```
 *
 * @param iterable    The iterable to group.
 * @param keySelector The function to select the key for each element.
 * @returns An array of the grouped elements.
 */
export function groupArrayIntoArrayBy<T, K>(iterable: Iterable<T>, keySelector: (item: T) => K): T[][] {
    return fromIterator(groupBy(iterable, keySelector).values());
}
