import { deepEquals } from "../deepEquals/deepEquals.js";
import { hasFunctionWithArity } from "../internal.js";

export type ComparisonResult = -1 | 0 | 1;

/**
 * An interface that represents a type that has custom comparison logic.
 * @category Comparisons
 */
export interface Comparable<T> {
    /**
     * Compares this object with the specified object for order.
     *
     * @param other The object to be compared.
     * @returns A negative integer, zero, or a positive integer as this object is less than, equal to, or greater than the specified object.
     * @category Comparisons
     */
    compareTo(other: T): ComparisonResult;
}

/**
 * Flattens a comparison result to -1, 0, or 1. (Positive numbers become 1, negative numbers become -1, and 0 stays 0.)
 * This is useful for implementing `compareTo` methods.
 *
 * @param comparison The comparison result to flatten.
 * @returns The flattened comparison result.
 * @category Comparisons
 */
export function flattenComparison(comparison: number): ComparisonResult {
    if (comparison < 0) {
        return -1;
    }
    if (comparison > 0) {
        return 1;
    }
    return 0;
}

/**
 * Flips a comparison result. (Positive numbers become -1, negative numbers become 1, and 0 stays 0.)
 * Using the regular `-` operator on a `ComparisonResult` will not work, because TypeScript will not allow it.
 *
 * @param comparison The comparison result to flip.
 */
export function flipComparison(comparison: ComparisonResult): ComparisonResult {
    if (comparison === 0) {
        return 0; // 0 and -0 are different
    }
    return -comparison as ComparisonResult; // typescript isn't smart enough to figure this out
}

export function isComparable<T>(value: T): value is T & Comparable<T> {
    return hasFunctionWithArity(value, "compareTo", 1);
}

export const THIS_IS_GREATER = 1;
export const THIS_IS_LESS = -1;
export const EQUAL = 0;

/**
 * Compares two values for order.
 * This has a few differences from the native comparison operators:
 *
 * - It uses the `compareTo` method if the value implements the `Comparable` interface.
 * - It uses the `deepEqual` method if the value implements the `DeepEqual` interface.
 *
 * @param value1 The first value to compare.
 * @param value2 The second value to compare.
 * @returns -1, 0, or 1 if the first argument is less than, equal to, or greater than the second.
 * @category Comparisons
 */
export function compare<T>(value1: T, value2: T): ComparisonResult {
    if (isComparable(value1)) {
        return value1.compareTo(value2);
    }
    if (isComparable(value2)) {
        return flipComparison(value2.compareTo(value1));
    }

    return deepEquals(value1, value2) ? EQUAL : value1 > value2 ? THIS_IS_GREATER : THIS_IS_LESS;
}

/**
 * Checks if `value1` is greater than `value2`.
 *
 * This has a few differences from the native comparison operators:
 *
 * - It uses the `compareTo` method if the value implements the `Comparable` interface.
 * - It uses the `deepEqual` method if the value implements the `DeepEqual` interface.
 *
 * @param value1 The first value to compare.
 * @param value2 The second value to compare.
 * @category Comparisons
 */
export function isGreaterThan<T>(value1: T, value2: T): boolean {
    return compare(value1, value2) === THIS_IS_GREATER;
}

/**
 * Checks if `value1` is greater than or equal to `value2`.
 *
 * This has a few differences from the native comparison operators:
 *
 * - It uses the `compareTo` method if the value implements the `Comparable` interface.
 * - It uses the `deepEqual` method if the value implements the `DeepEqual` interface.
 *
 * @param value1 The first value to compare.
 * @param value2 The second value to compare.
 * @category Comparisons
 */
export function isGreaterThanOrEqual<T>(value1: T, value2: T): boolean {
    return compare(value1, value2) !== THIS_IS_LESS;
}

/**
 * Checks if `value1` is less than `value2`.
 *
 * This has a few differences from the native comparison operators:
 *
 * - It uses the `compareTo` method if the value implements the `Comparable` interface.
 * - It uses the `deepEqual` method if the value implements the `DeepEqual` interface.
 *
 * @param value1 The first value to compare.
 * @param value2 The second value to compare.
 * @category Comparisons
 */
export function isLessThan<T>(value1: T, value2: T): boolean {
    return compare(value1, value2) === THIS_IS_LESS;
}

/**
 * Checks if `value1` is less than or equal to `value2`.
 *
 * This has a few differences from the native comparison operators:
 *
 * - It uses the `compareTo` method if the value implements the `Comparable` interface.
 * - It uses the `deepEqual` method if the value implements the `DeepEqual` interface.
 *
 * @param value1 The first value to compare.
 * @param value2 The second value to compare.
 * @category Comparisons
 */
export function isLessThanOrEqual<T>(value1: T, value2: T): boolean {
    return compare(value1, value2) !== THIS_IS_GREATER;
}

/**
 * Checks if `value` is between a range, `lowerBound` and `upperBound`.
 * In other words, checks if `lowerBound <= value <= upperBound`.
 * Always returns false if `lowerBound > upperBound`.
 *
 * @param value      The value to check.
 * @param lowerBound The lower bound of the range.
 * @param upperBound The upper bound of the range.
 * @param inclusive  Whether to include the bounds in the range.
 */
export function isBetween<T>(value: T, lowerBound: T, upperBound: T, inclusive = false): boolean {
    return inclusive
        ? isGreaterThanOrEqual(value, lowerBound) && isLessThanOrEqual(value, upperBound)
        : isGreaterThan(value, lowerBound) && isLessThan(value, upperBound);
}
