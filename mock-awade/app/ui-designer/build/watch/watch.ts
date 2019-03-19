import * as fs from "fs";
import * as ts from "typescript";
import * as chokidar from "chokidar";
import * as path from "path";
import * as MD5 from "md5.js";
import * as http from "http";
import {sync as mkdir} from "mkdirp";
import {getIdentifierAliases} from "../../plugins/installer/vendor-alias-parser";

type ImportFromType = "source" | "std_node_modules" | "non_std_node_modules" | "node_built_in";
type ImportedFile = { from: string, identifiers: string[], type: ImportFromType };
type ImportedFileMap = { [path: string]: ImportedFile[] };
type CtorParam = { name: string, type: string, from: string };
type ClassCtorParams = { [className: string]: CtorParam[] };
type CtorParamsMap = { [path: string]: ClassCtorParams[] };
type ChangeEvent = 'add' | 'change' | 'unlink' | 'ref';
type Change = { compiled?: string, path: string, event: ChangeEvent };

const identifierAliases = getIdentifierAliases();
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
const ctorParamMap: CtorParamsMap = {};

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

    function transformPackagePath(pkg: string): string {
        const pkgJson = `${__dirname}/node_modules/${pkg}/package.json`;
        let transformed;
        if (fs.existsSync(pkgJson)) {
            // std_node_modules
            const pkgInfo = require(pkgJson);
            if (!pkgInfo.module) {
                throw new Error("Error: invalid required node_modules: " + pkg);
            }
            transformed = normalizePath(`./node_modules/${pkg}/${pkgInfo.module}`).substring(__dirname.length + 1);
        } else {
            // non_std_node_modules
            transformed = normalizePath(`./node_modules/${pkg}.js`).substring(__dirname.length + 1);
        }
        return './' + transformed;
    }

    const processed = involved
        .map(module => {
            if (module.type != 'source') {
                return undefined;
            }
            const content = fs.readFileSync(module.from).toString()
                .replace(/\brequire\("(.*)"\);/g, (found, pkg) => {
                    if (involved.find(i => (i.type == 'std_node_modules' || i.type == 'non_std_node_modules') && i.from == pkg)) {
                        return `require("${transformPackagePath(pkg)}");`;
                    } else {
                        return found;
                    }
                });
            return {content, from: module.from};
        })
        .filter(module => !!module);

    // 处理别名的问题
    let aliasRollBack = 'let _tmpModule;\n';
    involved.filter(i => i.type == 'std_node_modules' || i.type == 'non_std_node_modules').forEach(importInfo => {
        const pkg = transformPackagePath(importInfo.from);
        const aliases = identifierAliases[pkg];
        if (!aliases) {
            console.warn('no alias info found:', pkg);
            return;
        }
        aliasRollBack += `_tmpModule = require("${pkg}");\n`;
        aliases.forEach(a => {
            if (a.identifier.match(/^\w+$/)) {
                aliasRollBack += `_tmpModule.${a.identifier} = _tmpModule.${a.alias};\n`;
            }
        });
        aliasRollBack += '\n';
    });

    const outFile = normalizePath(`${rootPath}/web/out/vmax-studio/awade/main.bundle.js`);
    console.log(`Creating bundle ${outFile} ...`);
    let out = '';
    processed.forEach(module => {
        out += `/***/ "${module.from}":\n`;
        out += '/***/ (function(module, exports, require) {\n';
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
/***/ (function(module, exports, require) {

${aliasRollBack}
module.exports = require("${entryFile}");


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

    console.log(JSON.stringify(ctorParamMap, null, '  '));

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

// 调试这个东西，一定要配合这个网站 https://ts-ast-viewer.com/
function transformer<T extends ts.Node>(file: string): ts.TransformerFactory<any> {
    const curPath = getPath(file), compiledPath = toCompiledPath(file);
    const importedFiles: ImportedFile[] = [];
    imports[compiledPath] = importedFiles;
    const classes: ClassCtorParams[] = [];
    ctorParamMap[compiledPath] = classes;


    return (context): any => {
        const visit: ts.Visitor = (node: ts.Node) => {
            // 有的非标准的import语法：import "xxxx"; 要过滤掉
            if (ts.isImportDeclaration(node) && node.getChildCount() >= 4) {
                const clauseNode = node.getChildAt(1).getChildAt(0);
                let identifiers: string[];
                if (clauseNode.kind == ts.SyntaxKind.NamedImports) {
                    // import {ClassA, ClassB} from "fdfdfd"; 的方式
                    identifiers = clauseNode.getChildAt(1).getText().split(/\s*,\s*/);
                } else {
                    // import * as ts from "fdfdf"; 的方式
                    identifiers = [clauseNode.getChildAt(2).getText()];
                }

                let type, from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
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
                importedFiles.push({from, type, identifiers});
                node = ts.updateImportDeclaration(node, undefined, undefined,
                    ts.createImportClause(
                        undefined,
                        ts.createNamedImports(
                            [ts.createImportSpecifier(undefined, undefined)])
                    ),
                    // 目的是为了更新这个
                    ts.createLiteral(from));
            } else if (ts.isExportDeclaration(node)) {
                let from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
                from = normalizePath(path.resolve(curPath, from + '.ts'));
                from = toCompiledPath(from);
                importedFiles.push({from, type: "source", identifiers: []});

                // @todo 下面这个写法要的ts的更新版本才能生效
                // node = ts.updateExportDeclaration(node, undefined, undefined, undefined, ts.createLiteral(from));

                // 这里return新的node后，语法树解析就有问题了，所以，只打上标记，再做二次处理
                // 注意 /* insert export function here */ 这里个标志到时候会有多处，但是只替换一次就好
                node = ts.createIdentifier(`/* insert export function here */\n__export(require("${from}"));`);
            }

            // 构造函数相关
            else if (ts.isClassDeclaration(node)) {
                let ch = findChildByType(node, ts.SyntaxKind.Identifier);
                let currClass: ClassCtorParams, curParams: CtorParam[];
                curParams = [];
                currClass = {};
                currClass[ch.getText()] = curParams;
                classes.push(currClass);

                ch = findChildByType(node, ts.SyntaxKind.SyntaxList, node.getChildren().indexOf(ch));
                const ctorNode = findChildByType(ch, ts.SyntaxKind.Constructor);
                const paramList = ctorNode.getChildAt(2);
                paramList.getChildren().filter(p => p.kind == ts.SyntaxKind.Parameter).forEach(paramNode => {
                    // 最开始可能有public等修饰符，不理他
                    const name = findChildByType(paramNode, ts.SyntaxKind.Identifier).getText().trim();
                    const type = findChildByType(paramNode, ts.SyntaxKind.TypeReference).getText().trim();
                    const from = importedFiles.find(imf => imf.identifiers.indexOf(type) != -1).from;
                    curParams.push({name, from, type});
                });
            }

            else if (ts.isCallExpression(node) && node.parent && ts.isDecorator(node.parent)) {
                const propertiesNode = node.getChildAt(2).getChildAt(0).getChildAt(1);
                const properties = propertiesNode.getChildren()
                    .filter(c => c.kind == ts.SyntaxKind.PropertyAssignment)
                    .map((propNode: ts.PropertyAssignment) => {
                        const prop = propNode.getChildAt(0).getText();
                        if (prop == 'templateUrl') {
                            return ts.createPropertyAssignment(
                                ts.createIdentifier('template'),
                                ts.createCall(ts.createIdentifier('require'), undefined, [
                                    ts.createLiteral(stringLiteral2CompiledPath(propNode.getChildAt(2).getText()))
                                ])
                            )
                        } else if (prop == 'styleUrls') {
                            const arrLiterVal = propNode.getChildAt(2).getChildAt(1).getChildren()
                                .filter(c => c.kind == ts.SyntaxKind.StringLiteral)
                                .map(strLiter => stringLiteral2CompiledPath(strLiter.getText()))
                                .map(str => ts.createCall(ts.createIdentifier('require'),
                                    undefined, [ts.createLiteral(str)]));
                            return ts.createPropertyAssignment(
                                ts.createIdentifier('styles'),
                                ts.createArrayLiteral(arrLiterVal, false)
                            )
                        } else {
                            return ts.createPropertyAssignment(
                                ts.createIdentifier(prop),
                                propNode.initializer
                            )
                        }
                    });
                node = ts.updateCall(node, node.expression, undefined, [
                    ts.createObjectLiteral(properties, false),
                    ts.createCall(ts.createIdentifier('__metadata'), undefined, [
                        ts.createLiteral("design:paramtypes"),
                        ts.createArrayLiteral([], false)
                    ])
                ]);
            }
            return ts.visitEachChild(node, (child) => visit(child), context);
        };

        return (node) => ts.visitNode(node, visit);
    };

    function findChildByType(node: ts.Node, type: ts.SyntaxKind, fromIdx: number = 0): ts.Node {
        while (true) {
            const ch = node.getChildAt(fromIdx++);
            if (!ch || ch.kind == type) {
                return ch;
            }
        }
    }

    function stringLiteral2CompiledPath(value: string): string {
        value = value.replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        return toCompiledPath(normalizePath(path.resolve(curPath, value)));
    }
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
