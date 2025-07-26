export class PyImport {
    constructor(
        public module: string,
        public names: { name: string; asname: string | null }[]
    ) { }

    static fromObj(obj: any): PyImport {
        return new PyImport(obj.module, obj.names);
    }
}