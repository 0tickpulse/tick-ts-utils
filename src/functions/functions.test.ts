import { argFunction, constantFunction, curry, equalsFunction } from "./functions.js";

test("equalsFunction test", () => {
    expect(equalsFunction(5)(5)).toEqual(true);
    expect(equalsFunction(5)(6)).toEqual(false);
});

test("curry test", () => {
    expect(curry((a: number, b: number) => a + b)(5)(5)).toEqual(10);
});

test("constant test", () => {
    expect(constantFunction(5)()).toEqual(5);
});

test("argFunction test", () => {
    expect(argFunction(3)(1, 2, 3, 4).get()).toEqual(4);
    expect(argFunction(-2)(1, 2, 3, 4).get()).toEqual(3);
});
