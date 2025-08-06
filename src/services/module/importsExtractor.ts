import { PyClass } from "../../models/python/PyClass";
import { PyImport } from "../../models/python/PyImport";
import { PythonFile } from "../../models/python/PythonFile";
import { resolvePythonImportPath } from "./importResolver";

export function getInterfaceImport(interfaceName: string | null, pythonFile: PythonFile): PyImport | null {
    if (interfaceName) {
        return pythonFile.ast.imports.get(interfaceName)?? null;
    }
    return null;
}

export async function generateImport(pythonFile: PythonFile, pyClass: PyClass) {
    const importPath = await resolvePythonImportPath(pythonFile.path);
    const names = [{ name: pyClass.name, asname: null }];
    const targetImport = new PyImport(importPath, names);
    return targetImport;
}
