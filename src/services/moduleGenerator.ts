
import { PyClass } from '../models/python/PyClass';
import { PyImport } from '../models/python/PyImport';
import { generateDependencyImports, generateParameters, generateParametersWithType } from './templateHelpers';

export function generateProviderModule(
    pyClass: PyClass,
    imports: PyImport[],
    interfaceName: string | null
): string {
    const target = pyClass.name;
    const targetInterface = interfaceName ?? target;
    const moduleName = (interfaceName ?? target).replace(/Interface$/, '');

    const dependenciesImports = generateDependencyImports(imports);

    const constructorArgs = pyClass.getConstructorArgs();
    const parametersWithType = generateParametersWithType(constructorArgs);
    const parameters = generateParameters(constructorArgs);

    const template = `
from injector import provider, singleton, Module
${dependenciesImports}


class ${moduleName}Module(Module):
    @singleton
    @provider
    def provide(${parametersWithType}) -> ${targetInterface}:
        return ${target}(${parameters})
`.trim();

    return template;
}
