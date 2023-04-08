import { Color } from "./color.js";

test("color randomized rgba test", () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = Math.random();
    const color = new Color(r, g, b, a);
    expect(color.red).toEqual(r);
    expect(color.green).toEqual(g);
    expect(color.blue).toEqual(b);
    expect(color.alpha).toEqual(a);
});

test("color fromCMYK test", () => {
    const color = Color.fromCMYK(0, 0, 0, 0);
    expect(color.red).toEqual(255);
    expect(color.green).toEqual(255);
    expect(color.blue).toEqual(255);
    expect(color.alpha).toEqual(1);

    const color2 = Color.fromCMYK(0, 0, 0, 1);
    expect(color2.red).toEqual(0);
    expect(color2.green).toEqual(0);
    expect(color2.blue).toEqual(0);
    expect(color2.alpha).toEqual(1);

    const color3 = Color.fromCMYK(0, 0, 0, 0.5);
    expect(color3.red).toEqual(128);
    expect(color3.green).toEqual(128);
    expect(color3.blue).toEqual(128);
    expect(color3.alpha).toEqual(1);
});

test("color fromHSL test", () => {
    const color = Color.fromHSL(0, 0, 0);
    expect(color.red).toEqual(0);
    expect(color.green).toEqual(0);
    expect(color.blue).toEqual(0);
    expect(color.alpha).toEqual(1);

    const color2 = Color.fromHSL(0, 0, 1);
    expect(color2.red).toEqual(255);
    expect(color2.green).toEqual(255);
    expect(color2.blue).toEqual(255);
    expect(color2.alpha).toEqual(1);

    const color3 = Color.fromHSL(0, 1, 0.5);
    expect(color3.red).toEqual(255);
    expect(color3.green).toEqual(0);
    expect(color3.blue).toEqual(0);
    expect(color3.alpha).toEqual(1);

    const color4 = Color.fromHSL(120, 1, 0.5);
    expect(color4.red).toEqual(0);
    expect(color4.green).toEqual(255);
    expect(color4.blue).toEqual(0);
    expect(color4.alpha).toEqual(1);

    const color5 = Color.fromHSL(240, 1, 0.5);
    expect(color5.red).toEqual(0);
    expect(color5.green).toEqual(0);
    expect(color5.blue).toEqual(255);
    expect(color5.alpha).toEqual(1);
});

test("color fromHSV test", () => {
    const color = Color.fromHSV(0, 0, 0);
    expect(color.red).toEqual(0);
    expect(color.green).toEqual(0);
    expect(color.blue).toEqual(0);
    expect(color.alpha).toEqual(1);

    const color2 = Color.fromHSV(0, 0, 1);
    expect(color2.red).toEqual(255);
    expect(color2.green).toEqual(255);
    expect(color2.blue).toEqual(255);
    expect(color2.alpha).toEqual(1);

    const color3 = Color.fromHSV(0, 1, 1);
    expect(color3.red).toEqual(255);
    expect(color3.green).toEqual(0);
    expect(color3.blue).toEqual(0);
    expect(color3.alpha).toEqual(1);

    const color4 = Color.fromHSV(120, 1, 1);
    expect(color4.red).toEqual(0);
    expect(color4.green).toEqual(255);
    expect(color4.blue).toEqual(0);
    expect(color4.alpha).toEqual(1);

    const color5 = Color.fromHSV(240, 1, 1);
    expect(color5.red).toEqual(0);
    expect(color5.green).toEqual(0);
    expect(color5.blue).toEqual(255);
    expect(color5.alpha).toEqual(1);
});

test("color randomized toHex test", () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = Math.random();
    const color = new Color(r, g, b, a);
    expect(color.toHex()).toEqual(`#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`);
});

test("color randomized toCss test", () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = Math.random();
    const color = new Color(r, g, b, a);
    expect(color.toCss()).toEqual(`rgba(${r}, ${g}, ${b}, ${a})`);
});

test("color randomized Ansi code test", () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = Math.random();
    const color = new Color(r, g, b, a);
    expect(color.toAnsiColorCode()).toEqual(`\x1b[38;2;${r};${g};${b}m`);
})

test("color setters test", () => {
    const color = new Color(0, 0, 0, 0);
    color.setRed(255);
    color.setGreen(255);
    color.setBlue(255);
    color.setAlpha(1);
    expect(color.red).toEqual(255);
    expect(color.green).toEqual(255);
    expect(color.blue).toEqual(255);
    expect(color.alpha).toEqual(1);
})
