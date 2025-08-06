export class PyImport {
    constructor(
        public module: string,
        public names: { name: string; asname: string | null }[]
    ) { }

    public get moduleName(): string {
        return this.module.split('.').at(-1) ?? '';
    }

    static fromObj(obj: any): PyImport {
        return new PyImport(obj.module, obj.names);
    }
}