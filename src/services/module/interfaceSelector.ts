import { PyClass } from '../../models/python/PyClass';
import { localization } from '../localization';

export async function selectTargetInterface(pyClass: PyClass): Promise<string | null> {
    const baseNames = pyClass.bases;
    if (baseNames.length === 0) {
        return null;
    } else if (baseNames.length === 1) {
        return baseNames[0]!;
    } else {
        const selected = await promptInterfaceSelection(baseNames);
        return selected ?? null;
    }
}
async function promptInterfaceSelection(baseNames: string[]): Promise<string | undefined> {
    // VSCodeの選択UI（QuickPick）を使う場合:
    const vscode = await import('vscode');
    return await vscode.window.showQuickPick(baseNames, {
        placeHolder: localization.selectInterface(),
        canPickMany: false
    });
}