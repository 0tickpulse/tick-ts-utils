import { StringBuilder } from "../index.js";

/**
 * Creates an array of numbers (positive and/or negative) progressing from `start` up to, but not including, `end`.
 * If only one argument is provided, it will return an array of numbers from `0` to that number.
 * If `step` is provided, it will be used as the increment or decrement value.
 *
 * @param start The start of the range.
 * @param end   The end of the range.
 * @param step  The value to increment or decrement by.
 * @category Iterators
 */
export function range(end: number): number[];
export function range(start: number, end: number): number[];
export function range(start: number, end: number, step: number): number[];
export function range(start: number, end?: number, step?: number) {
    let _start = end === undefined ? 0 : start;
    const _end = end === undefined ? start : end;
    let _step = step === undefined ? 1 : step;
    if (_start > _end && _step > 0) {
        _step = -_step;
    }
    const length = Math.max(Math.ceil((_end - _start) / _step), 0);
    const result = new Array(length);
    for (let i = 0; i < length; i++, _start += _step) {
        result[i] = _start;
    }
    return result;
}

/**
 * Maps over an object, just like `Array.prototype.map`.
 *
 * @param object    The object to map over.
 * @param predicate The predicate to map with.
 * @returns The mapped object.
 * @category Iterators
 */
export function mapObject<T extends Record<PropertyKey, unknown>, U>(
    object: T,
    predicate: <K extends keyof T>(key: K, value: T[K], index: number) => U,
) {
    const result: Record<PropertyKey, U> = {};
    for (let i = 0; i < Object.keys(object).length; i++) {
        const key = Object.keys(object)[i];
        result[key] = predicate(key, object[key as keyof T], i);
    }
    return result;
}

export function fromIterator<T>(iterator: Iterator<T>): T[] {
    const result: T[] = [];
    let next = iterator.next();
    while (!next.done) {
        result.push(next.value);
        next = iterator.next();
    }
    return result;
}

/**
 * Formats an array into a string using this format: `value1, value2, ..., and value3`.
 * Values are converted to strings using `String()`.
 * Follows the Oxford comma.
 *
 * @example
 * ```ts
 * formatArray([1, 2, 3]); // "1, 2, and 3"
 * formatArray([1, 2]); // "1 and 2"
 * formatArray([1]); // "1"
 * formatArray([]); // ""
 * ```
 * @param array The array to format.
 * @category Iterators
 */
export function formatArray<T>(array: T[]): string {
    let str = "";
    for (let i = 0; i < array.length; i++) {
        str += String(array[i]);
        if (i === array.length - 2) {
            str += ", and ";
        } else if (i !== array.length - 1) {
            str += ", ";
        }
    }
    return str;
}

/**
 * Splits an array into chunks of a specified size.
 * The last chunk may be smaller than the specified size.
 * If the specified size is less than or equal to `0`, it will return an empty array.
 *
 * @param array The array to split.
 * @param size  The size of each chunk.
 * @category Iterators
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

/**
 * Converts a value into an array if it isn't already.
 *
 * @param value The value to convert.
 * @category Iterators
 */
export function asArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}
