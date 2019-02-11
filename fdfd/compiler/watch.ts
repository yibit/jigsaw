import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import * as sh from "shelljs";
import * as http from "http";
import * as chokidar from "chokidar";

const srcRoot = path.join(__dirname, '..', 'src').replace(/\\/g, '/');
const distRoot = path.join(__dirname, '..', 'dist').replace(/\\/g, '/');
const [bundlePath, entryPath] = readConfig();

let maxIndex = 0;
type BufferedScript = { version: number, lastModified: number, index: number, compiled?: string };
const files: ts.MapLike<BufferedScript> = {};
const pendingFiles = [];
const compilationOptions = {module: ts.ModuleKind.CommonJS};

const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => sh.find(srcRoot).filter(file => file.match(/.+\.ts$/i) && fs.statSync(file).isFile()),
    getScriptVersion: fileName => files[fileName] ? files[fileName].version.toString() : '0',
    getScriptSnapshot: file => fs.existsSync(file) ? ts.ScriptSnapshot.fromString(fs.readFileSync(file).toString()) : undefined,
    getCurrentDirectory: () => srcRoot,
    getCompilationSettings: () => compilationOptions,
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory
};

// Create the language service files
const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
servicesHost.getScriptFileNames().forEach(emitFile);

let handler;
const watcher = chokidar.watch(srcRoot, {ignored: /(^|[\/\\])\../})
    .on('all', (event, fullPath) => {
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

function emitPendingFiles(): void {
    if (pendingFiles.length == 0) {
        return;
    }
    pendingFiles.forEach(fullPath => {
        fullPath = fullPath.replace(/\\/g, '/');
        if (!fs.existsSync(fullPath)) {
            delete files[fullPath];
        } else if (fs.statSync(fullPath).isFile()) {
            emitFile(fullPath);
        }
    });
    pendingFiles.splice(0, pendingFiles.length);
    handler = -1;
    generateBundle();
}

function emitFile(fullPath: string): void {
    let buffered = files[fullPath];
    if (!buffered) {
        buffered = {version: 0, lastModified: 0, index: (maxIndex++)};
        files[fullPath] = buffered;
    }
    const stat = fs.statSync(fullPath);
    if (buffered.lastModified >= stat.mtimeMs) {
        return;
    }
    buffered.lastModified = stat.mtimeMs;
    buffered.version++;

    console.log(`Emitting ${fullPath}`);
    let output = services.getEmitOutput(fullPath);
    logErrors(fullPath);
    buffered.compiled = output.outputFiles.length > 0 ? output.outputFiles[0].text : '';
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
/******/    return __webpack_require__(__webpack_require__.s = /*entry-index*/);
/******/ })
/************************************************************************/
/******/ ([
    `;
    for (let file in files) {
        const buffered = files[file];
        if (file == entryPath) {
            out = out.replace('/*entry-index*/', buffered.index + '');
        }
        out += `
/* ${buffered.index} */
/***/ (function(module, exports, __webpack_require__) {

${buffered.compiled.replace(/\brequire\("(.*?)"\)/g, (found, importFrom) => {
            const p = path.resolve(path.join(getFilePath(file), importFrom)).replace(/\\/g, '/') + '.ts';
            const f = files[p];
            return !!f ? `__webpack_require__(${f.index})` : found;
        })}

/***/ }),
        `;
    }
    out += '\n/******/ ]);';
    console.log(`saving bundle to ${bundlePath}`);
    fs.writeFileSync(bundlePath, out);

    reinit();
}

function readConfig(): [string, string] {
    const webpackConfig = `${__dirname}/../webpack.config.js`;
    const match = sh.cat(webpackConfig).match(/entry\s*:\s*({[\s\S]*?})/);
    if (!match) {
        throw new Error(`unable to read config from ${webpackConfig}`);
    }
    const config = eval(`(${match[1]})`);
    for (let p in config) {
        if (!config.hasOwnProperty(p)) {
            continue;
        }
        const out = path.join(distRoot, `${p}.js`);
        const entry = path.resolve(path.join(srcRoot, '..', config[p])).replace(/\\/g, '/');
        return [out, entry];
    }
    throw new Error(`unable to read config from ${webpackConfig}`);
}

function getFilePath(file: string): string {
    const pathPartials = file.split(/[\/\\]/);
    pathPartials.pop();
    return pathPartials.join('/');
}

function reinit(): void {
    const options = {
        host: '127.0.0.1', port: 8080, path: '/rdk/service/app/example/server/my_service'
    };
    const req = http.request(options);
    req.on('error', (e) => {
        console.log('unable to reinit, detail: ', e.message);
    });
    req.end();
}

function getAllImportedFiles(fullPath: string): string[] {
    const filePath = getFilePath(fullPath);
    const source = fs.readFileSync(fullPath).toString();
    const importedFiles = [];
    source.replace(/^\s*import\b.+\bfrom\b\s*['"](.*)['"]/mg, (found, importFrom) => {
        const file = path.resolve(path.join(filePath, importFrom)).replace(/\\/g, '/') + '.ts';
        importedFiles.push(file);
        return found;
    });
    return importedFiles;
}
