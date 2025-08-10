export class PyArgument {
    constructor(
        public name: string,
        public annotation: string | null
    ) { }

    public toObj() {
        return { name: this.name, annotation: this.annotation };
    }

    public static fromObj(obj: any): PyArgument {
        return new PyArgument(obj.name, obj.annotation);
    }

    public static fromAST(obj: any): PyArgument {
        return new PyArgument(
            obj.arg,
            obj.annotation?.id ?? null  // 型アノテーション名
        );
    }
}