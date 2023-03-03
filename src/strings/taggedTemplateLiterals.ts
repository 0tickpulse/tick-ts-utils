function createRawTemplateLiteralTransformer(transform: (s: string) => string) {
    return (strings: TemplateStringsArray, ...values: unknown[]): string => {
        let result = "";
        for (let i = 0; i < strings.length; i++) {
            result += strings[i];
            if (i < values.length) {
                result += values[i];
            }
        }
        return transform(result);
    };
}

/**
 * Strips indentation from a template literal, so that the first line is at the start of the string, and the rest of the lines are indented by the same amount.
 * Very useful for writing multi-line strings.
 * @example
 * ```ts
 * const s = stripIndentation`
 *    Hello
 *    World
 * `;
 * // "Hello\nWorld"
 * ```
 *
 * @category Strings
 */
export const stripIndentation = createRawTemplateLiteralTransformer((s) => {
    const lines = s.split(/\r?\n/);
    const indent = lines[0].match(/^\s*/)?.[0].length ?? 0;
    return lines.map((line) => " ".repeat(indent) + line.trim()).join("\n");
});
