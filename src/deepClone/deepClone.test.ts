import { Cloneable, deepClone } from "./deepClone.js";

class A implements Cloneable<A> {
    constructor(public a: number) {}
    deepClone(): A {
        return new A(this.a);
    }
}

test("deepClone with primitives", () => {
    expect(deepClone(5)).toEqual(5);
    expect(deepClone("a")).toEqual("a");
    expect(deepClone(true)).toEqual(true);
    expect(deepClone(undefined)).toEqual(undefined);
    expect(deepClone(null)).toEqual(null);
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
    const a = () => 5;
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
