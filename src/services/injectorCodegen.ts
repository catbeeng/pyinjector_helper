import * as vscode from 'vscode';
import { analyzePythonAst } from './astParser';
import { selectTargetClass } from './targetClassSelector';
import { extractImports } from './importsExtractor';
import { selectTargetInterface } from './interfaceSelector';
import { generateProviderModule } from './moduleGenerator';
export async function generateInjectorCode(uri: vscode.Uri) {
    const pythonFile = await analyzePythonAst(uri);
    if (!pythonFile) { throw new Error('Pythonファイルの解析に失敗しました'); }
    const pyClass = await selectTargetClass(pythonFile.ast);
    if (!pyClass) { throw new Error('ターゲットクラスの選択に失敗しました'); }
    const interfaceName = await selectTargetInterface(pyClass);
    // 必要な import 情報の取得
    const imports = await extractImports(pythonFile, pyClass, interfaceName);
    
    const moduleSource = generateProviderModule(pyClass, imports, interfaceName);
    console.log('生成されたモジュールソース:', moduleSource);

    


    // from injector import provider, singleton, Module
    // {{__DEPENDENCIES_IMPORTS__}}

    // class {{__TARGET__}}Module(Module):
    //     @singleton
    //     @provider
    //     def provide({{__PARAMETERS_WITH_TYPE__}}) -> {{__TARGET_INTERFACE__}}:
    //         return {{__TARGET__}}({{__PARAMETERS__}})
}