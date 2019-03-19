"use strict";
exports.__esModule = true;
var path = require("path");
var fs = require("fs");
var ts = require("typescript");
var http = require("http");
var vendor_alias_parser_1 = require("../../../plugins/installer/vendor-alias-parser");
exports.builtInNodeModules = [
    'assert', 'async_hooks', 'child_process', 'cluster', 'console', 'crypto', 'dns', 'domain', 'events', 'fs',
    'http', 'http2', 'https', 'inspector', 'net', 'os', 'path', 'perf_hooks', 'punycode', 'querystring', 'readline',
    'repl', 'stream', 'string_decoder', 'timers', 'tls', 'trace_events', 'tty', 'dgram', 'url', 'util', 'v8', 'vm',
    'worker_threads', 'zlib'
];
exports.identifierAliases = vendor_alias_parser_1.getIdentifierAliases();
exports.compiledRoot = normalizePath(__dirname + "/../compiled");
exports.awadeRoot = normalizePath(__dirname + "/../../..");
exports.nodeModulesRoot = normalizePath(__dirname + "/../node_modules");
exports.changes = [];
exports.imports = initImports();
function normalizePath(file) {
    return path.resolve(file).replace(/\\/g, '/');
}
exports.normalizePath = normalizePath;
function getPath(file) {
    var tmp = file.split(/\//);
    tmp.pop();
    return tmp.join('/');
}
exports.getPath = getPath;
// transformer中对 export * from "abc" 这样的语句暂时不知道如何完美处理，这里补补漏
function fixCompiled(rawCompiled) {
    var exportDef = "\n        function __export(m) {\n            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\n        }\n    ";
    return rawCompiled.replace('/* insert export function here */', exportDef);
}
exports.fixCompiled = fixCompiled;
function getScriptSnapshot(file) {
    if (!fs.existsSync(file)) {
        return undefined;
    }
    var script = fs.readFileSync(file).toString();
    return ts.ScriptSnapshot.fromString(script);
}
exports.getScriptSnapshot = getScriptSnapshot;
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
exports.reinit = reinit;
function toCompiledPath(source) {
    return !source.startsWith(normalizePath(exports.compiledRoot + "/")) ?
        source.replace(exports.awadeRoot, exports.compiledRoot).replace(/\.ts$/, '.js') :
        source;
}
exports.toCompiledPath = toCompiledPath;
function toSourcePath(source) {
    return source.startsWith(normalizePath(exports.compiledRoot + "/")) ?
        source.replace(exports.compiledRoot, exports.awadeRoot).replace(/\.js$/, '.ts') :
        source;
}
exports.toSourcePath = toSourcePath;
function traceInvolved(entry) {
    var involved = [{ from: entry, type: "source", identifiers: null }];
    // 这个for不能改成forEach之类的，involved在循环过程中会变长
    for (var i = 0; i < involved.length; i++) {
        var imported = involved[i];
        if (imported.type == 'source') {
            if (!exports.imports[imported.from]) {
                continue;
            }
            var incoming = exports.imports[imported.from].filter(function (f) { return !involved.find(function (i) { return i.from == f.from; }); });
            involved.push.apply(involved, incoming);
        }
    }
    return involved;
}
exports.traceInvolved = traceInvolved;
function checkInvolved(changed, involved) {
    return changed.filter(function (ch) { return involved.find(function (i) { return i.from == ch; }); }).length > 0;
}
exports.checkInvolved = checkInvolved;
function initImports() {
    var importsPath = './compiled/imports.json';
    return fs.existsSync(importsPath) ? JSON.parse(fs.readFileSync(importsPath).toString()) : {};
}
exports.initImports = initImports;
function saveImports() {
    var importsPath = './compiled/imports.json';
    fs.writeFileSync(importsPath, JSON.stringify(exports.imports));
}
exports.saveImports = saveImports;
function expandPackagePath(pkg) {
    var pkgJson = exports.nodeModulesRoot + "/" + pkg + "/package.json";
    var transformed;
    if (fs.existsSync(pkgJson)) {
        // std_node_modules
        var pkgInfo = require(pkgJson);
        if (!pkgInfo.module) {
            throw new Error("Error: invalid required node_modules: " + pkg);
        }
        transformed = normalizePath(exports.nodeModulesRoot + "/" + pkg + "/" + pkgInfo.module)
            .substring(exports.nodeModulesRoot.length + 1);
    }
    else {
        // non_std_node_modules
        transformed = normalizePath(exports.nodeModulesRoot + "/" + pkg + ".js")
            .substring(exports.nodeModulesRoot.length + 1);
    }
    return './node_modules/' + transformed;
}
exports.expandPackagePath = expandPackagePath;
