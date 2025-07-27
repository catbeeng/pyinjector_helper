import { PyArgument } from "../models/python/PyArgument";
import { PyImport } from "../models/python/PyImport";

const INDENT_UNIT_AMOUNT = 4;
/**
 * 依存インポート文生成
 */
export function generateDependencyImports(imports: PyImport[]): string {
    const lines = imports.flatMap((imp) => {
        const names = imp.names.map(
            (n) => n.asname ? `${n.name} as ${n.asname}` : n.name
        ).join(", ");
        return `from ${imp.module} import ${names}`;
    });
    return lines.join("\n");
}

/**
 * 型付き引数列生成
 */
export function generateParametersWithType(args: PyArgument[]): string {
    if (args.length === 0) { return "self"; }
    const argLines = ["self", ...args.map(arg =>
        arg.annotation ? `${arg.name}: ${arg.annotation}` : arg.name
    )];
    return formatMultilineArgs(argLines, INDENT_UNIT_AMOUNT * 2);
}

/**
 * 引数列生成（型なし）
 */
export function generateParameters(args: PyArgument[]): string {
    if (args.length === 0) { return ""; }
    const argLines = args.map(arg => arg.name);
    return formatMultilineArgs(argLines, INDENT_UNIT_AMOUNT * 3);
}

/**
 * 引数の整形（インデント考慮、複数行対応）
 */
function formatMultilineArgs(lines: string[], indentWidth: number): string {
    if (lines.length === 1) { return lines[0]; }
    const indent = ' '.repeat(indentWidth);
    const lastIndent = ' '.repeat(indentWidth - INDENT_UNIT_AMOUNT);
    return "\n" + lines.
        map((line) => indent + line + ",").
        join("\n") + "\n" + lastIndent;
}
