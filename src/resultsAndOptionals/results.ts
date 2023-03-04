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
    static ok<T, E>(value: T): Result<T, E> {
        return new Result<T, E>(value, undefined);
    }
    static error<T, E>(error: E): Result<T, E> {
        return new Result<T, E>(undefined, error);
    }
    isOk(): boolean {
        return this.value !== undefined;
    }
    isError(): boolean {
        return this.error !== undefined;
    }
    ifOk(func: (value: T) => void): this {
        if (this.value !== undefined) {
            func(this.value);
        }
        return this;
    }
    ifError(func: (error: E) => void): this {
        if (this.error !== undefined) {
            func(this.error);
        }
        return this;
    }
    ifOkOrElse(func: (value: T) => void, elseFunc: () => void): this {
        if (this.value !== undefined) {
            func(this.value);
        } else {
            elseFunc();
        }
        return this;
    }
    map<U>(func: (value: T) => U): Result<U, E> {
        if (this.isError()) {
            return Result.error(this.error!);
        }
        return Result.ok(func(this.value!));
    }
    mapError<F>(func: (error: E) => F): Result<T, F> {
        if (this.isOk()) {
            return Result.ok(this.value!);
        }
        return Result.error(func(this.error!));
    }
    mapBoth<U, F>(func: (value: T) => U, errorFunc: (error: E) => F): Result<U, F> {
        if (this.value === undefined) {
            return Result.error(errorFunc(this.error!));
        }
        return Result.ok(func(this.value));
    }
    get(): T {
        if (this.value === undefined) {
            throw new GetErrorResult("Cannot get the value of an erroring Result.");
        }
        return this.value;
    }
    getError(): E {
        if (this.error === undefined) {
            throw new GetErrorResult("Cannot get the error of a successful Result.");
        }
        return this.error;
    }
    getOrElse(value: T): T {
        if (this.value === undefined) {
            return value;
        }
        return this.value;
    }
    getErrorOrElse(error: E): E {
        if (this.error === undefined) {
            return error;
        }
        return this.error;
    }
    getOrElseGet(func: () => T): T {
        if (this.value === undefined) {
            return func();
        }
        return this.value;
    }
    getErrorOrElseGet(func: () => E): E {
        if (this.error === undefined) {
            return func();
        }
        return this.error;
    }
    getOrElseThrow(func: () => Error): T {
        if (this.value === undefined) {
            throw func();
        }
        return this.value;
    }
    getErrorOrElseThrow(func: () => Error): E {
        if (this.error === undefined) {
            throw func();
        }
        return this.error;
    }
    getAsOptional(): Optional<T> {
        return Optional.of(this.value);
    }
}
