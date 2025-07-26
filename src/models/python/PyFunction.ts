import { PyArgument } from "./PyArgument";

export class PyFunction {
    constructor(
        public name: string,
        public args: PyArgument[]
    ) { }

    static fromObj(obj: any): PyFunction {
        const argObjs = obj.args.args.slice(1); // self を除外
        const args = argObjs.map((arg: any) => PyArgument.fromObj(arg));
        return new PyFunction(obj.name, args);
    }
}