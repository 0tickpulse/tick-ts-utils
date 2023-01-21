import { match } from "../match/match.js";

function expect<T>(actual: T) {
    let index = 1;
    return {
        toBe(expected: T) {
            if (actual !== expected) {
                throw new Error(`Expected ${actual} to be ${expected}!`);
            }
            console.log(`Test ${index} passed!`);
            index++;
        }
    };
}

const result = match<number, string>(5)
    .withEquals(1, "hello")
    .withEquals(2, "world")
    .withEquals(3, "foo")
    .withEquals(4, "bar")
    .withEquals(5, "baz")
    .otherwise("qux");

expect(result).toBe("baz");
