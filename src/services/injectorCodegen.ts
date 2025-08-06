import * as vscode from 'vscode';
import { writeProviderModuleToFile } from './module/moduleFileWriter';
import { createModuleGenerator } from './module/moduleGeneratorFactory';


export async function generateInjectorCode(uri: vscode.Uri) {
    const generator = await createModuleGenerator(uri);

    const moduleSource = generator.generateSource();
    console.log('生成されたモジュールソース:', moduleSource);
    await writeProviderModuleToFile(generator.existInterfaceImport, moduleSource);


}


