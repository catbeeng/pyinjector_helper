import * as vscode from 'vscode';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import { PythonFile } from '../../models/python/PythonFile';
import { PyModuleAST } from '../../models/python/PyModuleAST';
import { analyzeMultiplePython, analyzePython } from '../astParser';
import { getConfig } from '../configLoader';
import { assert, log } from 'console';

// キャッシュ構造
interface CacheEntry {
    mtime: number;
    ast: any;
}

interface CacheData {
    [filePath: string]: CacheEntry;
}

let cache: CacheData = {};
let cacheFilePath: string;

/**
 * キャッシュ初期化
 */
export function initAstCache(storagePath: string) {
    cacheFilePath = path.join(storagePath, 'ast_cache.json');
    console.log("CACHE_PATH:" + cacheFilePath);
    if (fs.existsSync(cacheFilePath)) {
        try {
            cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
        } catch {
            cache = {};
        }
    }
}

/**
 * キャッシュ保存
 */
async function saveCache() {
    assert(cacheFilePath);
    if (!fs.existsSync(path.dirname(cacheFilePath))) {
        await fsp.mkdir(path.dirname(cacheFilePath));
    }
    await fsp.writeFile(cacheFilePath, JSON.stringify(cache), { encoding: 'utf8' });
}

export async function getModuleFiles(dirPath: string): Promise<PythonFile[]> {
    const files = await getFiles(dirPath);
    const fromCache = await getPythonFilesFromCache(files);

    const toAnalyze: string[] = files.filter((f) => !fromCache.find((pf) => pf.path === f));

    // 差分取得
    const fromFile = await getPythonFilesFromFile(toAnalyze);

    return [...fromCache, ...fromFile];
}

async function getPythonFilesFromFile(files: string[]): Promise<PythonFile[]> {
    const results: PythonFile[] = [];
    if (files.length > 0) {
        const parsed = (await analyzeMultiplePython(files) as PythonFile[]);
        for (const pf of parsed) {
            const stat = await vscode.workspace.fs.stat(vscode.Uri.file(pf.path));
            cache[pf.path] = { mtime: stat.mtime, ast: pf.ast.toObj() };
            results.push(pf);
        }
        saveCache();
    }
    return results;
}

async function getPythonFilesFromCache(files: string[]): Promise<PythonFile[]> {
    const results: PythonFile[] = [];

    // キャッシュチェック
    for (const file of files) {
        const stat = await vscode.workspace.fs.stat(vscode.Uri.file(file));
        const mtime = stat.mtime;
        const cached = cache[file];

        if (cached && cached.mtime === mtime) {
            // キャッシュから復元
            const pyModule = PyModuleAST.fromObj(cached.ast);
            results.push(new PythonFile(file, pyModule));
        }
    }
    return results;
}

async function getFiles(dirPath: string): Promise<string[]> {
    // dirPathは絶対パスか、またはワークスペースルートからの相対パス
    const pattern = new vscode.RelativePattern(dirPath, '*.py');
    const files: string[] = [];
    (await (vscode.workspace.findFiles(pattern))).forEach((f) => files.push(f.fsPath));
    return files;
}