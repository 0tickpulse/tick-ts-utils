import { Optional } from "./optionals.js";

/**
 * An error that occurs when getting a {@link Result} object that contains an error.
 *
 * @category Typeguarding
 */
export class GetErrorResult extends Error {}

/**
 * A Result is a type that can either be a success value or an error.
 *
 * @category Typeguarding
 */
export class Result<T, E> {
    constructor(public value: T | undefined, readonly error: E | undefined) {}
    /**
     * Runs a function and returns the function's return value as a Result.
     * If the function throws an error, the error will be returned instead.
     *
     * @example
     * ```ts
     * const result = Result.try(() => {
     *     throw new Error("Something went wrong");
     * }); // same as Result.error(new Error("Something went wrong"))
     *
     * const other = Result.try(() => 5); // same as Result.ok(5)
     * ```
     */
    static try<T, E>(func: () => T): Result<T, E> {
        try {
            return Result.ok(func());
        } catch (error) {
            return Result.error(error) as Result<T, E>;
        }
    }
    /**
     * Creates a new Result object that contains a success value.
     *
     * @param value The success value.
     */
    static ok<T, E>(value: T): Result<T, E> {
        return new Result<T, E>(value, undefined);
    }
    /**
     * Creates a new Result object that contains an error.
     *
     * @param error The error.
     */
    static error<T, E>(error: E): Result<T, E> {
        return new Result<T, E>(undefined, error);
    }
    /**
     * Returns whether the Result contains a success value. Opposite of {@link Result#isError}.
     */
    isOk(): boolean {
        return this.value !== undefined;
    }
    /**
     * Returns whether the Result contains an error. Opposite of {@link Result#isOk}.
     */
    isError(): boolean {
        return this.error !== undefined;
    }
    /**
     * Calls a function if the Result contains a success value.
     *
     * @param func The function to call if the Result contains a success value. The value will be passed as the first argument.
     * @returns The object itself for method chaining.
     */
    ifOk(func: (value: T) => void): this {
        if (this.value !== undefined) {
            func(this.value);
        }
        return this;
    }
    /**
     * Calls a function if the Result contains an error.
     *
     * @param func The function to call if the Result contains an error. The error will be passed as the first argument.
     * @returns The object itself for method chaining.
     */
    ifError(func: (error: E) => void): this {
        if (this.error !== undefined) {
            func(this.error);
        }
        return this;
    }
    /**
     * Calls a function if the Result contains a success value, or another function if the Result contains an error.
     *
     * @param func     The function to call if the Result contains a success value. The value will be passed as the first argument.
     * @param elseFunc The function to call if the Result contains an error. The error will be passed as the first argument.
     * @returns The object itself for method chaining.
     */
    ifOkOrElse(func: (value: T) => void, elseFunc: () => void): this {
        if (this.value !== undefined) {
            func(this.value);
        } else {
            elseFunc();
        }
        return this;
    }
    /**
     * Filters the Result by a function. If the Result contains a success value and the function returns true, the Result will be returned. If the Result contains a success value and the function returns false, an erroring Result will be returned. If the Result contains an error, the erroring Result will be returned.
     *
     * @param func The function to filter the Result with. The value will be passed as the first argument.
     */
    filter(func: (value: T) => boolean): Result<T, E> {
        if (this.isError()) {
            return Result.error(this.error!);
        }
        if (func(this.value!)) {
            return Result.ok(this.value!);
        }
        return Result.error(this.error!);
    }
    /**
     * If the Result contains a success value, returns a new Result with the value mapped by the function. If the Result contains an error, returns the erroring Result.
     *
     * @param func The function to map the value with. The value will be passed as the first argument.
     */
    map<U>(func: (value: T) => U): Result<U, E> {
        if (this.isError()) {
            return Result.error(this.error!);
        }
        return Result.ok(func(this.value!));
    }
    /**
     * If the Result contains an error, returns a new Result with the error mapped by the function. If the Result contains a success value, returns the success Result.
     *
     * @param func The function to map the error with. The error will be passed as the first argument.
     */
    mapError<F>(func: (error: E) => F): Result<T, F> {
        if (this.isOk()) {
            return Result.ok(this.value!);
        }
        return Result.error(func(this.error!));
    }
    /**
     * If the Result contains a success value, returns a new Result with the value mapped by the function. If the Result contains an error, returns a new Result with the error mapped by the function.
     *
     * @param func      The function to map the value with. The value will be passed as the first argument.
     * @param errorFunc The function to map the error with. The error will be passed as the first argument.
     */
    mapBoth<U, F>(func: (value: T) => U, errorFunc: (error: E) => F): Result<U, F> {
        if (this.value === undefined) {
            return Result.error(errorFunc(this.error!));
        }
        return Result.ok(func(this.value));
    }
    /**
     * Returns the value of the Result. If the Result contains an error, throws an error.
     */
    get(): T {
        if (this.value === undefined) {
            throw new GetErrorResult("Cannot get the value of an erroring Result.");
        }
        return this.value;
    }
    /**
     * Returns the error of the Result. If the Result contains a success value, throws an error.
     */
    getError(): E {
        if (this.error === undefined) {
            throw new GetErrorResult("Cannot get the error of a successful Result.");
        }
        return this.error;
    }
    /**
     * If the Result contains a success value, returns the value. If the Result contains an error, returns the provided value.
     *
     * @param value The value to return if the Result contains an error.
     */
    getOrElse<U>(value: U): T | U {
        if (this.value === undefined) {
            return value;
        }
        return this.value;
    }
    /**
     * If the Result contains an error, returns the error. If the Result contains a success value, returns the provided error.
     *
     * @param error The error to return if the Result contains a success value.
     */
    getErrorOrElse<U>(error: U): E | U {
        if (this.error === undefined) {
            return error;
        }
        return this.error;
    }
    /**
     * If the Result contains a success value, returns the value. If the Result contains an error, returns the value returned by the provided function.
     *
     * @param func The function to call if the Result contains an error. The error will be passed as the first argument.
     * @returns The value returned by the function.
     */
    getOrElseGet<U>(func: () => U): T | U {
        if (this.value === undefined) {
            return func();
        }
        return this.value;
    }
    /**
     * If the Result contains an error, returns the error. If the Result contains a success value, returns the error returned by the provided function.
     *
     * @param func The function to call if the Result contains a success value. The value will be passed as the first argument.
     * @returns The error returned by the function.
     */
    getErrorOrElseGet<U>(func: () => U): E | U {
        if (this.error === undefined) {
            return func();
        }
        return this.error;
    }
    /**
     * If the Result contains a success value, returns the value. If the Result contains an error, throws the error returned by the provided function.
     *
     * @param func The function to call if the Result contains an error. The error will be passed as the first argument.
     * @returns The value of the Result.
     */
    getOrElseThrow(func: () => Error): T {
        if (this.value === undefined) {
            throw func();
        }
        return this.value;
    }
    /**
     * If the Result contains an error, returns the error. If the Result contains a success value, throws the error returned by the provided function.
     *
     * @param func The function to call if the Result contains a success value. The value will be passed as the first argument.
     * @returns The error of the Result.
     */
    getErrorOrElseThrow(func: () => Error): E {
        if (this.error === undefined) {
            throw func();
        }
        return this.error;
    }
    /**
     * Converts the Result to an Optional. If the Result contains a success value, the Optional will contain the value. If the Result contains an error, the Optional will be empty.
     */
    getAsOptional(): Optional<T> {
        return Optional.of(this.value);
    }
}
