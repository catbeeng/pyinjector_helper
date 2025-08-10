import { PyArgument } from "./PyArgument";

export class PyFunction {
    constructor(
        public readonly name: string,
        public readonly args: PyArgument[]
    ) { }

    public toObj() {
        const args: any[] = [];
        this.args.forEach((a) => args.push(a.toObj()));
        return { name: this.name, args: args };
    }

    public static fromObj(obj: any) {
        const args: PyArgument[] = [];
        obj.args.forEach((arg: any) => args.push(PyArgument.fromObj(arg)));
        return new PyFunction(obj.name, args);
    }

    public static fromAST(obj: any): PyFunction {
        const argObjs = obj.args.args.slice(1); // self を除外
        const args = argObjs.map((arg: any) => PyArgument.fromAST(arg));
        return new PyFunction(obj.name, args);
    }
}