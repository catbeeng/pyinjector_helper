import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import { extensionPath } from '../context';
import { PyModuleAST } from '../models/python/PyModuleAST';
import { PythonFile } from '../models/python/PythonFile';
import { assert } from 'console';

const execFileAsync = promisify(execFile);

export async function analyzeTargetFile(uri: vscode.Uri): Promise<PythonFile | null> {
    if (!uri || !uri.fsPath) {
        vscode.window.showWarningMessage(
            'このコマンドは .py ファイル上で右クリックから実行してください。'
        );
        return null;
    }
    const targetFilePath = uri.fsPath;

    return analyzePython(targetFilePath);
}

export async function analyzePython(targetFilePath: string): Promise<PythonFile | null> {
    const files = await analyzeMultiplePython([targetFilePath]);
    assert(files && files.length === 1);
    return (files as PythonFile[])[0]?? null;
    // const pyScriptPath = path.join(extensionPath, 'python', 'py_ast_dump.py');

    // try {
    //     const { stdout } = await execFileAsync('python', [
    //         pyScriptPath,
    //         targetFilePath,
    //     ]);

    //     const astJson = JSON.parse(stdout);
    //     const pyModule = PyModuleAST.fromJson(astJson);
    //     const pythonFile = new PythonFile(targetFilePath, pyModule);
    //     return pythonFile;
    // } catch (error) {
    //     console.error('AST解析エラー:', error);
    //     vscode.window.showErrorMessage('ASTの取得に失敗しました');
    // }
    // return null;
}

export async function analyzeMultiplePython(files: string[]): Promise<PythonFile[] | null> {
    const pyScriptPath = path.join(extensionPath, 'python', 'py_ast_dump.py');

    try {
        const { stdout } = await execFileAsync('python', [
            pyScriptPath,
            ...files
        ]);

        const results = JSON.parse(stdout); // [{ path: "...", ast: {...}}, ...]
        return results.map((r: any) => {
            const pyModule = PyModuleAST.fromAST(r.ast);
            return new PythonFile(r.path, pyModule);
        });
    } catch (error) {
        console.error('AST解析エラー:', error);
        vscode.window.showErrorMessage('ASTの取得に失敗しました');
    }
    return null;
}
