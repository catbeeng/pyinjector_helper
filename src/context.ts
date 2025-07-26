import * as vscode from 'vscode';
export let extensionPath = '';
export function setExtensionPath(context: vscode.ExtensionContext) {
  extensionPath = context.extensionPath;
}