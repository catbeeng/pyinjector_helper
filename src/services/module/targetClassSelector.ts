import { PyClass } from "../../models/python/PyClass";
import { PyModuleAST } from "../../models/python/PyModuleAST";

export async function selectTargetClass(pyModule: PyModuleAST): Promise<PyClass | null> {
    const classNames = [...pyModule.classes.keys()];
    if (classNames.length === 0) {
        return null;
    } else if (classNames.length === 1) {
        return pyModule.classes.get(classNames[0])!;
    } else {
        const selected = await promptClassSelection(classNames);
        return selected ? pyModule.classes.get(selected) ?? null : null;
    }
}

async function promptClassSelection(classNames: string[]): Promise<string | undefined> {
    // VSCodeの選択UI（QuickPick）を使う場合:
    const vscode = await import('vscode');
    return await vscode.window.showQuickPick(classNames, {
        placeHolder: 'クラスを選択してください',
        canPickMany: false
    });
}