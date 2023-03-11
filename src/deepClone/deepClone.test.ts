import { Cloneable, deepClone } from "./deepClone.js";

class A implements Cloneable<A> {
    constructor(public a: number) {}
    deepClone(): A {
        return new A(this.a);
    }
}

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
