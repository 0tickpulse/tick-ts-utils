/**
 * A function that simply... does nothing. Useful for some certain situations that require a function.
 */
export const empty = () => {
    // This is an empty function.
};

/**
 * This function returns a function that compares the given value against the expected value.
 * For example, `equalsFunction(5)(5)` will return `true` and `equalsFunction(5)(6)` will return `false`.
 * @param expected The expected value to compare against.
 */
export const equalsFunction = <T>(expected: T) => {
    return (actual: T) => {
        return actual === expected;
    };
};
