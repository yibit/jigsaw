import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";
import * as http from "http";
import {getIdentifierAliases} from "../../../plugins/installer/vendor-alias-parser";
import {Change, ImportedFile, ImportedFileMap} from "./typings";

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
export const identifierAliases = getIdentifierAliases(`${awadeRoot}/web/out/vmax-studio/awade/`);

export const changes: Change[] = [];
export const imports: ImportedFileMap = initImports();

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
        source.replace(awadeRoot, compiledRoot).replace(/\.ts$/, '.js').replace(/\.scss$/, '.css') :
        source;
}

// export function toSourcePath(source: string): string {
//     return source.startsWith(normalizePath(`${compiledRoot}/`)) ?
//         source.replace(compiledRoot, awadeRoot).replace(/\.js$/, '.ts').replace(/\.scss$/, '.css') :
//         source;
// }

export function checkInvolved(changed: string[], involved: ImportedFile[]): boolean {
    return changed.filter(ch => involved.find(i => i.from == ch)).length > 0;
}

export function initImports(): ImportedFileMap {
    const importsPath = './compiled/imports.json';
    return fs.existsSync(importsPath) ? JSON.parse(fs.readFileSync(importsPath).toString()) : {};
}

export function saveImports(): void {
    const importsPath = './compiled/imports.json';
    fs.writeFileSync(importsPath, JSON.stringify(imports));
}

export function expandPackagePath(pkg: string): string {
    const pkgJson = `${nodeModulesRoot}/${pkg}/package.json`;
    let transformed;
    if (fs.existsSync(pkgJson)) {
        // std_node_modules
        const pkgInfo = require(pkgJson);
        if (!pkgInfo.module) {
            throw new Error("Error: invalid required node_modules: " + pkg);
        }
        transformed = normalizePath(`${nodeModulesRoot}/${pkg}/${pkgInfo.module}`)
            .substring(nodeModulesRoot.length + 1);
    } else {
        // non_std_node_modules
        transformed = normalizePath(`${nodeModulesRoot}/${pkg}.js`)
            .substring(nodeModulesRoot.length + 1);
    }
    return './node_modules/' + transformed;
}
