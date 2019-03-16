import * as fs from "fs";
import * as ts from "typescript";
import * as chokidar from "chokidar";
import * as path from "path";
import * as MD5 from "md5.js";
import * as http from "http";
import {sync as mkdir} from "mkdirp";


const scriptFileNames: string[] = [];
type ChangeEvent = 'add' | 'change' | 'unlink' | 'ref';
type Change = { compiled?: string, path: string, processed?: boolean, event: ChangeEvent };
const rootPath = normalizePath(`${__dirname}/../../`);

const scriptVersions = new Map<string, number>();
const srcRoot = normalizePath(path.join(__dirname, '../../'));
const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => scriptFileNames,
    getScriptVersion: fileName => String(scriptVersions.get(fileName)),
    getScriptSnapshot: getScriptSnapshot,
    getCurrentDirectory: () => srcRoot,
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

const watchingDirs = ['../../basics/src', '../../compiler/module/src', '../../services/src'/*, '../../web/src'*/, '../../sdk/src'];
const watcher = chokidar.watch(watchingDirs, {
    ignored: /(.+\.(___jb_tmp___|svg)$)|(awade[cu].*)|(package(-lock)?\.json)/,
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
    let needCreateServices = false;
    while (changes.length > 0) {
        const change = changes.shift();
        if (!change) {
            break;
        }

        // console.log('Handling file', change.path);
        updateScriptFileNames(change.path, change.event);
        console.log('Processing file', change.path);
        compileScript(change.path);
        needCreateServices = needCreateServices || isInServices(change.path);
    }
    if (needCreateServices) {
        createServices();
    }
}

function updateScriptFileNames(path: string, event: ChangeEvent): void {
    if (!path.match(/.+\.ts/i)) {
        return;
    }

    const idx = scriptFileNames.indexOf(path);
    if (event == 'unlink' && idx != -1) {
        scriptFileNames.splice(idx, 1);
    }
    if (event != 'unlink' && idx == -1) {
        scriptFileNames.push(path);
    }
    if (!scriptVersions.has(path)) {
        scriptVersions.set(path, 0);
    }
    const ver = scriptVersions.get(path);
    scriptVersions.set(path, ver == undefined || ver == null ? 0 : ver + 1);
}

function createServices() {
    console.log(scriptFileNames.filter(s => s.match(/awade-iframe-default-page/)));
    console.log('Creating services ...');

    const entryFile = normalizePath(`${__dirname}/compiled/services/src/exports.js`);
    const pending: string[] = [entryFile];
    const buffer = new Map<string, string>();
    const parse = (curPath, pkg) => {
        if (fs.existsSync(`${__dirname}/node_modules/${pkg}/package.json`)) {
            if (!buffer.has(pkg)) {
                const pkgInfo = require(`${__dirname}/node_modules/${pkg}/package.json`);
                if (!pkgInfo.main) {
                    throw new Error("Error: invalid required node_modules: " + pkg);
                }
                buffer.set(pkg, fs.readFileSync(`${__dirname}/node_modules/${pkg}/${pkgInfo.main}`).toString());
            }
        } else {
            pkg = path.resolve(curPath, pkg + '.js');
            pkg = normalizePath(pkg);
            if (!pending.find(p => p == pkg) && !buffer.has(pkg)) {
                pending.push(pkg);
            }
        }
        return pkg;
    };
    const consoleDef = `var console = __webpack_require__("${normalizePath(__dirname)}/compiled/services/src/utils/log.js");`;
    while (pending.length > 0) {
        const file = pending.shift();
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
        if (compiled.indexOf(consoleDef) == -1) {
            // 给自动加上console的定义
            compiled = `${consoleDef}\n${compiled}`;
        }

        buffer.set(file, compiled);
    }

    let out = '';
    buffer.forEach((compiled, path) => {
        out += `/***/ "${path}":\n`;
        out += '/***/ (function(module, exports, __webpack_require__) {\n';
        out += compiled + '\n';
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
    const outFile = normalizePath(`${rootPath}/server/dist/awade-services.js`);
    fs.writeFileSync(outFile, out);
    reinit();
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
    if (!file.match(/.+\.ts$/)) {
        return '';
    }

    const compiledPath = normalizePath(file.replace(rootPath, `${__dirname}/compiled`))
        .replace(/\.ts$/, '.js');
    let fingerPrint, md5Path = compiledPath.replace(/\.js/, '.md5');
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
    let output = services.getEmitOutput(file).outputFiles[0].text;
    mkdir(getPath(compiledPath));
    fs.writeFileSync(compiledPath, output);
    fs.writeFileSync(md5Path, curMD5);

    return output;
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

function isInServices(file: string): boolean {
    return !!file.match(/.*\/services\/src\/.*/);
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
