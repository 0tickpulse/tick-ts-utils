import { Match } from "./match";

test("Match equals test", () => {
    const value = new Match<number, string>(5).withEquals(5, "five").withEquals(6, "six").otherwise("other");
    expect(value).toEqual("five");
});
