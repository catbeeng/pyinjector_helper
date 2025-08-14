import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { getConfig } from '../configLoader';
import { getWorkspaceFolder } from '../workspaceService';
import { localization } from '../localization';

export async function writeProviderModuleToFile(
    moduleFileName: string,
    content: string
): Promise<void> {
    const outputDir = await resolveOutputDirectory();
    const workspaceFolder = getWorkspaceFolder();

    const fullPath = path.join(workspaceFolder.uri.fsPath, outputDir, `${moduleFileName}.py`);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, { encoding: 'utf8' });

    vscode.window.showInformationMessage(localization.outputModuleFile(path.basename(fullPath), fullPath));
}



async function resolveOutputDirectory(): Promise<string> {
    const config = vscode.workspace.getConfiguration();
    const extraPaths: string[] = config.get('python.analysis.extraPaths') ?? [];
    const outputDir: string = getConfig().moduleDir;

    // extraPathsとの重複を優先
    const matched = extraPaths.find(p => outputDir.startsWith(normalizePath(p)));
    if (matched) {return outputDir;}

    // 複数extraPathがある場合は選択
    if (extraPaths.length > 1) {
        const selected = await vscode.window.showQuickPick(extraPaths, {
            placeHolder: localization.selectOutputBasePath(),
        });
        if (selected) {return path.join(selected, outputDir);}
    }

    return outputDir;
}

function normalizePath(p: string): string {
    return p.replace(/^(?:\.\/|workspaceFolder\/?)/, '');
}
