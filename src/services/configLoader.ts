import * as vscode from 'vscode';

export interface ExtensionFileNameConfig {
    remove: string[];
    addPrefix: string;
    addSuffix: string;
}

export interface ExtensionClassNameConfig {
    deriveFromFileName: boolean;
    remove: string[];
    addPrefix: string;
    addSuffix: string;
}

interface ExtensionConfig {
    moduleDir: string;
    initializerPath: string;
    fileName: ExtensionFileNameConfig;
    className: ExtensionClassNameConfig;
}

class ConfigManager {
    private static instance: ConfigManager;
    private config: ExtensionConfig;

    private constructor() {
        this.config = this.loadConfig();

        // 設定変更を監視
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('pyInjectorHelper')) {
                this.config = this.loadConfig();
            }
        });
    }

    static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    getConfig(): ExtensionConfig {
        return this.config;
    }

    private loadConfig(): ExtensionConfig {
        const config = vscode.workspace.getConfiguration('pyInjectorHelper');
        return {
            moduleDir: config.get<string>('moduleDir', 'src/di/modules'),
            initializerPath: config.get<string>('initializerPath', 'src/di/injector_initializer.py'),
            fileName: {
                remove: config.get<string[]>('fileName.remove', ['^interface_', '_interface$']),
                addPrefix: config.get<string>('fileName.addPrefix', ''),
                addSuffix: config.get<string>('fileName.addSuffix', '_module')
            },
            className: {
                remove: config.get<string[]>('className.remove', ['^Interface', '^interface_', '_interface$', 'Interface$']),
                addPrefix: config.get<string>('className.addPrefix', ''),
                addSuffix: config.get<string>('className.addSuffix', 'Module'),
                deriveFromFileName: config.get<boolean>('className.deriveFromFileName', true)
            }
        };
    }
}

export function getConfig(): ExtensionConfig {
    return ConfigManager.getInstance().getConfig();
}