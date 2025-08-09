import { PyImport } from "../models/python/PyImport";

export function generateImports(imports: PyImport[]): string {
    imports.sort((a, b) => a.module.localeCompare(b.module));
    const lines = imports.flatMap((imp) => {
        const names = imp.names.map(
            (n) => n.asname ? `${n.name} as ${n.asname}` : n.name
        ).join(", ");
        return `from ${imp.module} import ${names}`;
    });
    return lines.join("\n");
}