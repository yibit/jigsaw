import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";
import * as http from "http";
import {getIdentifierAliases} from "../../../plugins/installer/vendor-alias-parser";
import {Change, ImportedFileMap, ImportFile, ImportType, ImportIdentifier} from "./typings";

export const builtInNodeModules = [
    'assert', 'async_hooks', 'child_process', 'cluster', 'console', 'crypto', 'dns', 'domain', 'events', 'fs',
    'http', 'http2', 'https', 'inspector', 'net', 'os', 'path', 'perf_hooks', 'punycode', 'querystring', 'readline',
    'repl', 'stream', 'string_decoder', 'timers', 'tls', 'trace_events', 'tty', 'dgram', 'url', 'util', 'v8', 'vm',
    'worker_threads', 'zlib'
];

// 运行时 `__dirname` 的值是是 app/ui-designer/build/watch/dist/build/watch/src
export const awadeRoot = normalizePath(`${__dirname}/../../../../../..`);
export const compiledRoot = normalizePath(`${awadeRoot}/build/watch/compiled`);
export const nodeModulesRoot = normalizePath(`${awadeRoot}/web/node_modules`);
export const transformedRequireName = '__origin_require_transformed_by_awade';
export const identifierAliases = getIdentifierAliases(`${awadeRoot}/web/out/vmax-studio/awade/`);
export const importsBuffer: ImportedFileMap = {};
export const version = fs.readFileSync(`${compiledRoot}/../version.txt`).toString().trim();

export const changes: Change[] = [];

export function normalizePath(file: string): string {
    return path.resolve(file).replace(/\\/g, '/');
}

export function getPath(file: string): string {
    const tmp = file.split(/\//);
    tmp.pop();
    return tmp.join('/');
}

export function getScriptSnapshot(file: string): ts.IScriptSnapshot {
    if (!fs.existsSync(file)) {
        return undefined;
    }
    let script = fs.readFileSync(file).toString();
    return ts.ScriptSnapshot.fromString(script);
}

export function reinit(): void {
    const options = {
        host: '127.0.0.1', port: 5812, path: '/rdk/service/app/ui-designer/server/reinit'
    };
    const req = http.request(options);
    req.on('error', (e) => {
        console.log('unable to reinit, detail: ', e.message);
    });
    req.end();
    console.log('Reinitializing request sent!');
}

export function toCompiledPath(source: string): string {
    return !source.startsWith(normalizePath(`${compiledRoot}/`)) ?
        source.replace(awadeRoot, compiledRoot)
            .replace(/\.ts$/, '.js')
            .replace(/\.scss$/, '.css') :
        source;
}

export function toMD5Path(file: string): string {
    return `${file}.md5`;
}

export function toImportsPath(file: string): string {
    return `${file}.import`;
}

export function checkInvolved(changed: string[], involved: ImportFile[]): boolean {
    return changed.filter(ch => involved.find(i => i.from == ch)).length > 0;
}

export function expandPackagePath(pkgPath: string, identifiers?: ImportIdentifier[]): string {
    if (pkgPath.startsWith('@awade/')) {
        // 内置模块
        return pkgPath;
    }

    if (pkgPath.startsWith('rxjs/')) {
        // expand rxjs
        if (pkgPath == 'rxjs/add/operator/mergeMap') {
            return `./node_modules/rxjs/_esm5/operator/mergeMap.js`;
        } else {
            pkgPath = pkgPath.replace('rxjs/', 'rxjs/_esm5/');
            return `./node_modules/${pkgPath}.js`;
        }
    }

    const pkgJson = `${nodeModulesRoot}/${pkgPath}/package.json`;
    let transformed, type = predictImportType(pkgPath);
    if (type == "std_node_modules" && fs.existsSync(pkgJson)) {
        const pkgInfo = require(pkgJson);
        const index = pkgInfo.module || pkgInfo.main || 'index.js';
        let transformedPath;
        if (index) {
            transformedPath = `${nodeModulesRoot}/${pkgPath}/${index}`;
        } else if (identifiers && identifiers.length > 0) {
            // 类似uuid这样的奇葩
            transformedPath = `${nodeModulesRoot}/${pkgPath}/${identifiers[0].alias}.js`;
            if (!fs.existsSync(transformedPath)) {
                throw new Error("Error: invalid required node_modules: " + pkgPath);
            }
        } else {
            throw new Error("Error: invalid required node_modules: " + pkgPath);
        }
        transformed = normalizePath(transformedPath).substring(nodeModulesRoot.length + 1);
    } else {
        // non_std_node_modules
        transformed = normalizePath(`${nodeModulesRoot}/${pkgPath}.js`)
            .substring(nodeModulesRoot.length + 1);
    }
    return './node_modules/' + transformed;
}

function expandRxjs(pkgPath: string): string {
    return `./node_modules/${pkgPath}.js`;
}

export function predictImportType(from: string): ImportType {
    let type: ImportType;
    // compile.ts中会送带有绝对路径的文件过来检测
    if (from.match(/\.?\.\//) || from.startsWith(compiledRoot)) {
        type = 'source';
    } else if (builtInNodeModules.indexOf(from) != -1) {
        type = "node_built_in";
    } else if (fs.existsSync(`${nodeModulesRoot}/${from}.js`)) {
        type = "non_std_node_modules";
    } else {
        type = "std_node_modules";
    }
    return type;
}

export function isTypescriptSource(file: string): boolean {
    return !!file.match(/.+\.ts$/i);
}
