import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import { extensionPath } from '../context';
import { PyModuleAST } from '../models/python/PyModuleAST';
import { PythonFile } from '../models/python/PythonFile';

const execFileAsync = promisify(execFile);

export async function analyzePythonAst(uri: vscode.Uri): Promise<PythonFile | null> {
    if (!uri || !uri.fsPath) {
        vscode.window.showWarningMessage(
            'このコマンドは .py ファイル上で右クリックから実行してください。'
        );
        return null;
    }
    const pyScriptPath = path.join(extensionPath, 'python', 'py_ast_dump.py');

    try {
        const { stdout } = await execFileAsync('python', [
            pyScriptPath,
            uri.fsPath,
        ]);

        const astJson = JSON.parse(stdout);
        vscode.window.showInformationMessage('AST取得成功！');
        const pyModule = PyModuleAST.fromJson(astJson);
        const pythonFile = new PythonFile(uri.fsPath, pyModule);
        return pythonFile;
    } catch (error) {
        console.error('AST解析エラー:', error);
        vscode.window.showErrorMessage('ASTの取得に失敗しました');
    }
    return null;
}
