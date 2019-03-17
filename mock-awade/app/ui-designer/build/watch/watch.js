"use strict";
exports.__esModule = true;
var fs = require("fs");
var ts = require("typescript");
var chokidar = require("chokidar");
var path = require("path");
var MD5 = require("md5.js");
var http = require("http");
var mkdirp_1 = require("mkdirp");
var scriptFileNames = [];
var compiledRootPath = normalizePath(__dirname + "/compiled");
var rootPath = normalizePath(__dirname + "/../..");
var scriptVersions = new Map();
var servicesHost = {
    getScriptFileNames: function () { return scriptFileNames; },
    getScriptVersion: function (fileName) { return String(scriptVersions.get(fileName)); },
    getScriptSnapshot: getScriptSnapshot,
    getCurrentDirectory: function () { return rootPath; },
    getCompilationSettings: function () { return ({
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES5,
        experimentalDecorators: true
    }); },
    getDefaultLibFileName: function (options) { return ts.getDefaultLibFilePath(options); },
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory
};
var services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
var watchingDirs = [
    '../../basics/src', '../../compiler/module/src', '../../services/src', '../../web/src', '../../sdk/src'
];
var watcher = chokidar.watch(watchingDirs, {
    ignored: /(.+\.(___jb_\w+___|d\.ts|spec\.ts)$)|(awade[cu]\.js)|(package(-lock)?\.json)/,
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
var changes = [];
var involvedServiceFiles = [];
var involvedAwadecFiles = [];
var involvedAwadeuFiles = [];
var involvedWebMainFiles = [];
var imports = initImports();
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
    console.log("(" + sign + ") : " + path);
    var idx = changes.findIndex(function (ch) { return ch.path == path && ch.event == event; });
    if (idx != -1) {
        changes.splice(idx, 1);
    }
    path = normalizePath(path);
    changes.push({ path: path, event: event });
    clearTimeout(timerHandler);
    timerHandler = setTimeout(function () {
        timerHandler = null;
        handleChanges();
    }, 300);
}
function handleChanges() {
    var processed = [];
    while (changes.length > 0) {
        var change = changes.shift();
        if (!change) {
            break;
        }
        updateFiles(change.path, change.event);
        console.log('Processing file', change.path);
        compileScript(change.path);
        processed.push(toCompiledPath(change.path));
    }
    saveImports();
    var involved = createServerBundle(processed, involvedServiceFiles, normalizePath(compiledRootPath + "/services/src/exports.js"), normalizePath(rootPath + "/server/dist/awade-services.js"));
    if (involved) {
        involvedServiceFiles.splice.apply(involvedServiceFiles, [0, Infinity].concat(involved));
    }
    involved = createServerBundle(processed, involvedAwadecFiles, normalizePath(compiledRootPath + "/compiler/module/src/bin/awadec.js"), normalizePath(rootPath + "/compiler/module/src/bin/awadec.js"));
    if (involved) {
        involvedAwadecFiles.splice.apply(involvedAwadecFiles, [0, Infinity].concat(involved));
    }
    involved = createServerBundle(processed, involvedAwadeuFiles, normalizePath(compiledRootPath + "/compiler/module/src/bin/awadeu.js"), normalizePath(rootPath + "/compiler/module/src/bin/awadeu.js"));
    if (involved) {
        involvedAwadeuFiles.splice.apply(involvedAwadeuFiles, [0, Infinity].concat(involved));
    }
    involved = createWebMainBundle(processed);
    if (involved) {
        involvedWebMainFiles.splice.apply(involvedWebMainFiles, [0, Infinity].concat(involved));
    }
}
function updateFiles(sourcePath, event) {
    if (!sourcePath.match(/.+\.ts/i)) {
        return;
    }
    var idx = scriptFileNames.indexOf(sourcePath);
    if (event == 'unlink' && idx != -1) {
        scriptFileNames.splice(idx, 1);
        var compiledPath = toCompiledPath(sourcePath);
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
    var ver = scriptVersions.get(sourcePath);
    scriptVersions.set(sourcePath, ver == undefined || ver == null ? 0 : ver + 1);
}
function createServerBundle(changedFiles, involvedFiles, entryFile, outFile) {
    if (!checkInvolved(changedFiles, involvedFiles)) {
        return null;
    }
    var isCreatingServices = entryFile.indexOf('services/src/exports.js') != -1;
    var pending = [entryFile];
    var buffer = new Map();
    var parse = function (curPath, pkg) {
        if (buffer.has(pkg)) {
            return pkg;
        }
        var pkgJson = __dirname + "/node_modules/" + pkg + "/package.json";
        if (fs.existsSync(pkgJson)) {
            if (isCreatingServices) {
                var pkgInfo = require(pkgJson);
                if (!pkgInfo.main) {
                    throw new Error("Error: invalid required node_modules: " + pkg);
                }
                buffer.set(pkg, fs.readFileSync(__dirname + "/node_modules/" + pkg + "/" + pkgInfo.main).toString());
            }
            else {
                buffer.set(pkg, "module.exports = require(\"" + pkg + "\");");
            }
            return pkg;
        }
        pkg = path.resolve(curPath, pkg + '.js');
        pkg = normalizePath(pkg);
        if (buffer.has(pkg)) {
            return pkg;
        }
        if (!pending.find(function (p) { return p == pkg; })) {
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
    var logFile = normalizePath(__dirname) + "/compiled/services/src/utils/log.js";
    var consoleDef = "var console = __webpack_require__(\"" + logFile + "\");";
    var _loop_1 = function () {
        var file = pending.shift();
        if (!fs.existsSync(file)) {
            return "continue";
        }
        var curPath = getPath(file);
        var compiled = fs.readFileSync(file).toString()
            .replace(/\b__export\(require\("(.*?)"\)\);/g, function (found, pkg) {
            pkg = parse(curPath, pkg);
            return "__export(__webpack_require__(\"" + pkg + "\"));";
        })
            .replace(/(var \w+) = require\("(.*?)"\);/g, function (found, varDef, pkg) {
            pkg = parse(curPath, pkg);
            return varDef + " = __webpack_require__(\"" + pkg + "\");";
        });
        if (compiled.indexOf(consoleDef) == -1 && isCreatingServices && logFile != file) {
            // 给自动加上console的定义
            compiled = consoleDef + "\n" + compiled;
        }
        buffer.set(file, compiled);
    };
    while (pending.length > 0) {
        _loop_1();
    }
    console.log("Creating bundle " + outFile + " ...");
    var out = '', involved = [];
    buffer.forEach(function (compiled, path) {
        out += "/***/ \"" + path + "\":\n";
        out += '/***/ (function(module, exports, __webpack_require__) {\n';
        out += compiled + '\n';
        out += '/***/ }),\n\n';
        involved.push(path);
    });
    buffer.clear();
    out = "\n/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId]) {\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\ti: moduleId,\n/******/ \t\t\tl: false,\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.l = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// define getter function for harmony exports\n/******/ \t__webpack_require__.d = function(exports, name, getter) {\n/******/ \t\tif(!__webpack_require__.o(exports, name)) {\n/******/ \t\t\tObject.defineProperty(exports, name, {\n/******/ \t\t\t\tconfigurable: false,\n/******/ \t\t\t\tenumerable: true,\n/******/ \t\t\t\tget: getter\n/******/ \t\t\t});\n/******/ \t\t}\n/******/ \t};\n/******/\n/******/ \t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t__webpack_require__.n = function(module) {\n/******/ \t\tvar getter = module && module.__esModule ?\n/******/ \t\t\tfunction getDefault() { return module['default']; } :\n/******/ \t\t\tfunction getModuleExports() { return module; };\n/******/ \t\t__webpack_require__.d(getter, 'a', getter);\n/******/ \t\treturn getter;\n/******/ \t};\n/******/\n/******/ \t// Object.prototype.hasOwnProperty.call\n/******/ \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(__webpack_require__.s = \"" + entryFile + "\");\n/******/ })\n/************************************************************************/\n/******/ ({\n\n" + out + "\n\n/******/ });\n    ";
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
function createWebMainBundle(changedFiles) {
    if (!checkInvolved(changedFiles, involvedWebMainFiles)) {
        return null;
    }
    var entryFile = normalizePath(compiledRootPath + "/web/src/main.js");
    var outFile = normalizePath(rootPath + "/web/out/vmax-studio/awade/main.bundle.js");
    var pending = [entryFile];
    var buffer = new Map();
    var parse = function (curPath, pkg) {
        if (buffer.has(pkg)) {
            return pkg;
        }
        var pkgJson = __dirname + "/node_modules/" + pkg + "/package.json";
        if (fs.existsSync(pkgJson)) {
            var pkgInfo = require(pkgJson);
            if (!pkgInfo.module) {
                throw new Error("Error: invalid required node_modules: " + pkg);
            }
            return "./node_modules/" + pkg + "/" + pkgInfo.module;
        }
        pkg = path.resolve(curPath, pkg + '.js');
        pkg = normalizePath(pkg);
        if (buffer.has(pkg)) {
            return pkg;
        }
        if (!pending.find(function (p) { return p == pkg; })) {
            pending.push(pkg);
        }
        return pkg;
    };
    var _loop_2 = function () {
        var file = pending.shift();
        if (!fs.existsSync(file)) {
            return "continue";
        }
        var curPath = getPath(file);
        var compiled = fs.readFileSync(file).toString()
            .replace(/(var \w+) = require\("(.*?)"\);/g, function (found, varDef, pkg) {
            pkg = parse(curPath, pkg);
            return varDef + " = __webpack_require__(\"" + pkg + "\");";
        });
        buffer.set(file, compiled);
    };
    while (pending.length > 0) {
        _loop_2();
    }
    console.log("Creating bundle " + outFile + " ...");
    var out = '', involved = [];
    buffer.forEach(function (compiled, path) {
        out += "/***/ \"" + path + "\":\n";
        out += '/***/ (function(module, exports, __webpack_require__) {\n';
        out += compiled + '\n';
        out += '/***/ }),\n\n';
        involved.push(path);
    });
    buffer.clear();
    out = "\nwebpackJsonp([\"main\"],{\n\n/***/ \"./src/$$_lazy_route_resource lazy recursive\":\n/***/ (function(module, exports) {\n\nfunction webpackEmptyAsyncContext(req) {\n    // Here Promise.resolve().then() is used instead of new Promise() to prevent\n    // uncatched exception popping up in devtools\n    return Promise.resolve().then(function() {\n        throw new Error(\"Cannot find module '\" + req + \"'.\");\n    });\n}\nwebpackEmptyAsyncContext.keys = function() { return []; };\nwebpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;\nmodule.exports = webpackEmptyAsyncContext;\nwebpackEmptyAsyncContext.id = \"./src/$$_lazy_route_resource lazy recursive\";\n\n/***/ }),\n\n" + out + "\n\n\n/***/ 0:\n/***/ (function(module, exports, __webpack_require__) {\n\nmodule.exports = __webpack_require__(\"" + entryFile + "\");\n\n\n/***/ })\n\n},[0]);\n    ";
    fs.writeFileSync(outFile, out);
    return involved;
}
function normalizePath(file) {
    return path.resolve(file).replace(/\\/g, '/');
}
function getPath(file) {
    var tmp = file.split(/\//);
    tmp.pop();
    return tmp.join('/');
}
function compileScript(file) {
    if (!file.match(/.+\.ts$/) || !fs.existsSync(file)) {
        return '';
    }
    var compiledPath = toCompiledPath(file);
    var fingerPrint, md5Path = compiledPath.replace(/\.js$/, '.md5');
    if (fs.existsSync(md5Path)) {
        fingerPrint = fs.readFileSync(md5Path).toString();
    }
    var source = fs.readFileSync(file);
    var curMD5 = new MD5().update(source).digest('hex');
    if (curMD5 == fingerPrint) {
        return fs.readFileSync(compiledPath).toString();
    }
    console.log('Compiling...');
    logErrors(file);
    servicesHost.getCustomTransformers = function () { return ({ before: [transformer(file)] }); };
    var output = services.getEmitOutput(file).outputFiles[0].text;
    mkdirp_1.sync(getPath(compiledPath));
    fs.writeFileSync(compiledPath, output);
    fs.writeFileSync(md5Path, curMD5);
    console.log('Compiled!');
    return output;
}
function transformer(file) {
    var curPath = getPath(file);
    var importedFiles = [];
    imports[toCompiledPath(file)] = importedFiles;
    return function (context) {
        var visit = function (node) {
            if (ts.isImportDeclaration(node) && node.getChildCount() >= 4) {
                var from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
                var tmp = from.split(/\//);
                var name = void 0, child = node.getChildAt(1).getChildAt(0);
                if (child.kind == ts.SyntaxKind.NamespaceImport) {
                    name = child.getChildAt(2).getText();
                }
                else {
                    // @todo 这里存在重名的风险，如果有人故意起一个类似 var aa_1 这样的名字就会重名
                    name = tmp[tmp.length - 1].replace(/\W/g, '_') + '_1';
                }
                var pkgJson = __dirname + "/node_modules/" + from + "/package.json";
                var type = fs.existsSync(pkgJson) ? "node_modules" : "source";
                if (type == 'source') {
                    from = normalizePath(path.resolve(curPath, from + '.ts'));
                    from = toCompiledPath(from);
                }
                importedFiles.push({ from: from, type: type });
                var helper = type == "node_modules" ? '/*** from node_modules */' : '';
                node = ts.createIdentifier(helper + " var " + name + " = __webpack_require__(\"" + from + "\");");
            }
            else if (ts.isExportDeclaration(node)) {
                var from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
                from = normalizePath(path.resolve(curPath, from + '.ts'));
                from = toCompiledPath(from);
                importedFiles.push({ from: from, type: "source" });
                node = ts.createIdentifier("__export(__webpack_require__(\"" + from + "\"));");
            }
            return ts.visitEachChild(node, function (child) { return visit(child); }, context);
        };
        return function (node) { return ts.visitNode(node, visit); };
    };
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
function getScriptSnapshot(file) {
    if (!fs.existsSync(file)) {
        return undefined;
    }
    var script = fs.readFileSync(file).toString();
    return ts.ScriptSnapshot.fromString(script);
}
function reinit() {
    var options = {
        host: '127.0.0.1', port: 5812, path: '/rdk/service/app/ui-designer/server/reinit'
    };
    var req = http.request(options);
    req.on('error', function (e) {
        console.log('unable to reinit, detail: ', e.message);
    });
    req.end();
    console.log('Reinitializing request sent!');
}
function toCompiledPath(source) {
    return !source.startsWith(normalizePath(compiledRootPath + "/")) ?
        source.replace(rootPath, compiledRootPath).replace(/\.ts$/, '.js') :
        source;
}
function toSourcePath(source) {
    return source.startsWith(normalizePath(compiledRootPath + "/")) ?
        source.replace(compiledRootPath, rootPath).replace(/\.js$/, '.ts') :
        source;
}
function checkInvolved(changed, involved) {
    return involved.length == 0 || changed.filter(function (ch) { return involved.indexOf(ch) != -1; }).length > 0;
}
function initImports() {
    var importsPath = './compiled/imports.json';
    return fs.existsSync(importsPath) ? JSON.parse(fs.readFileSync(importsPath).toString()) : {};
}
function saveImports() {
    var importsPath = './compiled/imports.json';
    fs.writeFileSync(importsPath, JSON.stringify(imports));
}
