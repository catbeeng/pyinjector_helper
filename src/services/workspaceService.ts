import * as vscode from 'vscode';

export function getWorkspaceFolder(): vscode.WorkspaceFolder {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
        throw new Error('ワークスペースが開かれていません');
    }
    return folders[0]; // 単一プロジェクト前提（必要なら選択UIも可）
}