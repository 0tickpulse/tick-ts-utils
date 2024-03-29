import { Comparable, ComparisonResult, DeepEquals } from "../index.js";

/**
 * A map of duration units to their millisecond equivalents.
 */
const DURATION_MAP = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000,
    years: 365 * 24 * 60 * 60 * 1000,
} as const satisfies Record<string, number>;

const UNITS_SHORTENED = {
    milliseconds: "ms",
    seconds: "s",
    minutes: "m",
    hours: "h",
    days: "d",
    weeks: "w",
    months: "m",
    years: "y",
} as const satisfies Record<keyof typeof DURATION_MAP, string>;

/**
 * Immutable class representing a duration of time.
 *
 * ## Motivation
 *
 * Durations in JavaScript are usually represented as numbers, which can be confusing.
 * This means that functions have to specify what unit the number is in, leading to many inconsistencies throughout different codebases.
 * This class solves this problem by providing a way to represent durations in a way that is easy to understand.
 *
 * ```ts
 * function doSomethingAfter(duration: number) {
 *     // ...
 * }
 * ```
 *
 * This function is very confusing. What unit is the number in? Is it in milliseconds? Seconds? Minutes?
 * You can solve this by changing the parameter name to something like `durationms`, but this, at least in my opinion, is verbose and ugly.
 * In addition, the inconsistencies mean that you have to convert units all the time:
 *
 * ```ts
 * const myMinutes = getFromAPI();
 * doSomethingAfter(myMinutes * 60 * 1000);
 * ```
 *
 * This is very confusing, and it is easy to make mistakes.
 *
 * Compare this to the following code:
 *
 * ```ts
 * function doSomethingAfter(duration: Duration) {
 *     // ...
 * }
 *
 * const duration = getFromAPI();
 * doSomethingAfter(duration);
 * ```
 *
 * This is much more readable and understandable. The code is also much more concise.
 *
 * @category Duration
 */
export class Duration implements DeepEquals, Comparable<Duration> {
    /**
     * A duration that represents no time.
     */
    static readonly INSTANT = new Duration(0);
    /**
     * A duration that represents forever.
     */
    static readonly FOREVER = new Duration(Infinity);
    constructor(public readonly milliseconds: number) {}
    /**
     * Constructs a new Duration from a unit and an amount.
     *
     * @example
     * ```ts
     * const duration = Duration.fromUnit("minutes", 5); // 5 minutes
     * ```
     *
     * @param unit   The unit of time to use. Refer to the `DURATION_MAP` constant for a list of valid units.
     * @param amount The amount of time to use.
     * @returns A new Duration object.
     */
    static fromUnit(unit: keyof typeof DURATION_MAP, amount: number): Duration {
        return new Duration(amount * DURATION_MAP[unit]);
    }
    /**
     * Gets the value of this duration in the specified unit.
     *
     * @param unit The unit to convert to.
     * @returns The value of this duration in the specified unit.
     */
    as(unit: keyof typeof DURATION_MAP): number {
        return this.milliseconds / DURATION_MAP[unit];
    }
    /**
     * Formats this duration into a human-readable string. If the duration is 0, returns "instantly".
     *
     * @param words If true, will use words (like "years") instead of single letters (like "y"), and will use commas and "and" to separate units.
     * @returns A human-readable string representing this duration.
     */
    format(words = false): string {
        if (this.milliseconds === 0) {
            return "instantly";
        }
        if (this.milliseconds === Infinity) {
            return "forever";
        }
        const units = new Map<keyof typeof DURATION_MAP, number>([
            ["years", 0],
            ["months", 0],
            ["weeks", 0],
            ["days", 0],
            ["hours", 0],
            ["minutes", 0],
            ["seconds", 0],
            ["milliseconds", 0],
        ]);
        let remaining = this.milliseconds;
        for (const [unit] of units) {
            const value = Math.floor(remaining / DURATION_MAP[unit]);
            units.set(unit, value);
            remaining -= value * DURATION_MAP[unit];
        }
        const result: string[] = [];
        for (const [unit, value] of units) {
            if (value === 0) {
                continue;
            }
            result.push(value + (words ? ` ${unit.slice(0, value === 1 ? -1 : undefined)}` : UNITS_SHORTENED[unit]));
        }
        if (words) {
            if (result.length === 1) {
                return result[0];
            }
            return `${result.slice(0, -1).join(", ")} and ${result[result.length - 1]}`;
        }
        return result.join(" ");
    }

    [Symbol.toPrimitive](hint: "default" | "number" | "string"): string | number {
        if (hint === "number") {
            return this.milliseconds;
        }
        return this.toString();
    }

    /**
     * Adds this duration to another duration.
     *
     * @param duration The duration to add.
     * @returns A new duration representing the sum of this duration and the other duration.
     */
    add(duration: Duration): Duration {
        return new Duration(this.milliseconds + duration.milliseconds);
    }

    /**
     * Adds this duration to another duration using a unit.
     * This is equivalent to `duration.add(Duration.fromUnit(unit, amount))`.
     *
     * @param unit The unit to use.
     * @param amount The amount to add.
     * @returns A new duration representing the sum of this duration and the other duration.
     */
    addUnit(unit: keyof typeof DURATION_MAP, amount: number): Duration {
        return new Duration(this.milliseconds + amount * DURATION_MAP[unit]);
    }

    /**
     * Subtracts this duration from another duration.
     *
     * @param duration The duration to subtract.
     * @returns A new duration representing the difference between this duration and the other duration.
     */
    subtract(duration: Duration): Duration {
        return new Duration(this.milliseconds - duration.milliseconds);
    }

    /**
     * Subtracts this duration from another duration using a unit.
     *
     * @param unit The unit to use.
     * @param amount The amount to subtract.
     */
    subtractUnit(unit: keyof typeof DURATION_MAP, amount: number): Duration {
        return new Duration(this.milliseconds - amount * DURATION_MAP[unit]);
    }

    /**
     * Multiplies this duration by a number.
     *
     * @param amount The amount to multiply by.
     * @returns A new duration representing the product of this duration and the number.
     */
    multiply(amount: number): Duration {
        return new Duration(this.milliseconds * amount);
    }

    /**
     * Divides this duration by a number.
     *
     * @param amount The amount to divide by.
     * @returns A new duration representing the quotient of this duration and the number.
     */
    divide(amount: number): Duration {
        return new Duration(this.milliseconds / amount);
    }

    compareTo(other: Duration): ComparisonResult {
        return this.milliseconds > other.milliseconds ? 1 : this.milliseconds < other.milliseconds ? -1 : 0;
    }

    /**
     * Compares this duration to another duration in a specific unit. Shortcut for `this.compareTo(Duration.fromUnit(unit, amount))`.
     *
     * @param unit The unit to compare to.
     * @param amount The amount of the unit to compare to.
     * @returns 0 if the durations are equal, 1 if this duration is longer, and -1 if this duration is shorter.
     */
    compareUnit(unit: keyof typeof DURATION_MAP, amount: number): ComparisonResult {
        return this.milliseconds > amount * DURATION_MAP[unit] ? 1 : this.milliseconds < amount * DURATION_MAP[unit] ? -1 : 0;
    }

    toString(): string {
        return this.format();
    }

    /**
     * Adds this duration to a date.
     *
     * @param date The date to add this duration to.
     * @returns A new date representing the sum of this duration and the date.
     */
    after(date: Date): Date {
        return new Date(date.getTime() + this.milliseconds);
    }

    /**
     * Subtracts this duration from a date.
     *
     * @param date The date to subtract this duration from.
     * @returns A new date representing the difference between this duration and the date.
     */
    before(date: Date): Date {
        return new Date(date.getTime() - this.milliseconds);
    }

    equals(duration: Duration): boolean {
        return this.milliseconds === duration.milliseconds;
    }
}
