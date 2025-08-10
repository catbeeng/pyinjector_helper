import { PyArgument } from "./PyArgument";
import { PyFunction } from "./PyFunction";

export class PyClass {
    constructor(
        public readonly name: string,
        public readonly bases: string[],
        public readonly functions: Map<string, PyFunction>
    ) { }

    public getConstructor(): PyFunction | null {
        return this.functions.get('__init__') ?? null;
    }

    public getConstructorArgs(): PyArgument[] {
        const constructor = this.getConstructor();
        if (!constructor) { return []; }
        return constructor.args;
    }

    public toObj() {
        const functions: Record<string, any> = {};
        this.functions.forEach((f, k) => functions[k] = f.toObj());
        return { name: this.name, bases: this.bases, functions: functions };
    }

    public static fromObj(obj: any) {
        const functions: Map<string, PyFunction> = new Map<string, PyFunction>();
        Object.entries(obj.functions).forEach(([k, f]) => functions.set(k, PyFunction.fromObj(f)));
        return new PyClass(obj.name, obj.bases, functions);
    }

    public static fromAST(obj: any): PyClass {
        const methods = obj.body
            .filter((e: any) => e.name)
            .map((f: any) => [f.name, PyFunction.fromAST(f)] as [string, PyFunction]);
        const functions = new Map<string, PyFunction>(methods);
        const bases = obj.bases.map((b: any) => b.id);
        const c = new PyClass(obj.name, bases, functions);
        return c;
    }

}
