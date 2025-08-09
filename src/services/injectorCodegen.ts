import * as vscode from 'vscode';
import { writeProviderModuleToFile } from './module/moduleFileWriter';
import { createModuleGenerator } from './module/moduleGeneratorFactory';
import { getConfig } from './configLoader';
import { generateInjectorInitializer } from './initializer/injectorInitializerGenerator';


export async function generateInjectorCode(uri: vscode.Uri) {
    const generator = await createModuleGenerator(uri);

    const moduleSource = generator.generateSource();
    await writeProviderModuleToFile(generator.moduleFileName, moduleSource);

    const initializerSource = await generateInjectorInitializer();
    console.log("INITIALIZER:" + initializerSource);

}


