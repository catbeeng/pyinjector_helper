import { assert } from "console";

export class PyImport {
    constructor(
        public module: string,
        public names: { name: string; asname: string | null }[]
    ) { }

    public get name(): string {
        assert(this.names.length === 1);
        return this.names[0].name;
    }

    public get moduleName(): string {
        return this.module.split('.').at(-1) ?? '';
    }

    public toObj() {
        return { module: this.module, names: this.names };
    }

    public static fromObj(obj: any): PyImport {
        return new PyImport(obj.module, obj.names);
    }
}