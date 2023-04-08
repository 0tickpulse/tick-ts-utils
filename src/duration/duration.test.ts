import { Duration } from "./duration.js";

test("duration fromUnit test", () => {
    expect(Duration.fromUnit("years", 1).as("years")).toEqual(1);
    expect(Duration.fromUnit("months", 1).as("months")).toEqual(1);
    expect(Duration.fromUnit("weeks", 1).as("weeks")).toEqual(1);
    expect(Duration.fromUnit("days", 1).as("days")).toEqual(1);
    expect(Duration.fromUnit("hours", 1).as("hours")).toEqual(1);
    expect(Duration.fromUnit("minutes", 1).as("minutes")).toEqual(1);
    expect(Duration.fromUnit("seconds", 1).as("seconds")).toEqual(1);
    expect(Duration.fromUnit("milliseconds", 1).as("milliseconds")).toEqual(1);
});

test("duration arithmetic test", () => {
    expect(Duration.fromUnit("hours", 1).add(Duration.fromUnit("hours", 1)).as("hours")).toEqual(2);
    expect(Duration.fromUnit("hours", 1).subtract(Duration.fromUnit("hours", 1)).as("hours")).toEqual(0);
    expect(Duration.fromUnit("hours", 1).multiply(2).as("hours")).toEqual(2);
    expect(Duration.fromUnit("hours", 1).addUnit("hours", 1).as("hours")).toEqual(2);
    expect(Duration.fromUnit("hours", 1).subtractUnit("hours", 1).as("hours")).toEqual(0);
    expect(Duration.fromUnit("hours", 1).divide(2).as("hours")).toEqual(0.5);
});

test("duration format test", () => {
    expect(new Duration(0).format()).toEqual("instantly");
    expect(new Duration(Infinity).format()).toEqual("forever");
    expect(new Duration(1000 * 60).format(true)).toEqual("1 minute");
    expect(new Duration(1000 * 60).format()).toEqual("1m");
    expect(new Duration(1000 * 60 * 60).format()).toEqual("1h");
    expect(new Duration(1000 * 60 * 60 * 24).format()).toEqual("1d");
    expect(Duration.fromUnit("months", 5).addUnit("weeks", 2).format()).toEqual("5m 2w");
    expect(Duration.fromUnit("months", 5).addUnit("weeks", 2).format(true)).toEqual("5 months and 2 weeks");
});

test("duration toPrimitive test", () => {
    expect(+new Duration(0)).toEqual(0);
    expect("" + new Duration(0)).toEqual("instantly");
})
