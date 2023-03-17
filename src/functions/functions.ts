import { Optional } from "../resultsAndOptionals/optionals.js";
import { Curry } from "../types/functionTypes.js";
import { Match } from "../match/match.js";

/**
 * This function returns a function that compares the given value against the expected value.
 * For example, `equalsFunction(5)(5)` will return `true` and `equalsFunction(5)(6)` will return `false`.
 * This is the backend for {@link Match#addEquals}.
 *
 * @param expected The expected value to compare against.
 * @category Functions
 */
export function equalsFunction<T>(expected: T): (object: T) => boolean {
    return (actual: T) => {
        return actual === expected;
    };
}

/**
 * A function that simply... does nothing. Useful for some certain situations that require a consumer function but you don't want to do anything with the value.
 *
 * @category Functions
 */
export function emptyFunction(): void {
    // This is an empty function.
}

/**
 * A function that simply returns the value that was passed in. Useful for some certain situations that require a transformation function but you don't want to do anything with the value.
 *
 * @param value The value to return.
 * @category Functions
 */
export function identityFunction<T>(value: T): T {
    return value;
}

/**
 * Returns a function that returns the given value. Similar to {@link identityFunction}, but this function returns a function instead of the value itself.
 *
 * @param value The value to return.
 * @category Functions
 */
export function constantFunction<T>(value: T): () => T {
    return () => value;
}

/**
 * Returns a function that returns the `index`th argument that was passed in. Works with negative indices, where `-1` is the last argument, `-2` is the second-to-last argument, and so on.
 *
 * @example
 * ```ts
 * const first = argFunction(0);
 * const second = argFunction(1);
 * first(1, 2, 3).get(); // 1
 * second(1, 2, 3).get(); // 2
 * ```
 *
 * @param index The index of the argument to return.
 * @category Functions
 */
export function argFunction(index: number): <T>(...args: T[]) => Optional<T> {
    return <T>(...args: T[]) => {
        return Optional.of(args.at(index));
    };
}

export function curry<T extends (...args: any[]) => any>(fn: T): Curry<[...Parameters<T>, ReturnType<T>]> {
    const { length } = fn;
    return function curried(...args: any[]): any {
        if (args.length >= length) {
            return fn(...args);
        } else {
            return (...moreArgs: any[]) => curried(...args, ...moreArgs);
        }
    } as Curry<[...Parameters<T>, ReturnType<T>]>;
}
