/**
 * Null-safe string conversion.
 *
 * @param value The value to convert to a string.
 * @returns The string representation of the value.
 */
export function stringify(value: unknown): string {
    if (value === undefined) {
        return "undefined";
    }
    if (value === null) {
        return "null";
    }
    return value.toString();
}
