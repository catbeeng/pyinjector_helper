import { PyFunction } from "./PyFunction";

export class PyClass {
    constructor(
        public name: string,
        public functions: PyFunction[]
    ) { }

    static fromObj(obj: any): PyClass {
        const methods = obj.body
            .filter((e: any) => e.name)
            .map((f: any) => PyFunction.fromObj(f));
        return new PyClass(obj.name, methods);
    }

    getConstructor(): PyFunction | null {
        return this.functions.find(f => f.name === '__init__') ?? null;
    }
}
