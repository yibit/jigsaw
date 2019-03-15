import * as fs from "fs";
import * as ts from "typescript";
import * as chokidar from "chokidar";
import * as path from "path";

const entryFile = normalizePath(`${__dirname}/src/exports.ts`);
const outFile = normalizePath(`${__dirname}/dist/out.js`);

fs.unlinkSync(outFile);

const scriptFileNames: string[] = [];
const scriptVersions = new Map<string, number>();
const srcRoot = normalizePath(path.join(__dirname, 'src'));
const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => scriptFileNames,
    getScriptVersion: fileName => String(scriptVersions.get(fileName)),
    getScriptSnapshot: file => fs.existsSync(file) ? ts.ScriptSnapshot.fromString(fs.readFileSync(file).toString()) : undefined,
    getCurrentDirectory: () => srcRoot,
    getCompilationSettings: () => ({module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5}),
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory
};
const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

const watcher = chokidar.watch('src', {
    ignored: /(^|[\/\\])\../,
    usePolling: true,
    interval: 300,
    awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
    },
});
watcher
    .on('add', path => cacheChange(path, 'add'))
    .on('change', path => cacheChange(path, 'change'))
    .on('unlink', path => cacheChange(path, 'unlink'));

type Change = { compiled?: string, path: string, event: 'add' | 'change' | 'unlink' };
const changes: Change[] = [];
const nodeModules: string[] = [];
let timerHandler = null;

function cacheChange(path: string, event: 'add' | 'change' | 'unlink'): void {
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
    nodeModules.splice(0, Infinity);
    changes.forEach((change: Change) => {
        console.log('Handling file', change.path);
        updateScriptFileNames(change.path, change.event);
        logErrors(change.path);
        let output = services.getEmitOutput(change.path);
        change.compiled = output.outputFiles[0].text;
        fixRequires(change);
    });
    if (fs.existsSync(outFile)) {
        updateOutFile(changes, nodeModules);
    } else {
        createOutFile(changes, nodeModules);
    }
    changes.splice(0, Infinity);
}

function updateScriptFileNames(path: string, event: 'add' | 'change' | 'unlink'): void {
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

function fixRequires(change: Change): void {
    const curPath = getPath(change.path);
    change.compiled = change.compiled.replace(/\brequire\("(.*?)"\)/g, (found, pkg) => {
        if (fs.existsSync(`${__dirname}/node_modules/${pkg}/package.json`)) {
            nodeModules.push(pkg);
        } else {
            pkg = path.resolve(curPath, pkg + '.ts');
            pkg = normalizePath(pkg);
        }
        return `__webpack_require__("${pkg}")`
    });
}

function updateOutFile(changes: Change[], nodeModules: string[]): void {
    // 需要时才从磁盘上读进来，是为了节约内存
    let out = fs.readFileSync(outFile).toString();
    [...changes, ...nodeModules.map(pkg => {
        const pkgInfo = require(`${__dirname}/node_modules/${pkg}/package.json`);
        if (!pkgInfo.main) {
            console.error("Error: invalid required node_modules: ", pkg);
            return null;
        }
        const script = fs.readFileSync(`${__dirname}/node_modules/${pkg}/${pkgInfo.main}`).toString();
        return {path: pkg, event: 'add', compiled: script} as Change;
    })].filter(ch => ch != null).forEach(change => {
        const re = new RegExp(`(/\\*\\*\\*/ "${change.path}":\\s*)[\\s\\S]*?(// EoF: ${change.path}\\s/\\*\\*\\*/ }\\),)`);
        if (change.event == 'unlink') {
            out = out.replace(re, '');
            return;
        }
        const match = out.match(re);
        if (match) {
            out = out.replace(re, `$1/***/ (function(module, exports, __webpack_require__) {\n${change.compiled}$2`);
        } else {
            out = out.replace(/(\/\/ EoC\s*\/\*\*\*\*\*\*\/ }\);)/, `
/***/ "${change.path}":
/***/ (function(module, exports, __webpack_require__) {
${change.compiled}
// EoF: ${change.path}
/***/ }),

$1`);
        }
    });
    fs.writeFileSync(outFile, out);
}

function createOutFile(changes: Change[], nodeModules: string[]): void {
    let out = '';
    changes.forEach(change => {
        out += `/***/ "${change.path}":\n`;
        out += '/***/ (function(module, exports, __webpack_require__) {\n';
        out += change.compiled + '\n';
        out += `// EoF: ${change.path}\n`;
        out += '/***/ }),\n\n';
    });
    nodeModules.forEach(pkg => {
        const pkgInfo = require(`${__dirname}/node_modules/${pkg}/package.json`);
        if (!pkgInfo.main) {
            console.error("Error: invalid required node_modules: ", pkg);
            return;
        }
        out += `/***/ "${pkg}":\n`;
        out += '/***/ (function(module, exports, __webpack_require__) {\n';
        out += fs.readFileSync(`${__dirname}/node_modules/${pkg}/${pkgInfo.main}`) + '\n';
        out += `// EoF: ${pkg}\n`;
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

// EoC
/******/ });
    `;
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
