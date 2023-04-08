import {
    Comparable,
    compare,
    flattenComparison,
    flipComparison,
    isBetween,
    isGreaterThan,
    isGreaterThanOrEqual,
    isLessThan,
    isLessThanOrEqual,
} from "./comparisons.js";

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

test("flipComparison test", () => {
    expect(flipComparison(1)).toEqual(-1);
    expect(flipComparison(-1)).toEqual(1);
    expect(flipComparison(0)).toEqual(0);
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

test("compare with Comparable instances where 1st arg doesn't have compare", () => {
    expect(compare(Object.assign(new TestClass(1), { compareTo: undefined }), new TestClass(1))).toEqual(0);
    expect(compare(Object.assign(new TestClass(1), { compareTo: undefined }), new TestClass(2))).toEqual(-1);
    expect(compare(Object.assign(new TestClass(2), { compareTo: undefined }), new TestClass(1))).toEqual(1);
});

test("isGreaterThan, isLessThan, etc tests", () => {
    expect(isGreaterThan(3, 1)).toEqual(true);
    expect(isGreaterThan(1, 3)).toEqual(false);
    expect(isGreaterThan(1, 1)).toEqual(false);
    expect(isGreaterThanOrEqual(3, 1)).toEqual(true);
    expect(isGreaterThanOrEqual(1, 3)).toEqual(false);
    expect(isGreaterThanOrEqual(1, 1)).toEqual(true);
    expect(isLessThan(3, 1)).toEqual(false);
    expect(isLessThan(1, 3)).toEqual(true);
    expect(isLessThan(1, 1)).toEqual(false);
    expect(isLessThanOrEqual(3, 1)).toEqual(false);
    expect(isLessThanOrEqual(1, 3)).toEqual(true);
    expect(isLessThanOrEqual(1, 1)).toEqual(true);
    expect(isBetween(3, 1, 5)).toEqual(true);
    expect(isBetween(3, 5, 1)).toEqual(false);
    expect(isBetween(3, 1, 2)).toEqual(false);
    expect(isBetween(3, 4, 5)).toEqual(false);
    expect(isBetween(3, 3, 5, true)).toEqual(true);
    expect(isBetween(3, 3, 5, false)).toEqual(false);
});
