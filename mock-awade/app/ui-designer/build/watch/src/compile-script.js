"use strict";
exports.__esModule = true;
var path = require("path");
var fs = require("fs");
var ts = require("typescript");
var MD5 = require("md5.js");
var mkdirp_1 = require("mkdirp");
var shared_1 = require("./shared");
exports.scriptFileNames = [];
exports.scriptVersions = new Map();
var servicesHost = {
    getScriptFileNames: function () { return exports.scriptFileNames; },
    getScriptVersion: function (fileName) { return String(exports.scriptVersions.get(fileName)); },
    getScriptSnapshot: shared_1.getScriptSnapshot,
    getCurrentDirectory: function () { return shared_1.awadeRoot; },
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
function compileScript(file) {
    if (!file.match(/.+\.ts$/) || !fs.existsSync(file)) {
        return '';
    }
    var compiledPath = shared_1.toCompiledPath(file);
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
    output = shared_1.fixCompiled(output);
    mkdirp_1.sync(shared_1.getPath(compiledPath));
    fs.writeFileSync(compiledPath, output);
    fs.writeFileSync(md5Path, curMD5);
    console.log('Compiled!');
    return output;
}
exports.compileScript = compileScript;
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
// 调试这个东西，一定要配合这个网站 https://ts-ast-viewer.com/
function transformer(file) {
    var curPath = shared_1.getPath(file), compiledPath = shared_1.toCompiledPath(file);
    var importedFiles = [];
    shared_1.imports[compiledPath] = importedFiles;
    // const classes: ClassCtorParams[] = [];
    // ctorParamMap[compiledPath] = classes;
    return function (context) {
        var visit = function (node) {
            node = processImportDeclaration(node);
            node = processExportDeclaration(node);
            // node = processConstructor(node);
            node = processDecorator(node);
            return ts.visitEachChild(node, function (child) { return visit(child); }, context);
        };
        return function (node) { return ts.visitNode(node, visit); };
    };
    function processImportDeclaration(node) {
        // 有的非标准的import语法：import "xxxx"; 要过滤掉
        if (!ts.isImportDeclaration(node) || node.getChildCount() < 4) {
            return node;
        }
        var clauseNode = node.getChildAt(1).getChildAt(0);
        var identifiers;
        if (clauseNode.kind == ts.SyntaxKind.NamedImports) {
            // import {ClassA, ClassB} from "fdfdfd"; 的方式
            identifiers = clauseNode.getChildAt(1).getText().split(/\s*,\s*/);
        }
        else {
            // import * as ts from "fdfdf"; 的方式
            identifiers = [clauseNode.getChildAt(2).getText()];
        }
        var type, from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        if (fs.existsSync(shared_1.nodeModulesRoot + "/" + from + "/package.json")) {
            type = "std_node_modules";
        }
        else if (fs.existsSync(shared_1.nodeModulesRoot + "/" + from + ".js")) {
            type = "non_std_node_modules";
        }
        else if (shared_1.builtInNodeModules.indexOf(from) != -1) {
            type = "node_built_in";
        }
        else {
            type = 'source';
        }
        if (type == 'source') {
            from = shared_1.normalizePath(path.resolve(curPath, from + '.ts'));
            from = shared_1.toCompiledPath(from);
        }
        importedFiles.push({ from: from, type: type, identifiers: identifiers });
        return ts.updateImportDeclaration(node, undefined, undefined, ts.createImportClause(undefined, ts.createNamedImports([ts.createImportSpecifier(undefined, undefined)])), 
        // 目的是为了更新这个
        ts.createLiteral(from));
    }
    function processExportDeclaration(node) {
        if (!ts.isExportDeclaration(node)) {
            return node;
        }
        var from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        from = shared_1.normalizePath(path.resolve(curPath, from + '.ts'));
        from = shared_1.toCompiledPath(from);
        importedFiles.push({ from: from, type: "source", identifiers: [] });
        return ts.createIdentifier("/* insert export function here */\n__export(require(\"" + from + "\"));");
    }
    function processDecorator(node) {
        if (!ts.isCallExpression(node) || !node.parent || !ts.isDecorator(node.parent)) {
            return node;
        }
        var propertiesNode = node.getChildAt(2).getChildAt(0).getChildAt(1);
        var properties = propertiesNode.getChildren()
            .filter(function (c) { return c.kind == ts.SyntaxKind.PropertyAssignment; })
            .map(function (propNode) {
            var prop = propNode.getChildAt(0).getText();
            if (prop == 'templateUrl') {
                return ts.createPropertyAssignment(ts.createIdentifier('template'), ts.createCall(ts.createIdentifier('require'), undefined, [
                    ts.createLiteral(stringLiteral2CompiledPath(propNode.getChildAt(2).getText()))
                ]));
            }
            else if (prop == 'styleUrls') {
                var arrLiterVal = propNode.getChildAt(2).getChildAt(1).getChildren()
                    .filter(function (c) { return c.kind == ts.SyntaxKind.StringLiteral; })
                    .map(function (strLiter) { return stringLiteral2CompiledPath(strLiter.getText()); })
                    .map(function (str) { return ts.createCall(ts.createIdentifier('require'), undefined, [ts.createLiteral(str)]); });
                return ts.createPropertyAssignment(ts.createIdentifier('styles'), ts.createArrayLiteral(arrLiterVal, false));
            }
            else {
                return ts.createPropertyAssignment(ts.createIdentifier(prop), propNode.initializer);
            }
        });
        var injectedParams = parseInjectedParams(node.parent.parent).map(function (param) {
            return ts.createPropertyAccess(ts.createCall(ts.createIdentifier('require'), undefined, [ts.createLiteral(shared_1.expandPackagePath(param.from))]), ts.createIdentifier(param.type));
        });
        return ts.updateCall(node, node.expression, undefined, [
            ts.createObjectLiteral(properties, true),
            ts.createCall(ts.createIdentifier('__metadata'), undefined, [
                ts.createLiteral("design:paramtypes"),
                ts.createArrayLiteral(injectedParams, true)
            ])
        ]);
    }
    function parseInjectedParams(classNode) {
        if (!ts.isClassDeclaration(classNode)) {
            return [];
        }
        var node = findChildByType(classNode, ts.SyntaxKind.Identifier);
        var injectedParams = [];
        node = findChildByType(classNode, ts.SyntaxKind.SyntaxList, classNode.getChildren().indexOf(node));
        var ctorNode = findChildByType(node, ts.SyntaxKind.Constructor);
        var paramList = ctorNode.getChildAt(2);
        paramList.getChildren().filter(function (p) { return p.kind == ts.SyntaxKind.Parameter; }).forEach(function (paramNode) {
            // 最开始可能有public等修饰符，不理他
            var name = findChildByType(paramNode, ts.SyntaxKind.Identifier).getText().trim();
            var type = findChildByType(paramNode, ts.SyntaxKind.TypeReference).getText().trim();
            var from = importedFiles.find(function (imf) { return imf.identifiers.indexOf(type) != -1; }).from;
            injectedParams.push({ name: name, from: from, type: type });
        });
        return injectedParams;
    }
    function findChildByType(node, type, fromIdx) {
        if (fromIdx === void 0) { fromIdx = 0; }
        while (true) {
            var ch = node.getChildAt(fromIdx++);
            if (!ch || ch.kind == type) {
                return ch;
            }
        }
    }
    function stringLiteral2CompiledPath(value) {
        value = value.replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        return shared_1.toCompiledPath(shared_1.normalizePath(path.resolve(curPath, value)));
    }
}
