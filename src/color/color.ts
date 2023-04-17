import { Cloneable, DeepEquals, Result, color, foregroundColor, fromSGR } from "../index.js";

export class ColorHexParseError extends Error {}

/**
 * A color represented by red, green, blue, and alpha values from 0 to 255.
 * Useful for converting between color spaces as well as representing colors in different formats.
 *
 * @see https://en.wikipedia.org/wiki/RGBA_color_space
 * @category Color
 */
export class Color implements Cloneable<Color>, DeepEquals {
    static readonly RED = new Color(255, 0, 0);
    static readonly GREEN = new Color(0, 255, 0);
    static readonly BLUE = new Color(0, 0, 255);
    static readonly WHITE = new Color(255, 255, 255);
    static readonly CYAN = new Color(0, 255, 255);
    static readonly MAGENTA = new Color(255, 0, 255);
    static readonly YELLOW = new Color(255, 255, 0);
    static readonly BLACK = new Color(0, 0, 0);
    static readonly BROWN = new Color(165, 42, 42);
    static readonly ORANGE = new Color(255, 165, 0);
    static readonly PINK = new Color(255, 192, 203);
    static readonly PURPLE = new Color(128, 0, 128);
    static readonly GRAY = new Color(128, 128, 128);
    constructor(
        /**
         * The red value of this color as a number from 0 to 255.
         */
        public red: number,
        /**
         * The green value of this color as a number from 0 to 255.
         */
        public green: number,
        /**
         * The blue value of this color as a number from 0 to 255.
         */
        public blue: number,
        /**
         * The alpha value of this color as a number from 0 to 1.
         */
        public alpha = 1,
    ) {}
    /**
     * Parses a hex string into a color. Does not support the shorthand hex format.
     *
     * @example
     * ```ts
     * const color = Color.parseHex("#ff0000"); // red
     * ```
     *
     * @param hex The hex string to parse.
     * @returns A Result containing the parsed color or an error.
     */
    static parseHex(hex: string): Result<Color, ColorHexParseError> {
        // regex
        const match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i.exec(hex);
        if (!match) {
            return Result.error(new ColorHexParseError(`Invalid hex color: ${hex}`));
        }
        const [, r, g, b, a] = match;
        return Result.ok(new Color(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), a ? parseInt(a, 16) : 255));
    }
    /**
     * Constructs a new color from the specified CMYK values with an optional alpha value.
     *
     * @see https://en.wikipedia.org/wiki/CMYK_color_model
     * @param cyan    The cyan value of the color as a number from 0 to 1.
     * @param magenta The magenta value of the color as a number from 0 to 1.
     * @param yellow  The yellow value of the color as a number from 0 to 1.
     * @param black   The black value of the color as a number from 0 to 1.
     * @param alpha   The alpha value of the color as a number from 0 to 1.
     */
    static fromCMYK(cyan: number, magenta: number, yellow: number, black: number, alpha = 1): Color {
        const cmyk = (n: number): number => Math.round(255 * (1 - n) * (1 - black));
        return new Color(cmyk(cyan), cmyk(magenta), cmyk(yellow), alpha);
    }
    /**
     * Constructs a new color from the specified HSL values with an optional alpha value.
     *
     * @see https://en.wikipedia.org/wiki/HSL_and_HSV
     * @param hue        The hue value of the color as a number from 0 to 360.
     * @param saturation The saturation value of the color as a number from 0 to 1.
     * @param lightness  The lightness value of the color as a number from 0 to 1.
     * @param alpha      The alpha value of the color as a number from 0 to 1.
     */
    static fromHSL(hue: number, saturation: number, lightness: number, alpha = 1): Color {
        const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
        const m = lightness - c / 2;
        const rgb = (n: number): number => Math.round(255 * (n + m));
        if (hue < 60) {
            return new Color(rgb(c), rgb(x), rgb(0), alpha);
        }
        if (hue < 120) {
            return new Color(rgb(x), rgb(c), rgb(0), alpha);
        }
        if (hue < 180) {
            return new Color(rgb(0), rgb(c), rgb(x), alpha);
        }
        if (hue < 240) {
            return new Color(rgb(0), rgb(x), rgb(c), alpha);
        }
        if (hue < 300) {
            return new Color(rgb(x), rgb(0), rgb(c), alpha);
        }
        return new Color(rgb(c), rgb(0), rgb(x), alpha);
    }
    /**
     * Constructs a new color from the specified HSV values with an optional alpha value.
     *
     * @see https://en.wikipedia.org/wiki/HSL_and_HSV
     * @param hue        The hue value of the color as a number from 0 to 360.
     * @param saturation The saturation value of the color as a number from 0 to 1.
     * @param value      The value value of the color as a number from 0 to 1.
     * @param alpha      The alpha value of the color as a number from 0 to 1.
     */
    static fromHSV(hue: number, saturation: number, value: number, alpha = 1): Color {
        const c = value * saturation;
        const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
        const m = value - c;
        const rgb = (n: number): number => Math.round(255 * (n + m));
        if (hue < 60) {
            return new Color(rgb(c), rgb(x), rgb(0), alpha);
        }
        if (hue < 120) {
            return new Color(rgb(x), rgb(c), rgb(0), alpha);
        }
        if (hue < 180) {
            return new Color(rgb(0), rgb(c), rgb(x), alpha);
        }
        if (hue < 240) {
            return new Color(rgb(0), rgb(x), rgb(c), alpha);
        }
        if (hue < 300) {
            return new Color(rgb(x), rgb(0), rgb(c), alpha);
        }
        return new Color(rgb(c), rgb(0), rgb(x), alpha);
    }
    equals(other: unknown): boolean {
        if (!(other instanceof Color)) {
            return false;
        }
        return this.red === other.red && this.green === other.green && this.blue === other.blue && this.alpha === other.alpha;
    }
    deepClone(): Color {
        return new Color(this.red, this.green, this.blue, this.alpha);
    }
    /**
     * Returns the color as a hex string, optionally including the alpha value.
     *
     * @param supportsAlpha Whether the hex string should include the alpha value.
     */
    toHex(supportsAlpha = false): string {
        const hex = (n: number): string => n.toString(16).padStart(2, "0");
        return `#${hex(this.red)}${hex(this.green)}${hex(this.blue)}${supportsAlpha ? hex(this.alpha) : ""}`;
    }
    /**
     * Returns the color as a CSS string, including the alpha value.
     * Format is `rgba(r, g, b, a)`.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba()
     */
    toCss(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }
    /**
     * @deprecated Use {@link toAnsiForeground} instead.
     *
     * Returns the color as an ANSI foreground color code, stripping the alpha value.
     * Identical to foregroundColor.
     *
     * @see foregroundColor
     */
    toAnsiColorCode(): string {
        return foregroundColor(this.red, this.green, this.blue);
    }
    /**
     * Returns the color as an ANSI foreground color code, stripping the alpha value.
     *
     * @see https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
     */
    toAnsiForeground(): string {
        return fromSGR(`38;2;${this.red};${this.green};${this.blue}`);
    }
    /**
     * Returns the color as an ANSI background color code, stripping the alpha value.
     *
     * @see https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
     */
    toAnsiBackground(): string {
        return fromSGR(`48;2;${this.red};${this.green};${this.blue}`);
    }
    /**
     * Sets the red value of the color.
     *
     * @param r The red value of the color as a number from 0 to 255.
     * @returns The object itself, for method chaining.
     */
    setRed(r: number): this {
        this.red = r;
        return this;
    }
    /**
     * Sets the green value of the color.
     *
     * @param g The green value of the color as a number from 0 to 255.
     * @returns The object itself, for method chaining.
     */
    setGreen(g: number): this {
        this.green = g;
        return this;
    }
    /**
     * Sets the blue value of the color.
     *
     * @param b The blue value of the color as a number from 0 to 255.
     * @returns The object itself, for method chaining.
     */
    setBlue(b: number): this {
        this.blue = b;
        return this;
    }
    /**
     * Sets the alpha value of the color.
     *
     * @param a The alpha value of the color as a number from 0 to 1.
     * @returns The object itself, for method chaining.
     */
    setAlpha(a: number): this {
        this.alpha = a;
        return this;
    }
    /**
     * The CMax value is the maximum of the red, green, and blue values divided by 255.
     * Used for converting to other color spaces such as CMYK.
     */
    get cMax(): number {
        return Math.max(this.red / 255, this.green / 255, this.blue / 255);
    }
    /**
     * The CMin value is the minimum of the red, green, and blue values divided by 255.
     * Used for converting to other color spaces such as HSL.
     */
    get cMin(): number {
        return Math.min(this.red / 255, this.green / 255, this.blue / 255);
    }
    /**
     * The Delta value is the difference between the CMax and CMin values.
     * Used for converting to other color spaces such as HSL.
     */
    get delta(): number {
        return this.cMax - this.cMin;
    }
    /**
     * Calculates the equivalent cyan value of this color as a number from 0 to 1.
     */
    get cyan(): number {
        return (1 - this.red / 255 - this.black) / (1 - this.black);
    }
    /**
     * Calculates the equivalent magenta value of this color as a number from 0 to 1.
     */
    get magenta(): number {
        return (1 - this.green / 255 - this.black) / (1 - this.black);
    }
    /**
     * Calculates the equivalent yellow value of this color as a number from 0 to 1.
     */
    get yellow(): number {
        return (1 - this.blue / 255 - this.black) / (1 - this.black);
    }
    /**
     * Calculates the equivalent black value of this color as a number from 0 to 1.
     */
    get black(): number {
        return 1 - this.cMax;
    }
    /**
     * Calculates the equivalent hue value of this color in degrees.
     * Returns 0 if the color is black.
     */
    get hue(): number {
        if (this.delta === 0) {
            return 0;
        }
        if (this.cMax === this.red / 255) {
            return (((this.green / 255 - this.blue / 255) / this.delta) % 6) * 60;
        }
        if (this.cMax === this.green / 255) {
            return ((this.blue / 255 - this.red / 255) / this.delta + 2) * 60;
        }
        if (this.cMax === this.blue / 255) {
            return ((this.red / 255 - this.green / 255) / this.delta + 4) * 60;
        }
        return 0; // Should never happen
    }
    /**
     * Calculates the equivalent saturation value of this color as a number from 0 to 1.
     */
    get saturation(): number {
        if (this.cMax === 0) {
            return 0;
        }
        return this.delta / this.cMax;
    }
    /**
     * Calculates the equivalent *value* value of this color as a number from 0 to 1.
     * This is the same as the CMax value.
     */
    get value(): number {
        return this.cMax;
    }
    /**
     * Calculates the equivalent lightness value of this color as a number from 0 to 1.
     */
    get lightness(): number {
        return (this.cMax + this.cMin) / 2;
    }
}
