import * as nls from 'vscode-nls';

const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

localize("key", "default");

export const localization = {
    failedAstParse: ()=>{return localize("failedAstParse", "Failed to analyze using Python AST.");},
    outputInjectorInitializer: (path: string, fullPath: string)=>{return localize("outputInjectorInitializer", "Injector initialization code has been generated: {0}({1})", path, fullPath);},
    outputModuleFile: (path: string, fullPath: string)=>{return localize("outputModuleFile", "Module code has been generated: {0}({1})", path, fullPath);},
    selectOutputBasePath: ()=>{return localize("selectOutputBasePath", "Please select the base output path (python.analysis.extraPaths).");},
    selectClass: ()=>{return localize("selectClass", "Please select a class.");},
    selectInterface: ()=>{return localize("selectInterface", "Please select an interface.");},
};