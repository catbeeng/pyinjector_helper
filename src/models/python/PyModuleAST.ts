import { PyArgument } from "./PyArgument";
import { PyClass } from "./PyClass";
import { PyImport } from "./PyImport";

export class PyModuleAST {
    constructor(
        public readonly imports: Map<string, PyImport>,
        public readonly classes: Map<string, PyClass>
    ) { }

    static fromJson(astJson: any): PyModuleAST {
        const imports = new Map<string, PyImport>();
        console.log('AST_BODY', astJson.body);
        for (const item of astJson.body) {
            if (!item.module || !Array.isArray(item.names)) { continue; }
            const pyImport = PyImport.fromObj(item);
            for (const nameObj of item.names) {
                // nameObj.name をキーに PyImport をマップに登録
                imports.set(nameObj.name, pyImport);
            }
        }

        const classes = astJson.body
            .filter((x: any) => x.name && x.body)
            .map((x: any) => [x.name, PyClass.fromObj(x)]);

        return new PyModuleAST(imports, new Map(classes));
    }

    getInjectedDependencies(className: string): PyImport[] {
        const pyClass = this.classes.get(className);
        if (!pyClass) {
            throw new Error(`Class ${className} not found in module AST`);
        }
        const constructorArgs = pyClass.getConstructorArgs();
        let imports = constructorArgs
            .map(arg => this.imports.get(arg.annotation || ''));
        return imports.filter((imp): imp is PyImport => !!imp);
    }

}
