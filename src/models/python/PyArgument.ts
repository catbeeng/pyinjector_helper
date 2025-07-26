export class PyArgument {
    constructor(
        public name: string,
        public annotation: string | null
    ) { }

    static fromObj(obj: any): PyArgument {
        return new PyArgument(
            obj.arg,
            obj.annotation?.id ?? null  // 型アノテーション名
        );
    }
}