import { randomInt } from "crypto";
import { randomElement, randomFloat } from "./index.js";

export function hasFunctionWithArity<T, Params extends readonly unknown[], K extends string>(
    object: T,
    name: K,
    arity: number,
): object is T & { K: (...args: Params) => unknown } {
    return (
        object !== null &&
        object !== undefined &&
        typeof object === "object" &&
        name in object &&
        typeof (object as unknown as Record<string, (...args: Params[]) => unknown>)[name] === "function" &&
        (object as unknown as Record<string, (...args: Params[]) => unknown>)[name].length === arity
    );
}

export type NotUndefined<T> = T extends undefined ? never : T;

/**
 * Literally returns *any* value.
 * This can be a primitive, an object, a function, or anything else.
 *
 * Useful for testing.
 */
export function random() {
    return randomElement([
        undefined,
        null,
        true,
        false,
        randomString(),
        randomFloat(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
        randomObject(),
        randomPrototypedObject(),
        randomArray(),
        randomFunction(),
    ])
}
function randomObject(): Record<string, unknown> {
    const length = randomInt(0, 15);
    const object: Record<string, unknown> = {};
    for (let i = 0; i < length; i++) {
        object[randomString()] = random();
    }
    return object;
}
function randomPrototypedObject(): Record<string, unknown> {
    const length = randomInt(0, 15);
    const object: Record<string, unknown> = Object.create(randomPrototype());
    for (let i = 0; i < length; i++) {
        object[randomString()] = random();
    }
    return object;
}
function randomString(): string {
    const length = randomInt(0, 15);
    let string = "";
    for (let i = 0; i < length; i++) {
        string += String.fromCharCode(randomInt(0, 255));
    }
    return string;
}
function randomPrototype(): Record<string, unknown> {
    const length = randomInt(0, 15);
    const prototype: Record<string, unknown> = {};
    for (let i = 0; i < length; i++) {
        prototype[randomString()] = random();
    }
    return prototype;
}
function randomArray(): unknown[] {
    const length = randomInt(0, 15);
    const array = [];
    for (let i = 0; i < length; i++) {
        array.push(random());
    }
    return array;
}
function randomFunction(): (...args: unknown[]) => unknown {
    const length = randomInt(0, 15);
    const args = [];
    for (let i = 0; i < length; i++) {
        args.push(randomString());
    }
    const body = randomString();
    return new Function(...args, body) as (...args: unknown[]) => unknown;
}
