import { equalsFunction } from "../functions/functions.js";
import { Optional } from "../resultsAndOptionals/optionals.js";
import { Result } from "../resultsAndOptionals/results.js";

type Pattern<T, R> = [(value: T) => boolean, R];

export class NoMatchError extends Error {
    constructor(message: string) {
        super(message);
    }
}

/**
 * A class that can be used to match a value against a pattern. Used as an alternative to a `switch` statement.
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
 *     // ...
 * ```
 *
 * Compare this with a `switch` statement:
 *
 * ```ts
 * let result: string;
 * switch (5) {
 *     case 5:
 *         result = "five";
 *         break;
 *     case 6:
 *         result = "six";
 *         break;
 *  // ...
 * }
 * ```
 *
 * As you can see, the switch statement requires a lot more text.
 * Looking at the two different approaches, it is clear that the {@link Match} object is more concise than a `switch` statement.
 *
 * Keep in mind that the order in which you add patterns matters. The first pattern that matches the value will be used.
 * There are several utility methods you can use to add patterns, such as {@link Match#addEquals} and {@link Match#addItemInList}.
 * More information about these methods can be found in their documentation.
 *
 * ## Extracting the result
 *
 * There are several ways to extract the result from the {@link Match} object, the most common being the {@link Match#getOrElse} method.
 *
 * ### {@link Match#getOrElse}
 *
 * The {@link Match#getOrElse} method is used to specify a default value to return if no pattern matches.
 * When called, it returns the result of the first pattern that matches the value.
 * If no pattern matches, it returns the default value.
 *
 * ## Performance
 *
 * The {@link Match} object is obviously not as performant as a `switch` statement. However, in most cases, the performance difference is negligible.
 * (If you are worried about performance to this extent, you should probably not be using JavaScript in the first place.)
 *
 * @template T The type of the value to match against.
 * @template R The type of the result.
 */
export class Match<T, R> {
    #patterns: Pattern<T, R>[] = [];
    /**
     * Creates a new {@link Match} object.
     *
     * @param value    The value to match against.
     * @param patterns The patterns to match against. This is an array of tuples, where the first element is a function that returns a boolean based on whether the pattern matches or not, and the second element is the result to return if the pattern matches. **Best to leave this empty and use the various `with` methods instead**.
     */
    constructor(private readonly value: T, ...patterns: Pattern<T, R>[]) {
        this.#patterns = patterns;
    }
    /**
     * Adds a pattern to the {@link Match} object based on a function.
     *
     * @param pattern The pattern to match against. This should return a boolean based on whether the pattern matches or not.
     * @param result  The result to return if the pattern matches.
     * @returns The object itself for method chaining.
     */
    addFunc(pattern: (value: T) => boolean, result: R): this {
        this.#patterns.push([pattern, result]);
        return this;
    }
    /**
     * Adds a pattern to the {@link Match} object based on a value.
     * This is a shortcut for {@link Match#addFunc} with `(value) => value === X` (where `X` is the value to match against).
     *
     * @param value  The value to match against.
     * @param result The result to return if the pattern matches.
     * @returns The object itself for method chaining.
     */
    addEquals(value: T, result: R): this {
        return this.addFunc(equalsFunction<T>(value), result);
    }
    /**
     * Adds a pattern to the {@link Match} object based on a value array. It will match if `array.includes(value)`.
     * This is a shortcut for {@link Match#addFunc} with `(value) => values.includes(value)`.
     *
     * @param values The value array to match against.
     * @param result The result to return if the pattern matches.
     * @returns The object itself for method chaining.
     */
    addItemInList(values: T[], result: R): this {
        return this.addFunc((v) => values.includes(v), result);
    }
    /**
     * Extracts the first matching result from the {@link Match} object. If no pattern matches, it returns the default value.
     *
     * @param result The result to return if no pattern matches.
     * @returns The first matching result, or the default value if no pattern matches.
     */
    getOrElse(result: R): R {
        return this.matches()?.[1] ?? result;
    }
    /**
     * Iterates over all patterns and finds a matching result.
     *
     * @example
     * ```ts
     * const result = match(5)
     *     .withEquals(5, "five")
     *     .withEquals(6, "six")
     *     .matches();
     *     // [(x) => x === 5, "five"]
     * ```
     *
     * @returns The first matching result as a two-sized array where the first element is the function for the matcher, and the second is the result, or `undefined` if no pattern matches.
     */
    matches(): Pattern<T, R> | undefined {
        return this.#patterns.find(([pattern]) => pattern(this.value));
    }
    /**
     * Gets the first matching result from the {@link Match} object as a {@link result!Result} object. If no pattern matches, it returns a result containing a {@link NoMatchError}.
     * @returns The first matching result, or throws a {@link NoMatchError} if no pattern matches.
     */
    getAsResult(): Result<R, NoMatchError> {
        if (this.matches()) {
            return Result.ok(this.getOrElse(undefined as R));
        }
        return Result.error(new NoMatchError("No pattern matched the value"));
    }
    getAsOptional(): Optional<R> {
        return Optional.of(this.getOrElse(undefined as R));
    }
}
