import { groupArrayIntoArrayBy } from "./groupBy.js";
import { chunkArray, fill, formatArray, range } from "./iterators.js";

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
    expect(chunkArray(a, 3)).toEqual([[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]);
});

test("fill test", () => {
    const obj = { a: 1 };
    const arr = fill(obj, 3);
    expect(arr).toEqual([obj, obj, obj]);
});

test("fill test with clone", () => {
    const obj2 = { a: 2 };
    const arr2 = fill(obj2, 3, true);
    arr2[0].a = 3;
    expect(arr2).toEqual([{ a: 3 }, { a: 2 }, { a: 2 }]);
});

test("group by test", () => {
    const array = [
        { name: "John", age: 20 },
        { name: "Jane", age: 20 },
        { name: "Jack", age: 30 },
    ];
    const grouped = groupArrayIntoArrayBy(array, (item) => item.age);
});
