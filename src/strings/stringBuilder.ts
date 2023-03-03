import { Cloneable } from "../index.js";
import { stringify } from "./toString.js";

/**
 * A mutable string builder.
 *
 * String builders are useful for producing large strings.
 */
export class StringBuilder implements Cloneable<StringBuilder> {
    #chars: string[] = [];
    constructor(...parts: string[]) {
        this.append(...parts.map((s) => s.split("")));
    }
    append(...parts: unknown[]): this {
        for (const part of parts) {
            const s = stringify(part);
            this.#chars.push(...s.split(""));
        }
        return this;
    }
    insert(index: number, ...parts: unknown[]): this {
        for (const part of parts) {
            const s = stringify(part);
            this.#chars.splice(index, 0, s);
        }
        return this;
    }
    toString(): string {
        return this.#chars.join("");
    }
    clear(): this {
        this.#chars = [];
        return this;
    }
    isEmpty(): boolean {
        return this.length === 0;
    }
    deepClone(): StringBuilder {
        return new StringBuilder(this.toString());
    }
    get length(): number {
        return this.#chars.length;
    }
}
