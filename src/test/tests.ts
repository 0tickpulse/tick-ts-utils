import { match } from "../match/match";

function expect<T>(actual: T) {
    return {
        toBe(expected: T) {
            if (actual !== expected) {
                throw new Error(`Expected ${actual} to be ${expected}!`);
            }
        }
    };
}

const result = match<number, string>(5)
    .withFunc((x) => x == 1, "hello")
    .withFunc((x) => x == 2, "world")
    .withFunc((x) => x == 3, "foo")
    .withFunc((x) => x == 4, "bar")
    .withFunc((x) => x == 5, "baz")
    .otherwise("qux");

expect(result).toBe("baz");