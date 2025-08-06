import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { PyImport } from '../../models/python/PyImport';

export async function writeProviderModuleToFile(
    interfaceImport: PyImport,
    content: string
): Promise<void> {
    const moduleFileName = deriveModuleFilename(interfaceImport) + '_module';
    const outputDir = await resolveOutputDirectory();
    const workspaceFolder = getWorkspaceFolder();
    console.log('MODULE_FILE:', moduleFileName);

    const fullPath = path.join(workspaceFolder.uri.fsPath, outputDir, `${moduleFileName}.py`);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, { encoding: 'utf8' });

    vscode.window.showInformationMessage(`モジュールファイルを出力しました: ${fullPath}`);
}

function deriveModuleFilename(interfaceImport: PyImport): string {
    const base = interfaceImport.moduleName;
    return base
        .replace(/^interface_/, '')
        .replace(/_interface$/, '');
}

function getWorkspaceFolder(): vscode.WorkspaceFolder {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
        throw new Error('ワークスペースが開かれていません');
    }
    return folders[0]; // 単一プロジェクト前提（必要なら選択UIも可）
}

async function resolveOutputDirectory(): Promise<string> {
    const config = vscode.workspace.getConfiguration();
    const extraPaths: string[] = config.get('python.analysis.extraPaths') ?? [];
    const outputDir: string = config.get('python.injectorHelper.moduleDir') ?? 'di/modules';

    // extraPathsとの重複を優先
    const matched = extraPaths.find(p => outputDir.startsWith(normalizePath(p)));
    if (matched) {return outputDir;}

    // 複数extraPathがある場合は選択
    if (extraPaths.length > 1) {
        const selected = await vscode.window.showQuickPick(extraPaths, {
            placeHolder: '出力先ベースパスを選択してください（python.analysis.extraPaths）',
        });
        if (selected) {return path.join(selected, outputDir);}
    }

    return outputDir;
}

function normalizePath(p: string): string {
    return p.replace(/^(?:\.\/|workspaceFolder\/?)/, '');
}
