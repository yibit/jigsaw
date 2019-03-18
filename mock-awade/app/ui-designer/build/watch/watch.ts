import * as fs from "fs";
import * as ts from "typescript";
import * as chokidar from "chokidar";
import * as path from "path";
import * as MD5 from "md5.js";
import * as http from "http";
import {sync as mkdir} from "mkdirp";

type ImportedFile = { from: string, type: "source" | "std_node_modules" | "non_std_node_modules" | "node_built_in" };
type ImportedFileMap = { [path: string]: ImportedFile[] };
type ChangeEvent = 'add' | 'change' | 'unlink' | 'ref';
type Change = { compiled?: string, path: string, event: ChangeEvent };

const builtInNodeModules = [
    'assert', 'async_hooks', 'child_process', 'cluster', 'console', 'crypto', 'dns', 'domain', 'events', 'fs',
    'http', 'http2', 'https', 'inspector', 'net', 'os', 'path', 'perf_hooks', 'punycode', 'querystring', 'readline',
    'repl', 'stream', 'string_decoder', 'timers', 'tls', 'trace_events', 'tty', 'dgram', 'url', 'util', 'v8', 'vm',
    'worker_threads', 'zlib'
];

const scriptFileNames: string[] = [];
const compiledRootPath = normalizePath(`${__dirname}/compiled`);
const rootPath = normalizePath(`${__dirname}/../..`);

const scriptVersions = new Map<string, number>();
const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => scriptFileNames,
    getScriptVersion: fileName => String(scriptVersions.get(fileName)),
    getScriptSnapshot: getScriptSnapshot,
    getCurrentDirectory: () => rootPath,
    getCompilationSettings: () => ({
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES5,
        experimentalDecorators: true
    }),
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory
};
const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

const watchingDirs = [
    '../../basics/src', '../../compiler/module/src', '../../services/src', '../../web/src', '../../sdk/src'
];
const watcher = chokidar.watch(watchingDirs, {
    ignored: /(.+\.(.*___jb_\w+___|d\.ts|spec\.ts)$)|(awade[cu]\.js)|(package(-lock)?\.json)/,
    persistent: true,
    awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
    },
});
watcher
    .on('add', path => cacheChange(path, 'add'))
    .on('change', path => cacheChange(path, 'change'))
    .on('unlink', path => cacheChange(path, 'unlink'));

let timerHandler = null;
const changes: Change[] = [];
const imports: ImportedFileMap = initImports();


function cacheChange(path: string, event: 'add' | 'change' | 'unlink'): void {
    let sign;
    if (event == 'unlink') {
        sign = '-';
    } else if (event == 'change') {
        sign = '*';
    } else {
        sign = '+';
    }
    console.log(`${sign} ): ${path}`);
    const idx = changes.findIndex(ch => ch.path == path && ch.event == event);
    if (idx != -1) {
        changes.splice(idx, 1);
    }
    path = normalizePath(path);
    changes.push({path, event});

    clearTimeout(timerHandler);
    timerHandler = setTimeout(() => {
        timerHandler = null;
        handleChanges();
    }, 300);
}

function handleChanges(): void {
    const processed = [];
    while (changes.length > 0) {
        const change = changes.shift();
        if (!change) {
            break;
        }

        updateFiles(change.path, change.event);
        console.log('Processing file', change.path);
        compileScript(change.path);
        processed.push(toCompiledPath(change.path));
    }
    saveImports();

    createServerBundle(processed,
        normalizePath(`${compiledRootPath}/services/src/exports.js`),
        normalizePath(`${rootPath}/server/dist/awade-services.js`));
    createServerBundle(processed,
        normalizePath(`${compiledRootPath}/compiler/module/src/bin/awadec.js`),
        normalizePath(`${rootPath}/compiler/module/src/bin/awadec.js`));
    createServerBundle(processed,
        normalizePath(`${compiledRootPath}/compiler/module/src/bin/awadeu.js`),
        normalizePath(`${rootPath}/compiler/module/src/bin/awadeu.js`));
    createWebMainBundle(processed);
}

function updateFiles(sourcePath: string, event: ChangeEvent): void {
    if (!sourcePath.match(/.+\.ts/i)) {
        return;
    }

    const idx = scriptFileNames.indexOf(sourcePath);
    if (event == 'unlink' && idx != -1) {
        scriptFileNames.splice(idx, 1);
        const compiledPath = toCompiledPath(sourcePath);
        if (fs.existsSync(compiledPath)) {
            fs.unlinkSync(compiledPath);
        }
    }
    if (event != 'unlink' && idx == -1) {
        scriptFileNames.push(sourcePath);
    }
    if (!scriptVersions.has(sourcePath)) {
        scriptVersions.set(sourcePath, 0);
    }
    const ver = scriptVersions.get(sourcePath);
    scriptVersions.set(sourcePath, ver == undefined || ver == null ? 0 : ver + 1);
}

function createServerBundle(changedFiles: string[], entryFile: string, outFile: string): void {
    const involved = traceInvolved(entryFile);
    if (!checkInvolved(changedFiles, involved)) {
        return;
    }

    const isCreatingServices = entryFile.indexOf('services/src/exports.js') != -1;
    const logFile = `${normalizePath(__dirname)}/compiled/services/src/utils/log.js`;
    const consoleDef = `var console = __webpack_require__("${logFile}");`;
    // 编译好的块需要根据当前输出目标做一些具体化的处理
    const processed = involved.map(module => {
        const result = {content: '', from: module.from};
        if (module.type == "std_node_modules") {
            const pkgJson = `${__dirname}/node_modules/${module.from}/package.json`;
            if (isCreatingServices) {
                const pkgInfo = require(pkgJson);
                if (!pkgInfo.main) {
                    throw new Error("Error: invalid required node_modules: " + module.from);
                }
                result.content = fs.readFileSync(`${__dirname}/node_modules/${module.from}/${pkgInfo.main}`).toString();
            } else {
                result.content = `module.exports = require("${module.from}");`;
            }
        } else if (module.type == 'non_std_node_modules') {
            throw new Error('non_std_node_modules in services: fix me!');
        } else if (module.type == 'source') {
            result.content = fs.readFileSync(module.from).toString();
            if (isCreatingServices && result.content.indexOf(consoleDef) == -1 && logFile != module.from) {
                result.content = `${consoleDef}\n${result.content}`;
            }
        }
        return result;
    });

    console.log(`Creating bundle ${outFile} ...`);
    let out = '';
    processed.forEach(module => {
        out += `/***/ "${module.from}":\n`;
        out += '/***/ (function(module, exports, __webpack_require__) {\n';
        out += module.content + '\n';
        out += '/***/ }),\n\n';
    });

    out = `
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "${entryFile}");
/******/ })
/************************************************************************/
/******/ ({

${out}

/******/ });
    `;
    if (!isCreatingServices) {
        // creating awadec / awadeu
        out = 'module.exports=\n' + out;
    }
    mkdir(getPath(outFile));
    fs.writeFileSync(outFile, out);

    if (isCreatingServices) {
        reinit();
    }
}

function createWebMainBundle(changedFiles: string[]): void {
    const entryFile = normalizePath(`${compiledRootPath}/web/src/main.js`);
    const involved = traceInvolved(entryFile);
    if (!checkInvolved(changedFiles, involved)) {
        return;
    }

    const processed = involved
        .map(module => {
            if (module.type != 'source') {
                return undefined;
            }
            const content = fs.readFileSync(module.from).toString()
                .replace(/\b__webpack_require__\("(.*)"\);/g, (found, pkg) => {
                    if (involved.find(i => (i.type == 'std_node_modules' || i.type == 'non_std_node_modules') && i.from == pkg)) {
                        const pkgJson = `${__dirname}/node_modules/${pkg}/package.json`;
                        if (fs.existsSync(pkgJson)) {
                            // std_node_modules
                            const pkgInfo = require(pkgJson);
                            if (!pkgInfo.module) {
                                throw new Error("Error: invalid required node_modules: " + pkg);
                            }
                            const p = normalizePath(`./node_modules/${pkg}/${pkgInfo.module}`).substring(__dirname.length + 1);
                            return `__webpack_require__("./${p}");`;
                        } else {
                            // non_std_node_modules
                            const p = normalizePath(`./node_modules/${pkg}.js`).substring(__dirname.length + 1);
                            return `__webpack_require__("./${p}");`;
                        }
                    } else {
                        return found;
                    }
                });
            return {content, from: module.from};
        })
        .filter(module => !!module);

    const outFile = normalizePath(`${rootPath}/web/out/vmax-studio/awade/main.bundle.js`);
    console.log(`Creating bundle ${outFile} ...`);
    let out = '';
    processed.forEach(module => {
        out += `/***/ "${module.from}":\n`;
        out += '/***/ (function(module, exports, __webpack_require__) {\n';
        out += module.content + '\n';
        out += '/***/ }),\n\n';
    });

    out = `
webpackJsonp(["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
    // Here Promise.resolve().then() is used instead of new Promise() to prevent
    // uncatched exception popping up in devtools
    return Promise.resolve().then(function() {
        throw new Error("Cannot find module '" + req + "'.");
    });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

${out}


/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("${entryFile}");


/***/ })

},[0]);
    `;

    mkdir(getPath(outFile));
    fs.writeFileSync(outFile, out);
}

function normalizePath(file: string): string {
    return path.resolve(file).replace(/\\/g, '/');
}

function getPath(file: string): string {
    const tmp = file.split(/\//);
    tmp.pop();
    return tmp.join('/');
}

function compileScript(file: string): string {
    if (!file.match(/.+\.ts$/) || !fs.existsSync(file)) {
        return '';
    }

    const compiledPath = toCompiledPath(file);
    let fingerPrint, md5Path = compiledPath.replace(/\.js$/, '.md5');
    if (fs.existsSync(md5Path)) {
        fingerPrint = fs.readFileSync(md5Path).toString();
    }
    const source = fs.readFileSync(file);
    const curMD5 = new MD5().update(source).digest('hex');
    if (curMD5 == fingerPrint) {
        return fs.readFileSync(compiledPath).toString();
    }

    console.log('Compiling...');
    logErrors(file);
    servicesHost.getCustomTransformers = () => ({before: [transformer(file)]});
    let output = services.getEmitOutput(file).outputFiles[0].text;
    output = fixCompiled(output);
    mkdir(getPath(compiledPath));
    fs.writeFileSync(compiledPath, output);
    fs.writeFileSync(md5Path, curMD5);
    console.log('Compiled!');

    return output;
}

// transformer中对 export * from "abc" 这样的语句暂时不知道如何完美处理，这里补补漏
function fixCompiled(rawCompiled: string): string {
    const exportDef = `
        function __export(m) {
            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }
    `;
    return rawCompiled.replace('/* insert export function here */', exportDef);
}

function transformer<T extends ts.Node>(file: string): ts.TransformerFactory<any> {
    const curPath = getPath(file);
    const importedFiles = [];
    imports[toCompiledPath(file)] = importedFiles;

    return (context): any => {
        const visit: ts.Visitor = (node: ts.Node) => {
            if (ts.isImportDeclaration(node) && node.getChildCount() >= 4) {
                let from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
                const tmp = from.split(/\//);

                let name, child = node.getChildAt(1).getChildAt(0);
                if (child.kind == ts.SyntaxKind.NamespaceImport) {
                    name = child.getChildAt(2).getText();
                } else {
                    // @todo 这里存在重名的风险，如果有人故意起一个类似 var aa_1 这样的名字就会重名
                    name = tmp[tmp.length - 1].replace(/\W/g, '_') + '_1';
                }

                let type;
                if (fs.existsSync(`${__dirname}/node_modules/${from}/package.json`)) {
                    type = "std_node_modules";
                } else if (fs.existsSync(`${__dirname}/node_modules/${from}.js`)) {
                    type = "non_std_node_modules";
                } else if (builtInNodeModules.indexOf(from) != -1) {
                    type = "node_built_in";
                } else {
                    type = 'source';
                }
                if (type == 'source') {
                    from = normalizePath(path.resolve(curPath, from + '.ts'));
                    from = toCompiledPath(from);
                }
                importedFiles.push({from, type});

                node = ts.createIdentifier(`var ${name} = __webpack_require__("${from}");`);
            } else if (ts.isExportDeclaration(node)) {
                let from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
                from = normalizePath(path.resolve(curPath, from + '.ts'));
                from = toCompiledPath(from);
                importedFiles.push({from, type: "source"});

                // @todo 以下语句在ts v3.3 才能工作，当前版本是2.4
                // node = ts.createExportDeclaration(
                //     undefined,
                //     undefined,
                //     undefined,
                //     ts.createLiteral(from)
                // );
                // 先用龌龊的方式解决这个问题吧
                // 注意 /* insert export function here */ 这里个标志到时候会有多处，但是只替换一次就好
                node = ts.createIdentifier(`/* insert export function here */\n__export(__webpack_require__("${from}"));`);
            }
            return ts.visitEachChild(node, (child) => visit(child), context);
        };

        return (node) => ts.visitNode(node, visit);
    };
}

function logErrors(fileName: string): void {
    let allDiagnostics = services
        .getCompilerOptionsDiagnostics()
        .concat(services.getSyntacticDiagnostics(fileName))
        .concat(services.getSemanticDiagnostics(fileName));

    allDiagnostics.forEach(diagnostic => {
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        if (diagnostic.file) {
            let {line, character} = diagnostic.file.getLineAndCharacterOfPosition(
                diagnostic.start!
            );
            console.log(
                `  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
            );
        } else {
            console.log(`  Error: ${message}`);
        }
    });
}

function getScriptSnapshot(file: string): ts.IScriptSnapshot {
    if (!fs.existsSync(file)) {
        return undefined;
    }
    let script = fs.readFileSync(file).toString();
    return ts.ScriptSnapshot.fromString(script);
}

function reinit(): void {
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

function toCompiledPath(source: string): string {
    return !source.startsWith(normalizePath(`${compiledRootPath}/`)) ?
        source.replace(rootPath, compiledRootPath).replace(/\.ts$/, '.js') :
        source;
}

function toSourcePath(source: string): string {
    return source.startsWith(normalizePath(`${compiledRootPath}/`)) ?
        source.replace(compiledRootPath, rootPath).replace(/\.js$/, '.ts') :
        source;
}

function traceInvolved(entry: string): ImportedFile[] {
    const involved: ImportedFile[] = [{from: entry, type: "source"}];
    // 这个for不能改成forEach之类的，involved在循环过程中会变长
    for (let i = 0; i < involved.length; i++) {
        const imported = involved[i];
        if (imported.type == 'source') {
            if (!imports[imported.from]) {
                console.log('>>', imported.from)
                continue;
            }
            const incoming = imports[imported.from].filter(f => !involved.find(i => i.from == f.from));
            involved.push(...incoming);
        }
    }
    return involved;
}

function checkInvolved(changed: string[], involved: ImportedFile[]): boolean {
    return changed.filter(ch => involved.find(i => i.from == ch)).length > 0;
}

function initImports(): ImportedFileMap {
    const importsPath = './compiled/imports.json';
    return fs.existsSync(importsPath) ? JSON.parse(fs.readFileSync(importsPath).toString()) : {};
}

function saveImports(): void {
    const importsPath = './compiled/imports.json';
    fs.writeFileSync(importsPath, JSON.stringify(imports));
}
