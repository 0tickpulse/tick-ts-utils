/**
 * An error that is thrown when trying to get the value of an empty Optional.
 *
 * @category Typeguarding
 */
export class NoValueInOptionalError extends Error {
    constructor(message: string) {
        super(message);
    }
}

/**
 * A container that may or may not contain a non-null-or-undefined value.
 *
 * @category Typeguarding
 */
export class Optional<T> {
    readonly #value: T | undefined;
    /**
     * Creates a new Optional with a value.
     *
     * @param value The value to wrap in an Optional. If the value is null or undefined, the Optional will be empty.
     */
    constructor(value: T | undefined) {
        this.#value = value;
    }
    /**
     * Returns whether the Optional contains a value. Opposite of {@link Optional#isEmpty}.
     */
    isPresent(): boolean {
        return this.#value !== undefined;
    }
    /**
     * Returns whether the Optional is empty. Opposite of {@link Optional#isPresent}.
     */
    isEmpty(): boolean {
        return this.#value === undefined;
    }
    /**
     * Calls a function if the Optional is not empty.
     *
     * @param func The function to call if the Optional is not empty. The value will be passed as the first argument.
     * @returns The object itself for method chaining.
     */
    ifPresent(func: (value: T) => void): this {
        if (this.#value !== undefined) {
            func(this.#value);
        }
        return this;
    }
    /**
     * Calls a function if the Optional is empty, or another function if the Optional is not empty.
     *
     * @param func     The function to call if the Optional is not empty. The value will be passed as the first argument.
     * @param elseFunc The function to call if the Optional is empty.
     * @returns The object itself for method chaining.
     */
    ifPresentOrElse(func: (value: T) => void, elseFunc: () => void): this {
        if (this.#value !== undefined) {
            func(this.#value);
        } else {
            elseFunc();
        }
        return this;
    }
    /**
     * Filters the Optional by a given function. If the function returns true, the Optional will be returned. If the function returns false, an empty Optional will be returned.
     * Will return an empty Optional if the Optional is empty.
     *
     * @param func The function to filter the Optional by. The value will be passed as the first argument.
     */
    filter(func: (value: T) => boolean): Optional<T> {
        if (this.#value !== undefined && func(this.#value)) {
            return this;
        }
        return Optional.empty();
    }
    /**
     * Returns the value of the Optional, or throws an error if the Optional is empty.
     */
    get(): T {
        if (this.#value === undefined) {
            throw new NoValueInOptionalError("Cannot get the value of an empty Optional.");
        }
        return this.#value;
    }
    /**
     * If the value is present, returns a new Optional with the value of the given function. If the value is not present, returns an empty Optional.
     *
     * @param func The function to map the value to. The value will be passed as the first argument.
     */
    map<U>(func: (value: T) => U): Optional<U> {
        if (this.#value === undefined) {
            return Optional.empty();
        }
        return Optional.of(func(this.#value));
    }
    /**
     * If the value is present, returns the value. If the value is not present, returns a fallback value.
     *
     * @param value The fallback value.
     */
    otherwise(value: T): T {
        if (this.#value === undefined) {
            return value;
        }
        return this.#value;
    }
    /**
     * If the value is present, returns the value. If the value is not present, returns the value of the given function.
     *
     * @param func The function to get the fallback value from.
     */
    otherwiseGet(func: () => T): T {
        if (this.#value === undefined) {
            return func();
        }
        return this.#value;
    }
    toString() {
        return this.isPresent() ? `Optional of ${this.#value}` : "Empty Optional";
    }
    /**
     * Returns an empty Optional.
     */
    static empty<T>(): Optional<T> {
        return new Optional<T>(undefined);
    }
    /**
     * Returns an optional of a given value, or an empty optional if the value is null or undefined.
     *
     * @param value The value to wrap in an Optional. If the value is null or undefined, the Optional will be empty.
     */
    static of<T>(value: T | undefined): Optional<T> {
        return new Optional<T>(value);
    }
}
