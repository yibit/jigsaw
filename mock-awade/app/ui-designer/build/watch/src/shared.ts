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

export const identifierAliases = getIdentifierAliases();
export const compiledRoot = normalizePath(`${__dirname}/../compiled`);
export const awadeRoot = normalizePath(`${__dirname}/../../..`);
export const nodeModulesRoot = normalizePath(`${__dirname}/../node_modules`);

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

// transformer中对 export * from "abc" 这样的语句暂时不知道如何完美处理，这里补补漏
export function fixCompiled(rawCompiled: string): string {
    const exportDef = `
        function __export(m) {
            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }
    `;
    return rawCompiled.replace('/* insert export function here */', exportDef);
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
        source.replace(awadeRoot, compiledRoot).replace(/\.ts$/, '.js') :
        source;
}

export function toSourcePath(source: string): string {
    return source.startsWith(normalizePath(`${compiledRoot}/`)) ?
        source.replace(compiledRoot, awadeRoot).replace(/\.js$/, '.ts') :
        source;
}

export function traceInvolved(entry: string): ImportedFile[] {
    const involved: ImportedFile[] = [{from: entry, type: "source", identifiers: null}];
    // 这个for不能改成forEach之类的，involved在循环过程中会变长
    for (let i = 0; i < involved.length; i++) {
        const imported = involved[i];
        if (imported.type == 'source') {
            if (!imports[imported.from]) {
                continue;
            }
            const incoming = imports[imported.from].filter(f => !involved.find(i => i.from == f.from));
            involved.push(...incoming);
        }
    }
    return involved;
}

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
