import * as fs from "fs";
import * as chokidar from "chokidar";
import {sync as mkdir} from "mkdirp";
import {
    changes,
    checkInvolved,
    compiledRoot,
    getPath,
    identifierAliases, nodeModulesRoot,
    normalizePath,
    reinit,
    awadeRoot,
    saveImports,
    toCompiledPath,
    traceInvolved, expandPackagePath
} from "./shared";
import {compileScript, scriptFileNames, scriptVersions} from "./compile-script";
import {ChangeEvent} from "./typings";


const watchingDirs = [
    `${awadeRoot}/basics/src`, `${awadeRoot}/compiler/module/src`,
    `${awadeRoot}/services/src`, `${awadeRoot}/web/src`, `${awadeRoot}/sdk/src`
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
        normalizePath(`${compiledRoot}/services/src/exports.js`),
        normalizePath(`${awadeRoot}/server/dist/awade-services.js`));
    createServerBundle(processed,
        normalizePath(`${compiledRoot}/compiler/module/src/bin/awadec.js`),
        normalizePath(`${awadeRoot}/compiler/module/src/bin/awadec.js`));
    createServerBundle(processed,
        normalizePath(`${compiledRoot}/compiler/module/src/bin/awadeu.js`),
        normalizePath(`${awadeRoot}/compiler/module/src/bin/awadeu.js`));
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
    const logFile = `${compiledRoot}/services/src/utils/log.js`;
    const consoleDef = `var console = __webpack_require__("${logFile}");`;
    // 编译好的块需要根据当前输出目标做一些具体化的处理
    const processed = involved.map(module => {
        const result = {content: '', from: module.from};
        if (module.type == "std_node_modules") {
            const pkgJson = `${nodeModulesRoot}/${module.from}/package.json`;
            if (isCreatingServices) {
                const pkgInfo = require(pkgJson);
                if (!pkgInfo.main) {
                    throw new Error("Error: invalid required node_modules: " + module.from);
                }
                result.content = fs.readFileSync(`${nodeModulesRoot}/${module.from}/${pkgInfo.main}`).toString();
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
    const entryFile = normalizePath(`${compiledRoot}/web/src/main.js`);
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
                .replace(/\brequire\("(.*)"\);/g, (found, pkg) => {
                    if (involved.find(i => (i.type == 'std_node_modules' || i.type == 'non_std_node_modules') && i.from == pkg)) {
                        return `require("${expandPackagePath(pkg)}");`;
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
        const pkg = expandPackagePath(importInfo.from);
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

    const outFile = normalizePath(`${awadeRoot}/web/out/vmax-studio/awade/main.bundle.js`);
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
