// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { analyzePythonAst } from './services/astParser';
import { setExtensionPath } from './context';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	setExtensionPath(context);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand(
		'pyinjector-helper.createInjectorModule',
		async (uri: vscode.Uri) => {
			if (!uri || !uri.fsPath) {
				vscode.window.showWarningMessage(
					'このコマンドは .py ファイル上で右クリックから実行してください。'
				);
				return;
			}
			console.log('Received URI:'+ uri);
			vscode.window.showInformationMessage(
				`Injector Module を生成します: ${uri.fsPath}`
			);

			// 今後の処理：ここでテンプレート生成などを行う
			await analyzePythonAst(uri);
		}
	);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
