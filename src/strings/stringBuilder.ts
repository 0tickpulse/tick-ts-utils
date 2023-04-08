import { Cloneable } from "../index.js";

/**
 * A mutable string builder.
 *
 * Since strings are implemented as immutable objects in JavaScript, the string builder is a useful alternative to regular strings.
 * This string builder is implemented as a wrapper around a mutable array of singular characters.
 * Having singular characters allows for insertion and deletion of characters at any given index.
 * As such, the primary operations of this string builder are `append` and `insert`, which append and insert a string representation of an object to the end or at a given index, respectively.
 * Generally, a string builder is used as follows:
 *
 * 1. Initialize a new string builder.
 * 1. Append or insert objects to the string builder.
 * 1. Use {@link StringBuilder#toString} to get the string representation of the string builder.
 * 1. Clear the string builder if you want to reuse it.
 *
 * ## Performance
 *
 * Due to the fact that JavaScript does not have a `char` type, the string builder uses a string of length 1 as a character.
 * Having an array of strings instead of an array of characters has a significant performance impact.
 * In addition, strings have to be split into an array of characters before they can be appended to the string builder. This is highly performance-intensive.
 * All this, combined with other factors, makes the string builder significantly slower than a regular string.
 * To prove this, I ran a benchmark to compare the performance of this string builder to a regular string.
 *
 * ```ts
 * const n = 100000;
 *
 * const sb = new StringBuilder();
 * const start = Date.now();
 * for (let i = 0; i < n; i++) {
 *     sb.append("Hello, world!");
 * }
 * const sbTime = Date.now() - start;
 *
 * const start2 = Date.now();
 * let s = "";
 * for (let i = 0; i < n; i++) {
 *     s += "Hello, world!";
 * }
 * const sTime = Date.now() - start2;
 *
 * console.log(`StringBuilder took ${sbTime}ms`);
 * console.log(`String took ${sTime}ms`);
 * ```
 *
 * The benchmark was run on a Mac Studio with a M1 Ultra chip.
 * The results were:
 *
 * | Implementation | Time (ms) |
 * | -------------- | --------- |
 * | StringBuilder  | 22        |
 * | String         | 1         |
 *
 * Clearly, the string builder has a significant performance impact.
 * Hence, in performance-intensive code, it is recommended to use a regular string.
 *
 * @example
 * ```ts
 * const sb = new StringBuilder();
 * sb.append("Hello, ").append("world!").appendLine();
 * sb.append("The answer is ").append(42).append(".");
 * console.log(sb.toString());
 * ```
 *
 * @category Strings
 */
export class StringBuilder implements Cloneable<StringBuilder> {
    #chars: string[] = [];
    /**
     * Initializes a new string builder with the given objects.
     * The objects will be stringified and appended to the string builder.
     *
     * @param parts The objects to append.
     */
    constructor(...parts: unknown[]) {
        this.append(...parts);
    }
    /**
     * Appends an object to the end of the string builder, stringifying it first.
     *
     * @param parts The objects to append.
     */
    append(...parts: unknown[]): this {
        for (const part of parts) {
            const s = String(part);
            this.#chars.push(...s.split(""));
        }
        return this;
    }
    /**
     * Appends an object to the end of the string builder, stringifying it first, and then appends a newline.
     * Equivalent to `append(...parts, "\n")`.
     *
     * @param parts The objects to append.
     */
    appendLine(...parts: unknown[]): this {
        return this.append(...parts, "\n");
    }
    /**
     * Inserts an object into the string builder at the specified index, stringifying it first.
     */
    insert(index: number, ...parts: unknown[]): this {
        for (const part of parts) {
            const s = String(part);
            this.#chars.splice(index, 0, s);
        }
        return this;
    }
    toString(): string {
        return this.#chars.join("");
    }
    /**
     * Removes all characters from the string builder.
     */
    clear(): this {
        this.#chars = [];
        return this;
    }
    /**
     * Returns whether the string builder is empty.
     */
    isEmpty(): boolean {
        return this.length === 0;
    }
    deepClone(): StringBuilder {
        return new StringBuilder(this.toString());
    }
    /**
     * The number of characters in the string builder.
     */
    get length(): number {
        return this.#chars.length;
    }
}
