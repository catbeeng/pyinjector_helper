import path from "path";
import * as vscode from 'vscode';

export async function resolvePythonImportPath(fsPath: string): Promise<string> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {return '';}

    const relativePath = path.relative(workspaceFolder.uri.fsPath, fsPath);
    let noExt = relativePath.replace(/\.py$/, '');

    const extraPaths = await getPythonExtraPaths();
    for (let extraPath of extraPaths) {
        if(extraPath.startsWith('./')){
            extraPath = extraPath.replace('./', '');
        }
        if (noExt.startsWith(extraPath + path.sep)) {
            noExt = noExt.slice(extraPath.length + 1);
            break;
        }
    }

    return noExt.split(path.sep).join('.');
}

async function getPythonExtraPaths(): Promise<string[]> {
    const config = vscode.workspace.getConfiguration('python');
    const analysisPaths = config.get<string[]>('analysis.extraPaths') ?? [];
    const autocompletePaths = config.get<string[]>('autoComplete.extraPaths') ?? [];
    return [...new Set([...analysisPaths, ...autocompletePaths])];
}