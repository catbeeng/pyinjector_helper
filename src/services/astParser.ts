import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import { extensionPath } from '../context';
import { PyModuleAST } from '../models/python/PyModuleAST';

const execFileAsync = promisify(execFile);

export async function analyzePythonAst(uri: vscode.Uri) {
    const pyScriptPath = path.join(extensionPath, 'python', 'py_ast_dump.py');

    try {
        const { stdout } = await execFileAsync('python', [
            pyScriptPath,
            uri.fsPath,
        ]);

        const astJson = JSON.parse(stdout);
        console.log('AST JSON:', astJson);
        vscode.window.showInformationMessage('AST取得成功！');
        const pythonFile = PyModuleAST.fromJson(astJson);
        console.log('PARSED PYTHON:', pythonFile);

        // 必要ならここでClassDefなどを探索
    } catch (error) {
        console.error('AST解析エラー:', error);
        vscode.window.showErrorMessage('ASTの取得に失敗しました');
    }
}
