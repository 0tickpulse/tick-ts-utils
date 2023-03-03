import { Match } from "./match.js";

test("Match equals test", () => {
    const value = new Match<number, string>(5).addEquals(5, "five").addEquals(6, "six").getOrElse("other");
    expect(value).toEqual("five");
});
