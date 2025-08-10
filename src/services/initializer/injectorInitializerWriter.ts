import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { getConfig } from '../configLoader';
import { getWorkspaceFolder } from '../workspaceService';

export async function writeInjectorInitialzier(content: string): Promise<void> {
    const outputPath = await resolveOutputPath();
    const workspaceFolder = getWorkspaceFolder();

    const fullPath = path.join(workspaceFolder.uri.fsPath, outputPath);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, { encoding: 'utf8' });

    vscode.window.showInformationMessage(`Injector 初期化ファイルを出力しました: ${fullPath}`);
}

async function resolveOutputPath(): Promise<string> {
    const config = vscode.workspace.getConfiguration();
    const extraPaths: string[] = config.get('python.analysis.extraPaths') ?? [];
    const outputPath: string = getConfig().initializerPath;

    // extraPathsとの重複を優先
    const matched = extraPaths.find(p => outputPath.startsWith(normalizePath(p)));
    if (matched) {return outputPath;}

    // 複数extraPathがある場合は選択
    if (extraPaths.length > 1) {
        const selected = await vscode.window.showQuickPick(extraPaths, {
            placeHolder: '出力先ベースパスを選択してください（python.analysis.extraPaths）',
        });
        if (selected) {return path.join(selected, outputPath);}
    }

    return outputPath;
}

function normalizePath(p: string): string {
    return p.replace(/^(?:\.\/|workspaceFolder\/?)/, '');
}