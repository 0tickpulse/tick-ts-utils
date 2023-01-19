import { equalsFunction } from "../functions/functions.js";

/**
 * A class that can be used to match a value against a pattern. Used as an alternative to a `switch` statement.
 * Main document can be found here: {@link match}.
 *
 * @class Match
 * @template T The type of the value to match against.
 * @template R The type of the result.
 */
class Match<T, R> {
    constructor(private readonly value: T) {}
    #withs: [(value: T) => boolean, R][] = [];
    withFunc(pattern: (value: T) => boolean, result: R) {
        this.#withs.push([pattern, result]);
        return this;
    }
    withEquals(value: T, result: R) {
        return this.withFunc(equalsFunction<T>(value), result);
    }
    withInList(values: T[], result: R) {
        return this.withFunc((v) => values.includes(v), result);
    }
    otherwise(result: R) {
        return this.matches()?.[1] ?? result;
    }
    matches() {
        return this.#withs.find(([pattern]) => pattern(this.value));
    }
    get() {
        if (this.matches()) {
            return this.otherwise(undefined as R);
        }
        throw new Error("No match found.");
    }
}

/**
 * TL;DR: Creates a new {@link Match} object that can be used to match a value against a pattern. Used as an alternative to a `switch` statement.
 *
 * These are the same as the generic parameters of the {@link Match} class and will be passed on.
 *
 * # The Matcher
 *
 * The {@link Match} object is used to match a value against a pattern. It is used as an alternative to a `switch` statement.
 * Unlike a `switch` statement, the {@link Match} object is more flexible and allows for more complex patterns.
 * This is due to the fact that instead of using constants as a pattern (like in a `switch` statement), you can use functions.
 *
 * ## Adding patterns
 *
 * You can make use of the various `with` methods to add patterns to the {@link Match} object.
 * These methods follow the method chaining pattern, so you can chain them together:
 *
 * ```ts
 * const result = match(5)
 *     .withEquals(5, "five")
 *     .withEquals(6, "six")
 *     .otherwise("other");
 * ```
 *
 * Keep in mind that the order in which you add patterns matters. The first pattern that matches the value will be used.
 * Furthermore, there are several utility methods you can use to add patterns, such as {@link Match#withEquals} and {@link Match#withInList}.
 * More information about these methods can be found in their documentation.
 *
 * ## Extracting the result
 *
 * There are several ways to extract the result from the {@link Match} object, the most common being the {@link Match#otherwise} method.
 *
 * ### {@link Match#otherwise}
 *
 * The {@link Match#otherwise} method is used to specify a default value to return if no pattern matches.
 * When called, it returns the result of the first pattern that matches the value.
 * If no pattern matches, it returns the default value.
 *
 * ## Performance
 *
 * The {@link Match} object is obviously not as performant as a `switch` statement. However, in most cases, the performance difference is negligible.
 *
 * @param value The value to match against.
 * @template T The type of the value to match against.
 * @template R The type of the result.
 */
export const match = <T, R>(value: T) => new Match<T, R>(value);
