import { range } from "./iterators.js";

test("range single arity test", () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
    expect(range(0)).toEqual([]);
    expect(range(-5)).toEqual([0, -1, -2, -3, -4]);
});

test("range double arity test", () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(5, 1)).toEqual([5, 4, 3, 2]);
    expect(range(0, 0)).toEqual([]);
    expect(range(5, -5)).toEqual([5, 4, 3, 2, 1, 0, -1, -2, -3, -4]);
});
