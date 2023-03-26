import { randomBoolean, randomInt } from "./random.js";

test("random boolean test", () => {
    expect([true, false]).toContain(randomBoolean());
});

test("random number test", () => {
    const random = randomInt(0, 10);
    expect(random).toBeGreaterThanOrEqual(0);
    expect(random).toBeLessThanOrEqual(10);
    expect(random % 1).toBe(0);
});
