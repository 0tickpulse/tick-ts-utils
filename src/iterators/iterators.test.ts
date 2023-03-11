import { chunkArray, formatArray, range } from "./iterators.js";

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

test("array formatting test", () => {
    const a = range(5);
    expect(formatArray(a)).toEqual("0, 1, 2, 3, and 4");
});

test("array chunk test", () => {
    const a = range(10);
    expect(chunkArray(a, 3)).toEqual([
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [9],
    ]);
})
