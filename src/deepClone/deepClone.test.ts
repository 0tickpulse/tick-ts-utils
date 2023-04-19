import { Cloneable, deepClone } from "./deepClone.js";

class A implements Cloneable<A> {
    constructor(public a: number) {}
    deepClone(): A {
        return new A(this.a);
    }
}

function testCloneSimple<T>(a: T, b: T): void {
    // When cloned:
    // cloned === b should be false
    // cloned should deep equal b
    const cloned = deepClone(a);
    expect(cloned).not.toBe(b);
    expect(cloned).toEqual(b);
}

test("deepClone with primitives", () => {
    testCloneSimple(5, 5);
    testCloneSimple("a", "a");
    testCloneSimple(true, true);
    testCloneSimple(undefined, undefined);
    testCloneSimple(null, null);
});

test("deepClone with objects", () => {
    const a = { a: 1, b: 2 };
    const b = deepClone(a);
    a.a = 3;
    expect(b).toEqual({ a: 1, b: 2 });
});

test("deepClone with instances of classes that implement Cloneable", () => {
    const a = new A(1);
    const b = deepClone(a);
    a.a = 3;
    expect(b).toEqual(new A(1));
});

test("deepClone with functions", () => {
    const a = (): number => 5;
    const b = deepClone(a);
    expect(b()).toEqual(5);
});

test("deepClone with dates", () => {
    const a = new Date();
    const b = deepClone(a);
    expect(b.getTime()).toEqual(a.getTime());
});

test("deepClone with regexp", () => {
    const a = /a/;
    const b = deepClone(a);
    expect(b).toEqual(a);
});
