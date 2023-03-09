import { fromIterator } from "./iterators.js";

/**
 * Groups the elements of an iterable into a map based on a specified key selector function.
 * @param iterable    The iterable to group.
 * @param keySelector The function to select the key for each element.
 * @returns A map of the grouped elements.
 */
export function groupArrayBy<T, K>(iterable: Iterable<T>, keySelector: (item: T) => K): Map<K, T[]> {
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

export function groupArrayIntoArrayBy<T, K>(iterable: Iterable<T>, keySelector: (item: T) => K): T[][] {
    return fromIterator(groupArrayBy(iterable, keySelector).values());
}
