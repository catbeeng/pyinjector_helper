export const INDENT_UNIT_AMOUNT = 4;

export function formatMultiLineArgs(lines: string[], indentWidth: number): string {
    if (lines.length === 1) { return lines[0]; }
    const indent = ' '.repeat(indentWidth);
    const lastIndent = ' '.repeat(indentWidth - INDENT_UNIT_AMOUNT);
    return "\n" + lines.
        map((line) => indent + line + ",").
        join("\n") + "\n" + lastIndent;
}