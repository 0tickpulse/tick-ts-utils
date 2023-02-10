import { equalsFunction } from "./functions.js";

test("equalsFunction test", () => {
    expect(equalsFunction(5)(5)).toEqual(true);
    expect(equalsFunction(5)(6)).toEqual(false);
});
