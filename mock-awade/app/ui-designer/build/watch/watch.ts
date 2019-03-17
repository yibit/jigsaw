import * as fs from "fs";
import * as ts from "typescript";
import * as chokidar from "chokidar";
import * as path from "path";
import * as MD5 from "md5.js";
import * as http from "http";
import {sync as mkdir} from "mkdirp";


const scriptFileNames: string[] = [];
type ChangeEvent = 'add' | 'change' | 'unlink' | 'ref';
type Change = { compiled?: string, path: string, event: ChangeEvent };

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
    ignored: /(.+\.(___jb_\w+___|d\.ts|spec\.ts)$)|(awade[cu]\.js)|(package(-lock)?\.json)/,
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
const involvedServiceFiles: string[] = [];
const involvedAwadecFiles: string[] = [];
const involvedAwadeuFiles: string[] = [];
const involvedWebMainFiles: string[] = [];
type ImportBuffer = {[path: string]: { from: string, type: "source" | "node_modules" }[]}
const imports: ImportBuffer = initImports();


function cacheChange(path: string, event: 'add' | 'change' | 'unlink'): void {
    let sign;
    if (event == 'unlink') {
        sign = '-';
    } else if (event == 'change') {
        sign = '*';
    } else {
        sign = '+';
    }
    console.log(`(${sign}) : ${path}`);
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

    let involved = createServerBundle(processed, involvedServiceFiles,
        normalizePath(`${compiledRootPath}/services/src/exports.js`),
        normalizePath(`${rootPath}/server/dist/awade-services.js`));
    if (involved) {
        involvedServiceFiles.splice(0, Infinity, ...involved);
    }

    involved = createServerBundle(processed, involvedAwadecFiles,
        normalizePath(`${compiledRootPath}/compiler/module/src/bin/awadec.js`),
        normalizePath(`${rootPath}/compiler/module/src/bin/awadec.js`));
    if (involved) {
        involvedAwadecFiles.splice(0, Infinity, ...involved);
    }

    involved = createServerBundle(processed, involvedAwadeuFiles,
        normalizePath(`${compiledRootPath}/compiler/module/src/bin/awadeu.js`),
        normalizePath(`${rootPath}/compiler/module/src/bin/awadeu.js`));
    if (involved) {
        involvedAwadeuFiles.splice(0, Infinity, ...involved);
    }

    involved = createWebMainBundle(processed);
    if (involved) {
        involvedWebMainFiles.splice(0, Infinity, ...involved);
    }
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

function createServerBundle(changedFiles: string[], involvedFiles: string[], entryFile: string, outFile: string): string[] {
    if (!checkInvolved(changedFiles, involvedFiles)) {
        return null;
    }

    const isCreatingServices = entryFile.indexOf('services/src/exports.js') != -1;
    const pending: string[] = [entryFile];
    const buffer = new Map<string, string>();
    const parse = (curPath, pkg) => {
        if (buffer.has(pkg)) {
            return pkg;
        }
        const pkgJson = `${__dirname}/node_modules/${pkg}/package.json`;
        if (fs.existsSync(pkgJson)) {
            if (isCreatingServices) {
                const pkgInfo = require(pkgJson);
                if (!pkgInfo.main) {
                    throw new Error("Error: invalid required node_modules: " + pkg);
                }
                buffer.set(pkg, fs.readFileSync(`${__dirname}/node_modules/${pkg}/${pkgInfo.main}`).toString());
            } else {
                buffer.set(pkg, `module.exports = require("${pkg}");`);
            }
            return pkg;
        }

        pkg = path.resolve(curPath, pkg + '.js');
        pkg = normalizePath(pkg);
        if (buffer.has(pkg)) {
            return pkg;
        }

        if (!pending.find(p => p == pkg)) {
            pending.push(pkg);
        }
        return pkg;


        // const pkgJson = `${__dirname}/node_modules/${pkg}/package.json`;
        // if (fs.existsSync(pkgJson)) {
        //     if (!buffer.has(pkg)) {
        //         if (isCreatingServices) {
        //             const pkgInfo = require(pkgJson);
        //             if (!pkgInfo.main) {
        //                 throw new Error("Error: invalid required node_modules: " + pkg);
        //             }
        //             buffer.set(pkg, fs.readFileSync(`${__dirname}/node_modules/${pkg}/${pkgInfo.main}`).toString());
        //         } else {
        //             buffer.set(pkg, `module.exports = require("${pkg}");`);
        //         }
        //     }
        // } else {
        //     pkg = path.resolve(curPath, pkg + '.js');
        //     pkg = normalizePath(pkg);
        //     if (!pending.find(p => p == pkg) && !buffer.has(pkg)) {
        //         pending.push(pkg);
        //     }
        // }
        // return pkg;
    };
    const logFile = `${normalizePath(__dirname)}/compiled/services/src/utils/log.js`;
    const consoleDef = `var console = __webpack_require__("${logFile}");`;

    while (pending.length > 0) {
        const file = pending.shift();
        if (!fs.existsSync(file)) {
            continue;
        }

        const curPath = getPath(file);
        let compiled = fs.readFileSync(file).toString()
            .replace(/\b__export\(require\("(.*?)"\)\);/g, (found, pkg) => {
                pkg = parse(curPath, pkg);
                return `__export(__webpack_require__("${pkg}"));`;
            })
            .replace(/(var \w+) = require\("(.*?)"\);/g, (found, varDef, pkg) => {
                pkg = parse(curPath, pkg);
                return `${varDef} = __webpack_require__("${pkg}");`;
            });
        if (compiled.indexOf(consoleDef) == -1 && isCreatingServices && logFile != file) {
            // 给自动加上console的定义
            compiled = `${consoleDef}\n${compiled}`;
        }

        buffer.set(file, compiled);
    }

    console.log(`Creating bundle ${outFile} ...`);
    let out = '', involved = [];
    buffer.forEach((compiled, path) => {
        out += `/***/ "${path}":\n`;
        out += '/***/ (function(module, exports, __webpack_require__) {\n';
        out += compiled + '\n';
        out += '/***/ }),\n\n';
        involved.push(path);
    });
    buffer.clear();

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
    fs.writeFileSync(outFile, out);

    if (isCreatingServices) {
        reinit();
    }

    return involved;
}

function createWebMainBundle(changedFiles: string[]): string[] {
    if (!checkInvolved(changedFiles, involvedWebMainFiles)) {
        return null;
    }

    const entryFile = normalizePath(`${compiledRootPath}/web/src/main.js`);
    const outFile = normalizePath(`${rootPath}/web/out/vmax-studio/awade/main.bundle.js`);

    const pending: string[] = [entryFile];
    const buffer = new Map<string, string>();
    const parse = (curPath, pkg) => {
        if (buffer.has(pkg)) {
            return pkg;
        }
        const pkgJson = `${__dirname}/node_modules/${pkg}/package.json`;
        if (fs.existsSync(pkgJson)) {
            const pkgInfo = require(pkgJson);
            if (!pkgInfo.module) {
                throw new Error("Error: invalid required node_modules: " + pkg);
            }
            return `./node_modules/${pkg}/${pkgInfo.module}`;
        }

        pkg = path.resolve(curPath, pkg + '.js');
        pkg = normalizePath(pkg);
        if (buffer.has(pkg)) {
            return pkg;
        }

        if (!pending.find(p => p == pkg)) {
            pending.push(pkg);
        }
        return pkg;
    };

    while (pending.length > 0) {
        const file = pending.shift();
        if (!fs.existsSync(file)) {
            continue;
        }

        const curPath = getPath(file);
        let compiled = fs.readFileSync(file).toString()
            .replace(/(var \w+) = require\("(.*?)"\);/g, (found, varDef, pkg) => {
                pkg = parse(curPath, pkg);
                return `${varDef} = __webpack_require__("${pkg}");`;
            });

        buffer.set(file, compiled);
    }

    console.log(`Creating bundle ${outFile} ...`);
    let out = '', involved = [];
    buffer.forEach((compiled, path) => {
        out += `/***/ "${path}":\n`;
        out += '/***/ (function(module, exports, __webpack_require__) {\n';
        out += compiled + '\n';
        out += '/***/ }),\n\n';
        involved.push(path);
    });
    buffer.clear();

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

    fs.writeFileSync(outFile, out);
    return involved;
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
    mkdir(getPath(compiledPath));
    fs.writeFileSync(compiledPath, output);
    fs.writeFileSync(md5Path, curMD5);
    console.log('Compiled!');

    return output;
}

function transformer<T extends ts.Node>(file: string): ts.TransformerFactory<T> {
    const curPath = getPath(file);
    const importedFiles = [];
    imports[toCompiledPath(file)] = importedFiles;

    return (context) => {
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

                const pkgJson = `${__dirname}/node_modules/${from}/package.json`;
                const type = fs.existsSync(pkgJson) ? "node_modules" : "source";
                if (type == 'source') {
                    from = normalizePath(path.resolve(curPath, from + '.ts'));
                    from = toCompiledPath(from);
                }
                importedFiles.push({from, type});

                const helper = type == "node_modules" ? '/*** from node_modules */' : '';
                node = ts.createIdentifier(`${helper} var ${name} = __webpack_require__("${from}");`);
            } else if (ts.isExportDeclaration(node)) {
                let from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
                from = normalizePath(path.resolve(curPath, from + '.ts'));
                from = toCompiledPath(from);
                importedFiles.push({from, type: "source"});
                node = ts.createIdentifier(`__export(__webpack_require__("${from}"));`);
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

function checkInvolved(changed: string[], involved: string[]): boolean {
    return involved.length == 0 || changed.filter(ch => involved.indexOf(ch) != -1).length > 0;
}

function initImports(): ImportBuffer {
    const importsPath = './compiled/imports.json';
    return fs.existsSync(importsPath) ? JSON.parse(fs.readFileSync(importsPath).toString()) : {};
}

function saveImports(): void {
    const importsPath = './compiled/imports.json';
    fs.writeFileSync(importsPath, JSON.stringify(imports));
}
