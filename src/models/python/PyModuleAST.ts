import { assert } from "console";
import { PyArgument } from "./PyArgument";
import { PyClass } from "./PyClass";
import { PyImport } from "./PyImport";

export class PyModuleAST {
    constructor(
        public readonly imports: Map<string, PyImport>,
        public readonly classes: Map<string, PyClass>
    ) { }

    public get class(): PyClass {
        const classNames = [...this.classes.keys()];
        assert(classNames.length === 1);
        return this.classes.get(classNames[0])!;
    }

    public getInjectedDependencies(className: string): PyImport[] {
        const pyClass = this.classes.get(className);
        if (!pyClass) {
            throw new Error(`Class ${className} not found in module AST`);
        }
        const constructorArgs = pyClass.getConstructorArgs();
        let imports = constructorArgs
            .map(arg => this.imports.get(arg.annotation || ''));
        return imports.filter((imp): imp is PyImport => !!imp);
    }

    public toObj() {
        const imports: Record<string, any> = {};
        this.imports.forEach((i, k) => imports[k] = i.toObj());
        const classes: Record<string, any> = {};
        this.classes.forEach((c, k) => classes[k] = c.toObj());
        return { imports: imports, classes: classes };
    }

    public static fromObj(obj: any) {
        const imports: Map<string, PyImport> = new Map<string, PyImport>();
        Object.entries(obj.imports).forEach(([k, i]) => imports.set(k as string, PyImport.fromObj(i)));
        const classes: Map<string, PyClass> = new Map<string, PyClass>();
        Object.entries(obj.classes).forEach(([k, c]) => classes.set(k, PyClass.fromObj(c)));
        return new PyModuleAST(imports, classes);
    }

    public static fromAST(astJson: any): PyModuleAST {
        const imports = new Map<string, PyImport>();
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
            .map((x: any) => [x.name, PyClass.fromAST(x)]);

        return new PyModuleAST(imports, new Map(classes));
    }
}
