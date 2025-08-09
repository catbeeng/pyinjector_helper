import { PyClass } from "./PyClass";
import { PyImport } from "./PyImport";
import { PyModuleAST } from "./PyModuleAST";

export class PythonFile {
    constructor(
        public readonly path: string,
        public readonly ast: PyModuleAST
    ) { }

    public get class(): PyClass {
        return this.ast.class;
    }
    
    getInjectedDependencies(className: string): PyImport[] {
        return this.ast.getInjectedDependencies(className);
    }
}
