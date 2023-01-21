/**
 * This function returns a function that compares the given value against the expected value.
 * For example, `equalsFunction(5)(5)` will return `true` and `equalsFunction(5)(6)` will return `false`.
 * This is the backend for {@link match!Match#withEquals}.
 * @param expected The expected value to compare against.
 */
export function equalsFunction<T>(expected: T) {
    return (actual: T) => {
        return actual === expected;
    };
}

/**
 * A function that simply... does nothing. Useful for some certain situations that require a function.
 */
export function emptyFunction() {
    // This is an empty function.
}

/**
 * A function that simply returns the value that was passed in. Useful for some certain situations that require a function but you don't want to do anything with the value.
 * @param value The value to return.
 */
export function identityFunction<T>(value: T) {
    return value;
}
