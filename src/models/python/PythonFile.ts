import { PyImport } from "./PyImport";
import { PyModuleAST } from "./PyModuleAST";

export class PythonFile {
    constructor(
        public readonly path: string,
        public readonly ast: PyModuleAST
    ) { }

    getInjectedDependencies(className: string): PyImport[] {
        return this.ast.getInjectedDependencies(className);
    }
}
