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
export function mapObject<T extends Record<PropertyKey, unknown>, U>(object: T, predicate: <K extends keyof T>(key: K, value: T[K], index: number) => U) {
    const result: Record<PropertyKey, U> = {};
    for (let i = 0; i < Object.keys(object).length; i++) {
        const key = Object.keys(object)[i];
        result[key] = predicate(key, object[key as keyof T], i);
    }
    return result;
}
