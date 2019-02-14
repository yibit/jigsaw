import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import * as sh from "shelljs";
import * as http from "http";
import * as chokidar from "chokidar";

type ScriptTree = {
    version: number, lastModified: number, compiled?: string,
    children: ScriptTree[], path: string
};

const srcRoot = path.join(__dirname, 'src').replace(/\\/g, '/');
const [bundlePath, entryPath] = readConfig();
const libPath = path.join(__dirname, 'node_modules/typescript/lib/lib6.d.ts');
console.log('entry:', entryPath);
console.log('dist:', bundlePath);

const scriptFileNames: string[] = [entryPath, libPath];
const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => scriptFileNames,
    getScriptVersion: fileName => {
        const script = findScriptNode(fileName);
        return script ? String(script.version) : '0';
    },
    getScriptSnapshot: file => fs.existsSync(file) ? ts.ScriptSnapshot.fromString(fs.readFileSync(file).toString()) : undefined,
    getCurrentDirectory: () => srcRoot,
    getCompilationSettings: () => ({module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5}),
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory
};
const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

const rootTree: ScriptTree = parseScriptTree(entryPath);
updateScriptFileNames(flatScriptTree());
generateBundle();

let handler;
const pendingFiles: { path: string, stat: fs.Stats }[] = [];
const watcher = chokidar.watch(srcRoot, {ignored: /(^|[\/\\])\../})
    .on('change', (fullPath, stat) => {
        fullPath = normalizePath(fullPath);
        if (!fullPath.match(/.+\.ts$/i)) {
            return;
        }
        const script = findScriptNode(fullPath);
        if (!script) {
            console.warn('no buffered script found:', fullPath);
            return;
        }
        if (script.lastModified >= +stat.mtime) {
            return;
        }
        if (!(pendingFiles as any).find(f => f.path == fullPath)) {
            pendingFiles.push({path: fullPath, stat: stat});
        }
        if (handler != -1) {
            clearTimeout(handler);
        }
        handler = setTimeout(emitPendingFiles, 200);
    });

function emitPendingFiles(): void {
    if (pendingFiles.length == 0) {
        return;
    }
    pendingFiles.forEach(file => {
        const newScript = parseScriptTree(file.path);
        if (!newScript) {
            return;
        }
        updateScriptFileNames(newScript.children);

        const oldScript = findScriptNode(file.path);
        oldScript.version++;
        oldScript.lastModified = +file.stat.mtime;
        oldScript.children = newScript.children;
        compileScript(oldScript);
    });
    pendingFiles.splice(0, pendingFiles.length);
    handler = -1;
    generateBundle();
}

function compileScript(script: ScriptTree): void {
    if (script.path.match(/.+\.ts$/)) {
        console.log(`Emitting ${script.path}`);
        let output = services.getEmitOutput(script.path);
        logErrors(script.path);
        script.compiled = output.outputFiles.length > 0 ? output.outputFiles[0].text : '';
    } else {
        script.compiled = fs.readFileSync(script.path).toString();
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

function generateBundle(): void {
    let out = `
/******/ (function(modules) { // webpackBootstrap
/******/    // The module cache
/******/    var installedModules = {};
/******/
/******/    // The require function
/******/    function __webpack_require__(moduleId) {
/******/
/******/        // Check if module is in cache
/******/        if(installedModules[moduleId]) {
/******/            return installedModules[moduleId].exports;
/******/        }
/******/        // Create a new module (and put it into the cache)
/******/        var module = installedModules[moduleId] = {
/******/            i: moduleId,
/******/            l: false,
/******/            exports: {}
/******/        };
/******/
/******/        // Execute the module function
/******/        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/        // Flag the module as loaded
/******/        module.l = true;
/******/
/******/        // Return the exports of the module
/******/        return module.exports;
/******/    }
/******/
/******/
/******/    // expose the modules object (__webpack_modules__)
/******/    __webpack_require__.m = modules;
/******/
/******/    // expose the module cache
/******/    __webpack_require__.c = installedModules;
/******/
/******/    // define getter function for harmony exports
/******/    __webpack_require__.d = function(exports, name, getter) {
/******/        if(!__webpack_require__.o(exports, name)) {
/******/            Object.defineProperty(exports, name, {
/******/                configurable: false,
/******/                enumerable: true,
/******/                get: getter
/******/            });
/******/        }
/******/    };
/******/
/******/    // getDefaultExport function for compatibility with non-harmony modules
/******/    __webpack_require__.n = function(module) {
/******/        var getter = module && module.__esModule ?
/******/            function getDefault() { return module['default']; } :
/******/            function getModuleExports() { return module; };
/******/        __webpack_require__.d(getter, 'a', getter);
/******/        return getter;
/******/    };
/******/
/******/    // Object.prototype.hasOwnProperty.call
/******/    __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/    // __webpack_public_path__
/******/    __webpack_require__.p = "";
/******/
/******/    // Load entry module and return exports
/******/    return __webpack_require__(__webpack_require__.s = "${normalizePath(entryPath)}");
/******/ })
/************************************************************************/
/******/ ({
    `;

    flatScriptTree().forEach(script => {
        if (!script.compiled) {
            compileScript(script);
        }
        const fileDir = getFilePath(script.path);
        out += `
"${script.path}":
/***/ (function(module, exports, __webpack_require__) {

${script.compiled.replace(/\brequire\("(.*?)"\)/g, (found, importFrom) => {
            const pkgPath = path.join(__dirname, 'node_modules', importFrom);
            const pkgFile = path.join(pkgPath, 'package.json');
            let p;
            if (fs.existsSync(pkgFile)) {
                const pkg = require(pkgFile);
                p = pkg.main ? path.join(pkgPath, pkg.main) : undefined;
            } else {
                p = path.join(fileDir, importFrom) + '.ts';
            }
            p = p ? normalizePath(p) : undefined;
            const importedScript = findScriptNode(p);
            return !!importedScript ? `__webpack_require__("${importedScript.path}")` : found;
        })}

/***/ }),
        `;
    });

    out += '\n/******/ });';
    console.log(`saving bundle to ${bundlePath}`);
    fs.writeFileSync(bundlePath, out);

    reinit();
}

function readConfig(): [string, string] {
    const webpackConfig = sh.cat(`${__dirname}/webpack.config.js`);

    let match = webpackConfig.match(/\boutput\s*:\s*{[\s\S]*?\bpath\s*:\s*(.*)[\s\S]*?}/);
    if (!match) {
        throw new Error(`unable to read output config from webpack.config.js`);
    }
    const outPath = eval(match[1].replace(/(.*),\s*$/, '$1'));

    match = webpackConfig.match(/\bentry\s*:\s*({[\s\S]*?})/);
    if (!match) {
        throw new Error(`unable to read entry config from webpack.config.js`);
    }
    const config = eval(`(${match[1]})`);
    let outFile, entry;
    for (let p in config) {
        if (!config.hasOwnProperty(p)) {
            continue;
        }
        outFile = path.join(outPath, `${p}.js`);
        entry = path.join(srcRoot, '..', config[p]);
        return [outFile, entry];
    }
}

function getFilePath(file: string): string {
    const pathPartials = file.split(/[\/\\]/);
    pathPartials.pop();
    return pathPartials.join('/');
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
}

function parseScriptTree(fullPath: string): ScriptTree {
    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const parsedScripts: any = flatScriptTree();
    const parse = (fullPath: string): ScriptTree => {
        fullPath = normalizePath(fullPath);
        if (fullPath.match(/\/(basics|sdk)-src\//)) {
            return;
        }

        console.log('parsing', fullPath);
        const scriptTree: ScriptTree = createScriptNode(fullPath);
        if (!parsedScripts.find(s => s.path == fullPath)) {
            parsedScripts.push(scriptTree);
        }

        const filePath = getFilePath(fullPath);
        const source = fs.readFileSync(fullPath).toString();
        source.replace(/^\s*(im|ex)port\b.+\bfrom\b\s*['"](.*)['"]/mg, (found, ignored, importFrom) => {
            const pkgPath = path.join(__dirname, 'node_modules', importFrom);
            const pkgFile = path.join(pkgPath, 'package.json');
            let file;
            if (fs.existsSync(pkgFile)) {
                const pkg = require(pkgFile);
                file = pkg.main ? path.join(pkgPath, pkg.main) : undefined;
            } else {
                file = path.join(filePath, importFrom) + '.ts';
            }
            if (file) {
                let child: ScriptTree = parsedScripts.find(s => s.path == normalizePath(file));
                child = !!child ? child : parse(file);
                if (!!child) {
                    scriptTree.children.push(child);
                }
            }
            return found;
        });
        return scriptTree;
    };
    return parse(fullPath);
}

function findScriptNode(fullPath: string, tree?: ScriptTree): ScriptTree {
    if (!fullPath) {
        return null;
    }
    tree = !!tree ? tree : rootTree;
    if (!tree) {
        // 最开始的时候，rootTree依然是空的
        return;
    }
    fullPath = normalizePath(fullPath);
    return (flatScriptTree(tree) as any).find(script => script.path == fullPath);
}

function flatScriptTree(tree?: ScriptTree): ScriptTree[] {
    const flatten: ScriptTree[] = [];
    const flat = (child: ScriptTree) => {
        if (!child) {
            return;
        }
        if (flatten.indexOf(child) == -1) {
            flatten.push(child);
        }
        child.children.forEach(c => flat(c));
    };
    flat(!!tree ? tree : rootTree);
    return flatten;
}

function normalizePath(file: string): string {
    return path.resolve(file).replace(/\\/g, '/');
}

function createScriptNode(fullPath: string): ScriptTree {
    return {version: 0, lastModified: 0, children: [], path: normalizePath(fullPath)};
}

function updateScriptFileNames(incoming: ScriptTree[]) {
    incoming = incoming.concat();
    while (incoming.length > 0) {
        const script = incoming.pop();
        if (script.path.match(/.+\.ts$/) && scriptFileNames.indexOf(script.path) == -1) {
            scriptFileNames.push(script.path);
        }
    }
}


