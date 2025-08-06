import * as vscode from 'vscode';
import { ModuleGenerator } from "../../models/python/generateModule/ModuleGenerator";
import { analyzePythonAst } from "../astParser";
import { generateImport, getInterfaceImport } from "./importsExtractor";
import { selectTargetInterface } from "./interfaceSelector";
import { selectTargetClass } from "./targetClassSelector";

export async function createModuleGenerator(uri: vscode.Uri) {
    const pythonFile = await analyzePythonAst(uri);
    if (!pythonFile) { throw new Error('Pythonファイルの解析に失敗しました'); }
    const pyClass = await selectTargetClass(pythonFile.ast);
    if (!pyClass) { throw new Error('ターゲットクラスの選択に失敗しました'); }
    const interfaceName = await selectTargetInterface(pyClass);
    // 必要な import 情報の取得
    const imports = pythonFile.getInjectedDependencies(pyClass.name);
    const targetImport = await generateImport(pythonFile, pyClass);
    const interfaceImport = getInterfaceImport(interfaceName, pythonFile);

    const generator = new ModuleGenerator(
        pyClass,
        imports,
        interfaceName,
        targetImport,
        interfaceImport);
    return generator;
}