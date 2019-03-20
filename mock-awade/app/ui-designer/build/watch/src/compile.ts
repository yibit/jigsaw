import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";
import * as MD5 from "md5.js";
import {sync as mkdir} from "mkdirp";
import {execSync as shell} from "child_process";
import {
    builtInNodeModules,
    getPath,
    getScriptSnapshot,
    imports, nodeModulesRoot, normalizePath,
    awadeRoot,
    toCompiledPath, expandPackagePath, predictImportType
} from "./shared";
import {InjectedParam, ImportedFile, ImportFromType} from "./typings";

export const scriptFileNames: string[] = [];
export const scriptVersions = new Map<string, number>();
const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => scriptFileNames,
    getScriptVersion: fileName => String(scriptVersions.get(fileName)),
    getScriptSnapshot: getScriptSnapshot,
    getCurrentDirectory: () => awadeRoot,
    getCompilationSettings: () => ({
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES5,
        experimentalDecorators: true
    }),
    getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory
};
const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

export function compile(file: string): void {
    if (!fs.existsSync(file)) {
        return;
    }
    if (file.match(/.+\.ts$/i)) {
        compileTypescript(file);
    } else if (file.match(/.+\.scss$/i)) {
        compileScss(file);
    } else {
        // just copy to compiled path
        console.log('Copying ...');
        const compiledPath = toCompiledPath(file);
        mkdir(getPath(compiledPath));
        fs.writeFileSync(compiledPath, fs.readFileSync(file));
    }
}

function compileTypescript(file: string): string {
    let [curMD5, compiled] = checkFingerPrint(file);
    if (!!compiled) {
        return compiled;
    }

    console.log('Compiling...');
    logErrors(file);
    servicesHost.getCustomTransformers = () => ({before: [transformer(file)]});
    compiled = services.getEmitOutput(file).outputFiles[0].text;
    compiled = fixCompiled(compiled);
    const compiledPath = toCompiledPath(file);
    mkdir(getPath(compiledPath));
    fs.writeFileSync(compiledPath, compiled);
    fs.writeFileSync(compiledPath + '.md5', curMD5);
    console.log('Compiled!');

    return compiled;
}

function compileScss(file: string): string {
    let [curMD5, compiled] = checkFingerPrint(file);
    if (!!compiled) {
        return compiled;
    }

    console.log('Compiling...');
    const outFile = toCompiledPath(file);
    const cmd = `${nodeModulesRoot}\\.bin\\node-sass --output-style compressed -o ${getPath(outFile)} ${file}`;
    shell(cmd);
    compiled = fs.readFileSync(outFile).toString();
    fs.writeFileSync(outFile, compiled);
    fs.writeFileSync(outFile + '.md5', curMD5);
    console.log('Compiled!');

    return compiled;
}

function checkFingerPrint(file: string): [string, string] {
    const compiledPath = toCompiledPath(file);
    let fingerPrint, md5Path = compiledPath + '.md5';
    if (fs.existsSync(md5Path)) {
        fingerPrint = fs.readFileSync(md5Path).toString();
    }
    const source = fs.readFileSync(file);
    const curMD5 = new MD5().update(source).digest('hex');
    const content = curMD5 == fingerPrint ? fs.readFileSync(compiledPath).toString() : null;
    return [curMD5, content];
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

// 调试这个东西，一定要配合这个网站 https://ts-ast-viewer.com/
function transformer<T extends ts.Node>(file: string): ts.TransformerFactory<any> {
    const curPath = getPath(file), compiledPath = toCompiledPath(file);
    const curImports: ImportedFile[] = [];
    imports[compiledPath] = curImports;

    return (context): any => {
        const visit: ts.Visitor = (node: ts.Node) => {
            node = processImportDeclaration(node);
            node = processExportDeclaration(node);
            // node = processConstructor(node);
            node = processDecorator(node);
            return ts.visitEachChild(node, (child) => visit(child), context);
        };

        return (node) => ts.visitNode(node, visit);
    };

    function processImportDeclaration(node: ts.Node): ts.Node {
        // 有的非标准的import语法：import "xxxx"; 要过滤掉
        if (!ts.isImportDeclaration(node) || node.getChildCount() < 4) {
            return node;
        }

        const clauseNode = node.getChildAt(1).getChildAt(0);
        let identifiers: string[];
        if (clauseNode.kind == ts.SyntaxKind.NamedImports) {
            // import {ClassA, ClassB} from "fdfdfd"; 的方式
            identifiers = clauseNode.getChildAt(1).getText().split(/\s*,\s*/);
        } else {
            // import * as ts from "fdfdf"; 的方式
            identifiers = [clauseNode.getChildAt(2).getText()];
        }
        let from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        let type: ImportFromType = predictImportType(from);
        if (type == 'source') {
            from = toCompiledPath(normalizePath(path.resolve(curPath, from + '.ts')));
        }
        curImports.push({from, type, identifiers});
        return ts.updateImportDeclaration(
            node, node.decorators, node.modifiers, node.importClause,
            // 目的是为了更新这个
            ts.createLiteral(from));
    }

    function processExportDeclaration(node: ts.Node): ts.Node {
        if (!ts.isExportDeclaration(node)) {
            return node;
        }

        let from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        from = toCompiledPath(normalizePath(path.resolve(curPath, from + '.ts')));
        curImports.push({from, type: "source", identifiers: []});
        return ts.createIdentifier(`/* insert export function here */\n__export(require("${from}"));`);
    }

    function processDecorator(node: ts.Node): ts.Node {
        if (!ts.isClassDeclaration(node)) {
            return node;
        }
        if (!node.decorators || node.decorators.length == 0) {
            return node;
        }
        const decoratorNode: ts.Decorator = node.decorators.find(de => {
            const decoratorName = de.getChildAt(1).getChildAt(0).getText();
            // @todo 如果有人给这2个渲染器换个别名，这里就会误判，暂时无视这个情况
            // 比如下面这样的
            // import {Component as MyComponent} from '@angular/core';
            // @MyComponent(...) class XX;
            return decoratorName == 'Component' || decoratorName == 'NgModule';
        });
        if (!decoratorNode) {
            return node;
        }

        // 下面这段用于处理原来渲染器里的 templateUrl/styleUrls 这2个字段的值
        const callNode: ts.CallExpression = decoratorNode.getChildAt(1) as ts.CallExpression;
        const propertiesNode = callNode.getChildAt(2).getChildAt(0).getChildAt(1);
        const properties = propertiesNode.getChildren()
            .filter(c => c.kind == ts.SyntaxKind.PropertyAssignment)
            .map((propNode: ts.PropertyAssignment) => {
                const prop = propNode.getChildAt(0).getText();
                if (prop == 'templateUrl') {
                    const resource: ImportedFile = {
                        from: normalizeStringLiteralPath(propNode.getChildAt(2).getText()),
                        identifiers: null,
                        type: "resource"
                    };
                    curImports.push(resource);
                    return ts.createPropertyAssignment(
                        ts.createIdentifier('template'),
                        ts.createCall(ts.createIdentifier('require'), undefined, [
                            ts.createLiteral(resource.from)
                        ])
                    )
                } else if (prop == 'styleUrls') {
                    const cssResources = propNode.getChildAt(2).getChildAt(1).getChildren()
                        .filter(c => c.kind == ts.SyntaxKind.StringLiteral)
                        .map(strLiter => normalizeStringLiteralPath(strLiter.getText()));
                    curImports.push(...cssResources.map(res => ({
                        from: res, identifiers: null, type: "resource" as ImportFromType
                    })));
                    const arrLiterVal = cssResources
                        .map(str => ts.createCall(ts.createIdentifier('require'),
                            undefined, [ts.createLiteral(str)]));
                    return ts.createPropertyAssignment(
                        ts.createIdentifier('styles'),
                        ts.createArrayLiteral(arrLiterVal, false)
                    )
                } else {
                    return ts.createPropertyAssignment(
                        ts.createIdentifier(prop),
                        propNode.initializer
                    )
                }
            });

        // 下面这段代码用于给当前类添加一个新的渲染器 __metadata 这是angular编译器要用的
        const injectedParams = parseInjectedParams(node).map(param => {
            const type = predictImportType(param.from);
            let requirePath;
            if (type == 'source') {
                requirePath = toCompiledPath(normalizePath(path.resolve(curPath, param.from + '.ts')));
            } else {
                // std non std node module
                requirePath = expandPackagePath(param.from);
            }
            return ts.createPropertyAccess(
                ts.createCall(ts.createIdentifier('require'), undefined,
                    [ts.createLiteral(requirePath)]),
                ts.createIdentifier(param.type)
            )
        });
        const fixedDecorator = ts.updateDecorator(decoratorNode,
            ts.updateCall(callNode, callNode.expression, callNode.typeArguments, [
                ts.createObjectLiteral(properties, true)
            ]));
        return ts.updateClassDeclaration(
            node, [fixedDecorator, ts.createDecorator(
                ts.createCall(ts.createIdentifier('__metadata'), undefined, [
                    ts.createLiteral("design:paramtypes"),
                    ts.createArrayLiteral(injectedParams, true)
                ])
            )],
            node.modifiers, node.name, node.typeParameters, node.heritageClauses, node.members);
    }

    function parseInjectedParams(classNode: ts.ClassDeclaration): InjectedParam[] {
        if (!ts.isClassDeclaration(classNode)) {
            return [];
        }

        let node = findChildByType(classNode, ts.SyntaxKind.Identifier);
        let injectedParams: InjectedParam[] = [];
        node = findChildByType(classNode, ts.SyntaxKind.SyntaxList, classNode.getChildren().indexOf(node));
        const ctorNode = findChildByType(node, ts.SyntaxKind.Constructor);
        if (!ctorNode) {
            // 没有定义构造函数
            return injectedParams;
        }

        const paramList = ctorNode.getChildAt(2);
        paramList.getChildren().filter(p => p.kind == ts.SyntaxKind.Parameter).forEach(paramNode => {
            // 最开始可能有public等修饰符，不理他
            const name = findChildByType(paramNode, ts.SyntaxKind.Identifier).getText().trim();
            const type = findChildByType(paramNode, ts.SyntaxKind.TypeReference).getText().trim();
            const from = curImports.find(imf => imf.identifiers.indexOf(type) != -1).from;
            injectedParams.push({name, from, type});
        });

        return injectedParams;
    }

    function findChildByType(node: ts.Node, type: ts.SyntaxKind, fromIdx: number = 0): ts.Node {
        while (true) {
            const ch = node.getChildAt(fromIdx++);
            if (!ch || ch.kind == type) {
                return ch;
            }
        }
    }

    function normalizeStringLiteralPath(value: string): string {
        value = value.replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        return toCompiledPath(normalizePath(path.resolve(curPath, value)));
    }
}

// 做2个修改：
// 1. transformer中对 export * from "abc" 这样的语句暂时不知道如何完美处理，这里补补漏
// 2. 如果有用到 __metadata 这个渲染器，则追加它的定义
function fixCompiled(rawCompiled: string): string {
    const exportDef = `
        function __export(m) {
            for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }
    `;
    rawCompiled = rawCompiled.replace('/* insert export function here */', exportDef);

    if (rawCompiled.indexOf('__metadata("design:paramtypes"') != -1) {
        rawCompiled = `
            var __metadata = (this && this.__metadata) || function (k, v) {
                if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
            };
            ${rawCompiled}
        `;
    }
    return rawCompiled;
}
