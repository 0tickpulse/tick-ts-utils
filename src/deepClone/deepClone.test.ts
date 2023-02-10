import { deepClone } from "./deepClone";

test("deepClone with objects", () => {
    const a = { a: 1, b: 2 };
    const b = deepClone(a);
    a.a = 3;
    expect(b).toEqual({ a: 1, b: 2 });
})