import { PyClass } from "./PyClass";
import { PyImport } from "./PyImport";

export class PyModuleAST {
    constructor(
        public imports: PyImport[],
        public classes: PyClass[]
    ) { }

    static fromJson(astJson: any): PyModuleAST {
        const imports = astJson.body
            .filter((x: any) => x.module)
            .map((x: any) => PyImport.fromObj(x));

        const classes = astJson.body
            .filter((x: any) => x.name && x.body)
            .map((x: any) => PyClass.fromObj(x));

        return new PyModuleAST(imports, classes);
    }
}
