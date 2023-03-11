import { Comparable, compare, flattenComparison } from "./comparisons.js";

class TestClass implements Comparable<TestClass> {
    constructor(public value: number) {}

    compareTo(other: TestClass): -1 | 0 | 1 {
        return flattenComparison(this.value - other.value);
    }
}

test("flattenComparison", () => {
    expect(flattenComparison(0)).toEqual(0);
    expect(flattenComparison(1)).toEqual(1);
    expect(flattenComparison(-1)).toEqual(-1);
    expect(flattenComparison(5)).toEqual(1);
    expect(flattenComparison(-5)).toEqual(-1);
});

test("compareTo with primitive numbers", () => {
    expect(compare(1, 1)).toEqual(0);
    expect(compare(1, 2)).toEqual(-1);
    expect(compare(2, 1)).toEqual(1);
});

test("compareTo with randomly generated primitive numbers", () => {
    for (let i = 0; i < 100; i++) {
        const a = Math.random();
        const b = Math.random();
        if (a < b) {
            expect(compare(a, b)).toEqual(-1);
        }
        if (a > b) {
            expect(compare(a, b)).toEqual(1);
        }
    }
});

test("compareTo with Comparable instances", () => {
    expect(compare(new TestClass(1), new TestClass(1))).toEqual(0);
    expect(compare(new TestClass(1), new TestClass(2))).toEqual(-1);
    expect(compare(new TestClass(2), new TestClass(1))).toEqual(1);
});
