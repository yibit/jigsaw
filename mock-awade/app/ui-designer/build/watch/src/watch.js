"use strict";
exports.__esModule = true;
var fs = require("fs");
var chokidar = require("chokidar");
var mkdirp_1 = require("mkdirp");
var shared_1 = require("./shared");
var compile_script_1 = require("./compile-script");
var watchingDirs = [
    shared_1.awadeRoot + "/basics/src", shared_1.awadeRoot + "/compiler/module/src",
    shared_1.awadeRoot + "/services/src", shared_1.awadeRoot + "/web/src", shared_1.awadeRoot + "/sdk/src"
];
var watcher = chokidar.watch(watchingDirs, {
    ignored: /(.+\.(.*___jb_\w+___|d\.ts|spec\.ts)$)|(awade[cu]\.js)|(package(-lock)?\.json)/,
    persistent: true,
    awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
    }
});
watcher
    .on('add', function (path) { return cacheChange(path, 'add'); })
    .on('change', function (path) { return cacheChange(path, 'change'); })
    .on('unlink', function (path) { return cacheChange(path, 'unlink'); });
var timerHandler = null;
function cacheChange(path, event) {
    var sign;
    if (event == 'unlink') {
        sign = '-';
    }
    else if (event == 'change') {
        sign = '*';
    }
    else {
        sign = '+';
    }
    console.log(sign + " ): " + path);
    var idx = shared_1.changes.findIndex(function (ch) { return ch.path == path && ch.event == event; });
    if (idx != -1) {
        shared_1.changes.splice(idx, 1);
    }
    path = shared_1.normalizePath(path);
    shared_1.changes.push({ path: path, event: event });
    clearTimeout(timerHandler);
    timerHandler = setTimeout(function () {
        timerHandler = null;
        handleChanges();
    }, 300);
}
function handleChanges() {
    var processed = [];
    while (shared_1.changes.length > 0) {
        var change = shared_1.changes.shift();
        if (!change) {
            break;
        }
        updateFiles(change.path, change.event);
        console.log('Processing file', change.path);
        compile_script_1.compileScript(change.path);
        processed.push(shared_1.toCompiledPath(change.path));
    }
    shared_1.saveImports();
    createServerBundle(processed, shared_1.normalizePath(shared_1.compiledRoot + "/services/src/exports.js"), shared_1.normalizePath(shared_1.awadeRoot + "/server/dist/awade-services.js"));
    createServerBundle(processed, shared_1.normalizePath(shared_1.compiledRoot + "/compiler/module/src/bin/awadec.js"), shared_1.normalizePath(shared_1.awadeRoot + "/compiler/module/src/bin/awadec.js"));
    createServerBundle(processed, shared_1.normalizePath(shared_1.compiledRoot + "/compiler/module/src/bin/awadeu.js"), shared_1.normalizePath(shared_1.awadeRoot + "/compiler/module/src/bin/awadeu.js"));
    createWebMainBundle(processed);
}
function updateFiles(sourcePath, event) {
    if (!sourcePath.match(/.+\.ts/i)) {
        return;
    }
    var idx = compile_script_1.scriptFileNames.indexOf(sourcePath);
    if (event == 'unlink' && idx != -1) {
        compile_script_1.scriptFileNames.splice(idx, 1);
        var compiledPath = shared_1.toCompiledPath(sourcePath);
        if (fs.existsSync(compiledPath)) {
            fs.unlinkSync(compiledPath);
        }
    }
    if (event != 'unlink' && idx == -1) {
        compile_script_1.scriptFileNames.push(sourcePath);
    }
    if (!compile_script_1.scriptVersions.has(sourcePath)) {
        compile_script_1.scriptVersions.set(sourcePath, 0);
    }
    var ver = compile_script_1.scriptVersions.get(sourcePath);
    compile_script_1.scriptVersions.set(sourcePath, ver == undefined || ver == null ? 0 : ver + 1);
}
function createServerBundle(changedFiles, entryFile, outFile) {
    var involved = shared_1.traceInvolved(entryFile);
    if (!shared_1.checkInvolved(changedFiles, involved)) {
        return;
    }
    var isCreatingServices = entryFile.indexOf('services/src/exports.js') != -1;
    var logFile = shared_1.compiledRoot + "/services/src/utils/log.js";
    var consoleDef = "var console = __webpack_require__(\"" + logFile + "\");";
    // 编译好的块需要根据当前输出目标做一些具体化的处理
    var processed = involved.map(function (module) {
        var result = { content: '', from: module.from };
        if (module.type == "std_node_modules") {
            var pkgJson = shared_1.nodeModulesRoot + "/" + module.from + "/package.json";
            if (isCreatingServices) {
                var pkgInfo = require(pkgJson);
                if (!pkgInfo.main) {
                    throw new Error("Error: invalid required node_modules: " + module.from);
                }
                result.content = fs.readFileSync(shared_1.nodeModulesRoot + "/" + module.from + "/" + pkgInfo.main).toString();
            }
            else {
                result.content = "module.exports = require(\"" + module.from + "\");";
            }
        }
        else if (module.type == 'non_std_node_modules') {
            throw new Error('non_std_node_modules in services: fix me!');
        }
        else if (module.type == 'source') {
            result.content = fs.readFileSync(module.from).toString();
            if (isCreatingServices && result.content.indexOf(consoleDef) == -1 && logFile != module.from) {
                result.content = consoleDef + "\n" + result.content;
            }
        }
        return result;
    });
    console.log("Creating bundle " + outFile + " ...");
    var out = '';
    processed.forEach(function (module) {
        out += "/***/ \"" + module.from + "\":\n";
        out += '/***/ (function(module, exports, __webpack_require__) {\n';
        out += module.content + '\n';
        out += '/***/ }),\n\n';
    });
    out = "\n/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId]) {\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\ti: moduleId,\n/******/ \t\t\tl: false,\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.l = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// define getter function for harmony exports\n/******/ \t__webpack_require__.d = function(exports, name, getter) {\n/******/ \t\tif(!__webpack_require__.o(exports, name)) {\n/******/ \t\t\tObject.defineProperty(exports, name, {\n/******/ \t\t\t\tconfigurable: false,\n/******/ \t\t\t\tenumerable: true,\n/******/ \t\t\t\tget: getter\n/******/ \t\t\t});\n/******/ \t\t}\n/******/ \t};\n/******/\n/******/ \t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t__webpack_require__.n = function(module) {\n/******/ \t\tvar getter = module && module.__esModule ?\n/******/ \t\t\tfunction getDefault() { return module['default']; } :\n/******/ \t\t\tfunction getModuleExports() { return module; };\n/******/ \t\t__webpack_require__.d(getter, 'a', getter);\n/******/ \t\treturn getter;\n/******/ \t};\n/******/\n/******/ \t// Object.prototype.hasOwnProperty.call\n/******/ \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(__webpack_require__.s = \"" + entryFile + "\");\n/******/ })\n/************************************************************************/\n/******/ ({\n\n" + out + "\n\n/******/ });\n    ";
    if (!isCreatingServices) {
        // creating awadec / awadeu
        out = 'module.exports=\n' + out;
    }
    mkdirp_1.sync(shared_1.getPath(outFile));
    fs.writeFileSync(outFile, out);
    if (isCreatingServices) {
        shared_1.reinit();
    }
}
function createWebMainBundle(changedFiles) {
    var entryFile = shared_1.normalizePath(shared_1.compiledRoot + "/web/src/main.js");
    var involved = shared_1.traceInvolved(entryFile);
    if (!shared_1.checkInvolved(changedFiles, involved)) {
        return;
    }
    var processed = involved
        .map(function (module) {
        if (module.type != 'source') {
            return undefined;
        }
        var content = fs.readFileSync(module.from).toString()
            .replace(/\brequire\("(.*)"\);/g, function (found, pkg) {
            if (involved.find(function (i) { return (i.type == 'std_node_modules' || i.type == 'non_std_node_modules') && i.from == pkg; })) {
                return "require(\"" + shared_1.expandPackagePath(pkg) + "\");";
            }
            else {
                return found;
            }
        });
        return { content: content, from: module.from };
    })
        .filter(function (module) { return !!module; });
    // 处理别名的问题
    var aliasRollBack = 'let _tmpModule;\n';
    involved.filter(function (i) { return i.type == 'std_node_modules' || i.type == 'non_std_node_modules'; }).forEach(function (importInfo) {
        var pkg = shared_1.expandPackagePath(importInfo.from);
        var aliases = shared_1.identifierAliases[pkg];
        if (!aliases) {
            console.warn('no alias info found:', pkg);
            return;
        }
        aliasRollBack += "_tmpModule = require(\"" + pkg + "\");\n";
        aliases.forEach(function (a) {
            if (a.identifier.match(/^\w+$/)) {
                aliasRollBack += "_tmpModule." + a.identifier + " = _tmpModule." + a.alias + ";\n";
            }
        });
        aliasRollBack += '\n';
    });
    var outFile = shared_1.normalizePath(shared_1.awadeRoot + "/web/out/vmax-studio/awade/main.bundle.js");
    console.log("Creating bundle " + outFile + " ...");
    var out = '';
    processed.forEach(function (module) {
        out += "/***/ \"" + module.from + "\":\n";
        out += '/***/ (function(module, exports, require) {\n';
        out += module.content + '\n';
        out += '/***/ }),\n\n';
    });
    out = "\nwebpackJsonp([\"main\"],{\n\n/***/ \"./src/$$_lazy_route_resource lazy recursive\":\n/***/ (function(module, exports) {\n\nfunction webpackEmptyAsyncContext(req) {\n    // Here Promise.resolve().then() is used instead of new Promise() to prevent\n    // uncatched exception popping up in devtools\n    return Promise.resolve().then(function() {\n        throw new Error(\"Cannot find module '\" + req + \"'.\");\n    });\n}\nwebpackEmptyAsyncContext.keys = function() { return []; };\nwebpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;\nmodule.exports = webpackEmptyAsyncContext;\nwebpackEmptyAsyncContext.id = \"./src/$$_lazy_route_resource lazy recursive\";\n\n/***/ }),\n\n" + out + "\n\n\n/***/ 0:\n/***/ (function(module, exports, require) {\n\n" + aliasRollBack + "\nmodule.exports = require(\"" + entryFile + "\");\n\n\n/***/ })\n\n},[0]);\n    ";
    mkdirp_1.sync(shared_1.getPath(outFile));
    fs.writeFileSync(outFile, out);
}
