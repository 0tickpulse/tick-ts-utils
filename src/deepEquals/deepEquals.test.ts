import { DeepEquals, deepEquals } from "./deepEquals.js";

class TestClass {
    constructor(public a: number, public b: number) {}
}

class TestClassWithEquals implements DeepEquals {
    constructor(public a: number, public b: number) {}
    equals(other: unknown): boolean {
        if (!(other instanceof TestClassWithEquals)) {
            return false;
        }
        return this.a + this.b === other.a + other.b;
    }
}

test("deepEquals with primitive values", () => {
    expect(deepEquals(5, 5)).toEqual(true);
    expect(deepEquals("a", "a")).toEqual(true);
    expect(deepEquals(true, true)).toEqual(true);
    expect(deepEquals(undefined, undefined)).toEqual(true);
    expect(deepEquals(null, null)).toEqual(true);

    expect(deepEquals(5, 6)).toEqual(false);
    expect(deepEquals(undefined, null)).toEqual(false);
    expect(deepEquals("a", "b")).toEqual(false);
    expect(deepEquals(null, undefined)).toEqual(false);
});

test("deepEquals with objects", () => {
    expect(deepEquals({ a: 1, b: 2 }, { a: 1, b: 2 })).toEqual(true);
    expect(deepEquals({ a: 1, b: 2 }, { b: 2, a: 1 })).toEqual(true);
    expect(deepEquals({ a: 1, b: 2 }, { a: 1, b: 3 })).toEqual(false);
    expect(deepEquals({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toEqual(false);
});

test("deepEquals with arrays of primitives", () => {
    expect(deepEquals([], [])).toEqual(true);
    expect(deepEquals([1, 2, 3], [1, 2, 3])).toEqual(true);
    expect(deepEquals([1, 2, 3], [1, 2, 4])).toEqual(false);
    expect(deepEquals([1, 2, 3], [1, 2, 3, 4, 5])).toEqual(false);
});

test("deepEquals recursion test with arrays of objects", () => {
    expect(deepEquals([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toEqual(true);
    expect(deepEquals([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }])).toEqual(false);
});

test("deepEquals with instances of classes", () => {
    expect(deepEquals(new TestClass(1, 2), new TestClass(1, 2))).toEqual(true);
});

test("deepEquals with instances of classes with equals method", () => {
    const obj = new TestClassWithEquals(1, 2);
    // equality is based on the sum of the values
    expect(deepEquals(new TestClassWithEquals(1, 2), new TestClassWithEquals(1, 2))).toEqual(true);
    expect(deepEquals(new TestClassWithEquals(1, 2), new TestClassWithEquals(2, 1))).toEqual(true);
    expect(deepEquals(new TestClassWithEquals(1, 2), new TestClassWithEquals(3, 4))).toEqual(false);
});
