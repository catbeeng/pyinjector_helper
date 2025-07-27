import { PyArgument } from "./PyArgument";
import { PyFunction } from "./PyFunction";

export class PyClass {
    constructor(
        public readonly name: string,
        public readonly bases: string[],
        public readonly functions: Map<string, PyFunction>
    ) { }

    static fromObj(obj: any): PyClass {
        const methods = obj.body
            .filter((e: any) => e.name)
            .map((f: any) => [f.name, PyFunction.fromObj(f)] as [string, PyFunction]);
        const functions = new Map<string, PyFunction>(methods);
        const bases = obj.bases.map((b: any) => b.id);
        const c = new PyClass(obj.name, bases, functions);
        return c;
    }

    getConstructor(): PyFunction | null {
        return this.functions.get('__init__') ?? null;
    }

    getConstructorArgs(): PyArgument[] {
        const constructor = this.getConstructor();
        if (!constructor) {return [];}
        return constructor.args;
    }
}
