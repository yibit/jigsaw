import * as fs from "fs";
import {sync as mkdir} from "mkdirp";
import {
    awadeRoot,
    checkInvolved,
    compiledRoot,
    expandPackagePath,
    getPath,
    identifierAliases, imports,
    nodeModulesRoot,
    normalizePath,
    reinit, toCompiledPath,
} from "./shared";
import {ImportedFile} from "./typings";


export function createServerBundle(changedFiles: string[], entryFile: string, outFile: string): void {
    const involved = traceInvolved(entryFile);
    if (!checkInvolved(changedFiles, involved)) {
        return;
    }

    const isCreatingServices = entryFile.indexOf('services/src/exports.js') != -1;
    const logFile = `${compiledRoot}/services/src/utils/log.js`;
    const consoleDef = `var console = require("${logFile}");`;
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
        out += '/***/ (function(module, exports, require) {\n';
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
    console.log(`Created!`);
}

export function createWebBundle(changedFiles: string[], bundleName: string, entryFile: string, outFile: string): void {
    const isMainBundle = entryFile == `${compiledRoot}/web/src/main.js`;
    const involved = traceInvolved(entryFile);
    if (!checkInvolved(changedFiles, involved)) {
        return;
    }

    type ProcessedContent = { content: string, from: string };
    const processedScripts: ProcessedContent[] = involved
        .filter(module => module.type == 'source')
        .map(module => {
            const content = fs.readFileSync(module.from).toString()
                .replace(/\brequire\("(.*)"\);/g, (found, pkg) => {
                    if (involved.find(i => (i.type == 'std_node_modules' || i.type == 'non_std_node_modules') && i.from == pkg)) {
                        return `require("${expandPackagePath(pkg)}");`;
                    } else {
                        return found;
                    }
                });
            return {content, from: module.from};
        });
    const processedResources: ProcessedContent[] = involved
        .filter(module => module.type == "resource")
        .map(module => ({
            content: fs.readFileSync(module.from).toString().replace(/\r?\n/g, "\\n").replace(/"/g, '\\"'),
            from: module.from
        }));

    console.log(`Creating bundle ${outFile} ...`);
    let out = '';
    processedScripts.forEach(module => {
        out += `/***/ "${module.from}":\n`;
        out += '/***/ (function(module, exports, require) {\n';
        out += module.content + '\n';
        out += '/***/ }),\n\n';
    });
    processedResources.forEach(module => {
        out += `/***/ "${module.from}":\n`;
        out += '/***/ (function(module, exports) {\n';
        out += `module.exports = "${module.content}";\n`;
        out += '/***/ }),\n\n';
    });

    out = `
webpackJsonp(["${bundleName}"],{

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

${out}`;

    if (isMainBundle) {
        // 只有main才需要这个启动模块
        out += `
            /***/ 0:
            /***/ (function(module, exports, require) {
            
            // 在main中统一处理别名的问题
            ${generateAliasRollbackCode()}
            
            module.exports = require("${entryFile}");
            
            
            /***/ })
            
            },[0]);
        `;
    } else {
        // 只有lib才需要这个归一模块
        out += `
            /***/ "${bundleName}":
            /***/ (function(module, exports, require) {
                "use strict";
                function __export(m) {
                    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
                }
                Object.defineProperty(exports, "__esModule", { value: true });
                __export(require("${entryFile}"));
            /***/ })
            });
        `;
    }

    mkdir(getPath(outFile));
    fs.writeFileSync(outFile, out);
    console.log(`Created!`);
}

// export function createWebLibBundle(changedFiles: string[], bundleName: string, entryFile: string, outFile: string): void {
//     const involved = traceInvolved(entryFile);
//     if (!checkInvolved(changedFiles, involved)) {
//         return;
//     }
//
//     type ProcessedContent = { content: string, from: string };
//     const processedScripts: ProcessedContent[] = involved
//         .filter(module => module.type == 'source')
//         .map(module => {
//             const content = fs.readFileSync(module.from).toString()
//                 .replace(/\brequire\("(.*)"\);/g, (found, pkg) => {
//                     if (involved.find(i => (i.type == 'std_node_modules' || i.type == 'non_std_node_modules') && i.from == pkg)) {
//                         return `require("${expandPackagePath(pkg)}");`;
//                     } else {
//                         return found;
//                     }
//                 });
//             return {content, from: module.from};
//         });
//     const processedResources: ProcessedContent[] = involved
//         .filter(module => module.type == "resource")
//         .map(module => ({
//             content: fs.readFileSync(module.from).toString().replace(/\r?\n/g, "\\n").replace(/"/g, '\\"'),
//             from: module.from
//         }));
//
//     console.log(`Creating bundle ${outFile} ...`);
//     let out = '';
//     processedScripts.forEach(module => {
//         out += `/***/ "${module.from}":\n`;
//         out += '/***/ (function(module, exports, require) {\n';
//         out += module.content + '\n';
//         out += '/***/ }),\n\n';
//     });
//     processedResources.forEach(module => {
//         out += `/***/ "${module.from}":\n`;
//         out += '/***/ (function(module, exports) {\n';
//         out += `module.exports = "${module.content}";\n`;
//         out += '/***/ }),\n\n';
//     });
//
//     out = `
// webpackJsonp(["${bundleName}"],{
//
// /***/ "./src/$$_lazy_route_resource lazy recursive":
// /***/ (function(module, exports) {
//
// function webpackEmptyAsyncContext(req) {
//     // Here Promise.resolve().then() is used instead of new Promise() to prevent
//     // uncatched exception popping up in devtools
//     return Promise.resolve().then(function() {
//         throw new Error("Cannot find module '" + req + "'.");
//     });
// }
// webpackEmptyAsyncContext.keys = function() { return []; };
// webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
// module.exports = webpackEmptyAsyncContext;
// webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";
//
// /***/ }),
//
// /***/ "${bundleName}":
// /***/ (function(module, exports, require) {
// "use strict";
// function __export(m) {
//     for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
// }
// Object.defineProperty(exports, "__esModule", { value: true });
// __export(require("${entryFile}"));
// /***/ }),
//
// ${out}
//
// });
//     `;
//
//     mkdir(getPath(outFile));
//     fs.writeFileSync(outFile, out);
//     console.log(`Created!`);
// }

function generateAliasRollbackCode(): string {
    const mainBundleInvolved = traceInvolved(`${compiledRoot}/web/src/main.js`);
    const basicsBundleInvolved = traceInvolved(`${compiledRoot}/basics/src/public_api.js`);

    // 处理别名的问题
    let aliasRollback = 'let _tmpModule;\n';
    mainBundleInvolved.concat(...basicsBundleInvolved)
        .filter(i => i.type == 'std_node_modules' || i.type == 'non_std_node_modules')
        // 去重
        .filter((item, idx, arr) => idx == arr.findIndex(i => i.from == item.from))
        .forEach(importInfo => {
            const pkg = expandPackagePath(importInfo.from);
            const aliases = identifierAliases[pkg];
            if (!aliases) {
                console.warn('no alias info found:', pkg);
                return;
            }
            aliasRollback += `_tmpModule = require("${pkg}");\n`;
            aliases.forEach(a => {
                if (a.identifier.match(/^\w+$/)) {
                    aliasRollback += `_tmpModule.${a.identifier} = _tmpModule.${a.alias};\n`;
                }
            });
            aliasRollback += '\n';
        });
    return aliasRollback;
}

function traceInvolved(entry: string): ImportedFile[] {
    const involved: ImportedFile[] = [{from: entry, type: "source", identifiers: null}];
    // 这个for不能改成forEach之类的，involved在循环过程中会变长
    for (let i = 0; i < involved.length; i++) {
        const imported = involved[i];
        if (imported.type == 'source' || imported.type == 'resource') {
            if (imports[imported.from]) {
                const incoming = imports[imported.from].filter(f => !involved.find(i => i.from == f.from));
                involved.push(...incoming);
            } else if (!involved.find(i => i.from == imported.from)) {
                involved.push(imported);
            }
        }
    }
    return involved;
}
