import { PyClass } from "../models/python/PyClass";
import { PyImport } from "../models/python/PyImport";
import { PythonFile } from "../models/python/PythonFile";
import { resolvePythonImportPath } from "./importResolver";

export async function extractImports(
    pythonFile: PythonFile,
    pyClass: PyClass,
    interfaceName: string | null): Promise<PyImport[]> {

    const importPath = await resolvePythonImportPath(pythonFile.path);
    console.log('FROM:' + importPath);
    const names = [{ name: pyClass.name, asname: null }];
    const targetImport = new PyImport(importPath, names);
    const imports = pythonFile.getInjectedDependencies(pyClass.name);
    // コンストラクタの依存importが足りない？
    console.log('IMPORTS:', imports);
    imports.push(targetImport);
    if (interfaceName) {
        const interfaceImport = pythonFile.ast.imports.get(interfaceName);
        if (interfaceImport) { imports.push(interfaceImport); }
    }
    imports.sort((a, b) => a.module.localeCompare(b.module));
    return imports;
}