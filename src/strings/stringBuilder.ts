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
 * Due to the fact that JavaScript does not have a `char` type, the string builder uses a string of length 1 as a character. This can lead to some performance issues.
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
