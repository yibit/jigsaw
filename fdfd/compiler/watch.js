"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var sh = require("shelljs");
var http = require("http");
var chokidar = require("chokidar");
var srcRoot = path.join(__dirname, '..', 'src').replace(/\\/g, '/');
var distRoot = path.join(__dirname, '..', 'dist').replace(/\\/g, '/');
var _a = readConfig(), bundlePath = _a[0], entryPath = _a[1];
var maxIndex = 0;
var files = {};
var pendingFiles = [];
var compilationOptions = { module: ts.ModuleKind.CommonJS };
var servicesHost = {
    getScriptFileNames: function () { return sh.find(srcRoot).filter(function (file) { return file.match(/.+\.ts$/i) && fs.statSync(file).isFile(); }); },
    getScriptVersion: function (fileName) { return files[fileName] ? files[fileName].version.toString() : '0'; },
    getScriptSnapshot: function (file) { return fs.existsSync(file) ? ts.ScriptSnapshot.fromString(fs.readFileSync(file).toString()) : undefined; },
    getCurrentDirectory: function () { return srcRoot; },
    getCompilationSettings: function () { return compilationOptions; },
    getDefaultLibFileName: function (options) { return ts.getDefaultLibFilePath(options); },
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory
};
// Create the language service files
var services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
servicesHost.getScriptFileNames().forEach(emitFile);
var handler;
var watcher = chokidar.watch(srcRoot, { ignored: /(^|[\/\\])\../ })
    .on('all', function (event, fullPath) {
    if (!fullPath.match(/.+\.ts$/i)) {
        return;
    }
    if (pendingFiles.indexOf(fullPath) == -1) {
        watcher.add(getAllImportedFiles(fullPath));
        pendingFiles.push(fullPath);
    }
    if (handler != -1) {
        clearTimeout(handler);
    }
    handler = setTimeout(emitPendingFiles, 200);
});
// watcher.add('D:/Codes/webpack-build/other-libs/mylib.ts');
function emitPendingFiles() {
    if (pendingFiles.length == 0) {
        return;
    }
    pendingFiles.forEach(function (fullPath) {
        fullPath = fullPath.replace(/\\/g, '/');
        if (!fs.existsSync(fullPath)) {
            delete files[fullPath];
        }
        else if (fs.statSync(fullPath).isFile()) {
            emitFile(fullPath);
        }
    });
    pendingFiles.splice(0, pendingFiles.length);
    handler = -1;
    generateBundle();
    console.log(watcher.getWatched());
}
function emitFile(fullPath) {
    var buffered = files[fullPath];
    if (!buffered) {
        buffered = { version: 0, lastModified: 0, index: (maxIndex++) };
        files[fullPath] = buffered;
    }
    var stat = fs.statSync(fullPath);
    if (buffered.lastModified >= stat.mtimeMs) {
        return;
    }
    buffered.lastModified = stat.mtimeMs;
    buffered.version++;
    console.log("Emitting " + fullPath);
    var output = services.getEmitOutput(fullPath);
    logErrors(fullPath);
    buffered.compiled = output.outputFiles.length > 0 ? output.outputFiles[0].text : '';
}
function logErrors(fileName) {
    var allDiagnostics = services
        .getCompilerOptionsDiagnostics()
        .concat(services.getSyntacticDiagnostics(fileName))
        .concat(services.getSemanticDiagnostics(fileName));
    allDiagnostics.forEach(function (diagnostic) {
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        if (diagnostic.file) {
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
            console.log("  Error " + diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
        }
        else {
            console.log("  Error: " + message);
        }
    });
}
function generateBundle() {
    var out = "\n/******/ (function(modules) { // webpackBootstrap\n/******/    // The module cache\n/******/    var installedModules = {};\n/******/\n/******/    // The require function\n/******/    function __webpack_require__(moduleId) {\n/******/\n/******/        // Check if module is in cache\n/******/        if(installedModules[moduleId]) {\n/******/            return installedModules[moduleId].exports;\n/******/        }\n/******/        // Create a new module (and put it into the cache)\n/******/        var module = installedModules[moduleId] = {\n/******/            i: moduleId,\n/******/            l: false,\n/******/            exports: {}\n/******/        };\n/******/\n/******/        // Execute the module function\n/******/        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/        // Flag the module as loaded\n/******/        module.l = true;\n/******/\n/******/        // Return the exports of the module\n/******/        return module.exports;\n/******/    }\n/******/\n/******/\n/******/    // expose the modules object (__webpack_modules__)\n/******/    __webpack_require__.m = modules;\n/******/\n/******/    // expose the module cache\n/******/    __webpack_require__.c = installedModules;\n/******/\n/******/    // define getter function for harmony exports\n/******/    __webpack_require__.d = function(exports, name, getter) {\n/******/        if(!__webpack_require__.o(exports, name)) {\n/******/            Object.defineProperty(exports, name, {\n/******/                configurable: false,\n/******/                enumerable: true,\n/******/                get: getter\n/******/            });\n/******/        }\n/******/    };\n/******/\n/******/    // getDefaultExport function for compatibility with non-harmony modules\n/******/    __webpack_require__.n = function(module) {\n/******/        var getter = module && module.__esModule ?\n/******/            function getDefault() { return module['default']; } :\n/******/            function getModuleExports() { return module; };\n/******/        __webpack_require__.d(getter, 'a', getter);\n/******/        return getter;\n/******/    };\n/******/\n/******/    // Object.prototype.hasOwnProperty.call\n/******/    __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/    // __webpack_public_path__\n/******/    __webpack_require__.p = \"\";\n/******/\n/******/    // Load entry module and return exports\n/******/    return __webpack_require__(__webpack_require__.s = /*entry-index*/);\n/******/ })\n/************************************************************************/\n/******/ ([\n    ";
    var _loop_1 = function (file) {
        var buffered = files[file];
        if (file == entryPath) {
            out = out.replace('/*entry-index*/', buffered.index + '');
        }
        out += "\n/* " + buffered.index + " */\n/***/ (function(module, exports, __webpack_require__) {\n\n" + buffered.compiled.replace(/\brequire\("(.*?)"\)/g, function (found, importFrom) {
            var p = path.resolve(path.join(getFilePath(file), importFrom)).replace(/\\/g, '/') + '.ts';
            var f = files[p];
            return !!f ? "__webpack_require__(" + f.index + ")" : found;
        }) + "\n\n/***/ }),\n        ";
    };
    for (var file in files) {
        _loop_1(file);
    }
    out += '\n/******/ ]);';
    console.log("saving bundle to " + bundlePath);
    fs.writeFileSync(bundlePath, out);
    reinit();
}
function readConfig() {
    var webpackConfig = __dirname + "/../webpack.config.js";
    var match = sh.cat(webpackConfig).match(/entry\s*:\s*({[\s\S]*?})/);
    if (!match) {
        throw new Error("unable to read config from " + webpackConfig);
    }
    var config = eval("(" + match[1] + ")");
    for (var p in config) {
        if (!config.hasOwnProperty(p)) {
            continue;
        }
        var out = path.join(distRoot, p + ".js");
        var entry = path.resolve(path.join(srcRoot, '..', config[p])).replace(/\\/g, '/');
        return [out, entry];
    }
    throw new Error("unable to read config from " + webpackConfig);
}
function getFilePath(file) {
    var pathPartials = file.split(/[\/\\]/);
    pathPartials.pop();
    return pathPartials.join('/');
}
function reinit() {
    var options = {
        host: '127.0.0.1', port: 8080, path: '/rdk/service/app/example/server/my_service'
    };
    var req = http.request(options);
    req.on('error', function (e) {
        console.log('unable to reinit, detail: ', e.message);
    });
    req.end();
}
function getAllImportedFiles(fullPath) {
    var filePath = getFilePath(fullPath);
    var source = fs.readFileSync(fullPath).toString();
    var importedFiles = [];
    source.replace(/^\s*import\b.+\bfrom\b\s*['"](.*)['"]/mg, function (found, importFrom) {
        var file = path.resolve(path.join(filePath, importFrom)).replace(/\\/g, '/') + '.ts';
        importedFiles.push(file);
        return found;
    });
    return importedFiles;
}
