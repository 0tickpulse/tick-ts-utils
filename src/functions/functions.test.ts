import { curry, equalsFunction } from "./functions.js";

test("equalsFunction test", () => {
    expect(equalsFunction(5)(5)).toEqual(true);
    expect(equalsFunction(5)(6)).toEqual(false);
});

test("curry test", () => {
    expect(curry((a: number, b: number) => a + b)(5)(5)).toEqual(10);
})
