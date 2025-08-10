import * as vscode from 'vscode';
import { writeProviderModuleToFile } from './module/moduleFileWriter';
import { createModuleGenerator } from './module/moduleGeneratorFactory';
import { generateInjectorInitializer } from './initializer/injectorInitializerGenerator';
import { writeInjectorInitialzier } from './initializer/injectorInitializerWriter';


export async function generateInjectorCode(uri: vscode.Uri) {
    const generator = await createModuleGenerator(uri);

    const moduleSource = generator.generateSource();
    await writeProviderModuleToFile(generator.moduleFileName, moduleSource);

    const initializerSource = await generateInjectorInitializer();
    await writeInjectorInitialzier(initializerSource);
}


