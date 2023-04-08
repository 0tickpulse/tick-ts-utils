/**
 * Reverses a string.
 * This function makes use of the traditional `for` loop instead of using `Array.prototype.reverse`.
 * According to my benchmarks, this is about 2x faster.
 *
 * @param str The string to reverse.
 */
export function reverse(str: string): string {
    let result = "";
    for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
    }
    return result;
}

/**
 * Truncates a string to a certain length.
 * If any characters are truncated, an ellipsis is added to the end.
 * This is extremely useful for displaying potentially long strings in a limited space.
 *
 * @param str      The string to truncate.
 * @param length   The maximum length of the string.
 * @param ellipsis The string to add to the end of the string if it is truncated.
 *                 Defaults to `"..."`.
 */
export function ellipsis(str: string, length: number, ellipsis = "..."): string {
    if (str.length <= length) {
        return str;
    }
    return str.slice(0, length - ellipsis.length) + ellipsis;
}

