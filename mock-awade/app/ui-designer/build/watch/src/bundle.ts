import * as fs from "fs";
import {sync as mkdir} from "mkdirp";
import {
    awadeRoot,
    checkInvolved,
    compiledRoot,
    expandPackagePath,
    getPath,
    identifierAliases, isTypescriptSource,
    nodeModulesRoot,
    reinit, toImportsPath,
} from "./shared";
import {ImportedFileMap, ImportFile, ProcessedContent} from "./typings";

const importsBuffer: ImportedFileMap = {};
stripLibFromVendorBundle();

export function createServerBundle(changedFiles: string[], entryFile: string, outFile: string): void {
    const involved = traceInvolved(entryFile);
    if (!checkInvolved(changedFiles, involved)) {
        return;
    }

    const isCreatingServices = entryFile.indexOf('services/src/exports.js') != -1;
    const logFile = `${compiledRoot}/services/src/utils/log.js`;
    const consoleDef = `var console = require("${logFile}");`;
    // 编译好的块需要根据当前输出目标做一些具体化的处理
    const processedScripts = involved.map(module => {
        let result = {content: '', from: module.from};
        const pkgJson = `${nodeModulesRoot}/${module.from}/package.json`;
        if (module.type == "std_node_modules" && fs.existsSync(pkgJson)) {
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
    const processedResources: ProcessedContent[] = involved
        .filter(module => module.type == "resource")
        .map(module => parseResource(module));

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
        out += `module.exports = ${module.content};\n`;
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
    console.log(involved);
    const processedResources: ProcessedContent[] = involved
        .filter(module => module.type == "resource")
        .map(module => parseResource(module));

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
        out += `module.exports = ${module.content};\n`;
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
        addBundle2Index(outFile);
    }

    mkdir(getPath(outFile));
    fs.writeFileSync(outFile, out);
    console.log(`Created!`);
}

function addBundle2Index(outFile: string): void {
    const fileName = outFile.match(/.*\/(.*?\.js)/i)[1];
    const indexFile = `${awadeRoot}/web/out/vmax-studio/awade/index.html`;
    let indexContent = fs.readFileSync(indexFile).toString();
    if (indexContent.match(new RegExp(`<script .*?"${fileName}"></script>`))) {
        return;
    }
    const mainBundleTag = '<script type="text/javascript" src="main.bundle.js"></script>';
    indexContent = indexContent.replace(mainBundleTag,
        `<script type="text/javascript" src="${fileName}"></script>${mainBundleTag}`);
    fs.writeFileSync(indexFile, indexContent);
}

function stripLibFromVendorBundle() {
    const vendorPath = `${awadeRoot}/web/out/vmax-studio/awade/vendor.bundle.js`;
    const vendor = fs.readFileSync(vendorPath).toString();
    const newVendor = vendor.replace(/\/\*\*\*\/ ".\/node_modules\/@awade\/.*?":\s[\s\S]*?\/\*\*\*\/ }\),?/g, '');
    if (newVendor.length != vendor.length) {
        fs.writeFileSync(vendorPath, newVendor);
        console.log('awade libs in vendor.bundle.js is stripped!');
    }
}

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

function traceInvolved(entry: string): ImportFile[] {
    const involved: ImportFile[] = [{from: entry, type: "source", identifiers: null}];
    // 这个for不能改成forEach之类的，involved在循环过程中会变长
    for (let i = 0; i < involved.length; i++) {
        const imported = involved[i];
        if (imported.type == 'source' || imported.type == 'resource') {
            console.log('2222222222222222', imported.from);
            const imports = getImports(imported.from);
            if (imports) {
                const incoming = imports.filter(f => !involved.find(i => i.from == f.from));
                involved.push(...incoming);
            } else if (!involved.find(i => i.from == imported.from)) {
                involved.push(imported);
            }
        }
    }
    return involved;
}

function getImports(file: string): ImportFile[] {
    file = toImportsPath(file);
    if (!fs.existsSync(file)) {
        return [];
    }
    if (!importsBuffer.hasOwnProperty(file)) {
        importsBuffer[file] = JSON.parse(fs.readFileSync(file).toString());
    }
    return importsBuffer[file];
}

function parseResource(resource: ImportFile): ProcessedContent {
    // 这里拿到的resource有可能是webpack资源，注意webpack的loader已经在compile.ts被改写成 node-loader 了
    const match = resource.from.match(/(!!node-loader!)?(.*)/);
    const hasLoader = !!match[1];
    const file = match[2];
    console.log('11111111111111', hasLoader, file, resource.from);

    let result: ProcessedContent = {content: null, from: file};
    result.content = fs.readFileSync(file).toString();
    if (!hasLoader) {
        // 按照普通文本资源方式处理
        result.content = `"${result.content.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/"/g, '\\"')}"`;
    }
    return result;
}
