import { Comparable, DeepEquals } from "../index.js";

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
    format(words = false) {
        if (this.milliseconds === 0) {
            return "instantly";
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
        for (const [unit, index] of units) {
            const value = Math.floor(remaining / DURATION_MAP[unit]);
            units.set(unit, value);
            remaining -= value * DURATION_MAP[unit];
        }
        const result: string[] = [];
        for (const [unit, value] of units) {
            if (value === 0) {
                continue;
            }
            result.push(`${value}${words ? ` ${unit}` : unit[0]}${words && value !== 1 ? "s" : ""}`);
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

    add(duration: Duration): Duration {
        return new Duration(this.milliseconds + duration.milliseconds);
    }

    addUnit(unit: keyof typeof DURATION_MAP, amount: number): Duration {
        return new Duration(this.milliseconds + amount * DURATION_MAP[unit]);
    }

    subtract(duration: Duration): Duration {
        return new Duration(this.milliseconds - duration.milliseconds);
    }

    subtractUnit(unit: keyof typeof DURATION_MAP, amount: number): Duration {
        return new Duration(this.milliseconds - amount * DURATION_MAP[unit]);
    }

    multiply(amount: number): Duration {
        return new Duration(this.milliseconds * amount);
    }

    divide(amount: number): Duration {
        return new Duration(this.milliseconds / amount);
    }

    /**
     * Compares this duration to another duration.
     *
     * @param other The other duration to compare to.
     * @returns 0 if the durations are equal, 1 if this duration is longer, and -1 if this duration is shorter.
     */
    compareTo(other: Duration): 0 | 1 | -1 {
        return this.milliseconds > other.milliseconds ? 1 : this.milliseconds < other.milliseconds ? -1 : 0;
    }

    /**
     * Compares this duration to another duration in a specific unit. Shortcut for `this.compareTo(Duration.fromUnit(unit, amount))`.
     *
     * @param unit The unit to compare to.
     * @param amount The amount of the unit to compare to.
     * @returns 0 if the durations are equal, 1 if this duration is longer, and -1 if this duration is shorter.
     */
    compareUnit(unit: keyof typeof DURATION_MAP, amount: number): 0 | 1 | -1 {
        return this.milliseconds > amount * DURATION_MAP[unit] ? 1 : this.milliseconds < amount * DURATION_MAP[unit] ? -1 : 0;
    }

    toString(): string {
        return this.format();
    }

    after(date: Date): Date {
        return new Date(date.getTime() + this.milliseconds);
    }

    before(date: Date): Date {
        return new Date(date.getTime() - this.milliseconds);
    }

    equals(duration: Duration): boolean {
        return this.milliseconds === duration.milliseconds;
    }
}
