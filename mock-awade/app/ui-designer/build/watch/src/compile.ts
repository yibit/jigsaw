import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";
import * as MD5 from "md5.js";
import * as base64 from "base64-js";
import {sync as mkdir} from "mkdirp";
import {execSync as shell} from "child_process";
import {
    awadeRoot,
    expandPackagePath,
    getPath,
    getScriptSnapshot,
    importsBuffer,
    isTypescriptSource,
    nodeModulesRoot,
    normalizePath,
    predictImportType,
    toCompiledPath,
    toImportsPath,
    toMD5Path,
    toRelativePath,
    transformedRequireName,
    version
} from "./shared";
import {ImportFile, ImportIdentifier, ImportType, InjectedParam} from "./typings";

export const scriptFileNames: string[] = [];
export const scriptVersions = new Map<string, number>();

const nodeSass = path.resolve(nodeModulesRoot, '.bin', 'node-sass');

const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => scriptFileNames,
    getScriptVersion: fileName => String(scriptVersions.get(fileName)),
    getScriptSnapshot: getScriptSnapshot,
    getCurrentDirectory: () => awadeRoot,
    getCompilationSettings: () => ({
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2015,
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
    if (isTypescriptSource(file)) {
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
    const curImports: ImportFile[] = [];
    servicesHost.getCustomTransformers = () => ({before: [transformer(file, curImports)]});
    compiled = services.getEmitOutput(file).outputFiles[0].text;
    compiled = fixCompiled(compiled);
    const compiledPath = toCompiledPath(file);
    mkdir(getPath(compiledPath));
    fs.writeFileSync(compiledPath, compiled);
    fs.writeFileSync(toMD5Path(compiledPath), curMD5);
    fs.writeFileSync(toImportsPath(compiledPath), JSON.stringify(curImports));
    importsBuffer[toRelativePath(compiledPath)] = curImports;

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
    try {
        compiled = shell(`${nodeSass} --output-style compressed ${file}`).toString();
    } catch (e) {
        console.error('Unable to compile scss: ' + file);
        console.error(e.message);
        return null;
    }

    // 将css中引用到的图片转为base64方式
    compiled = compiled.replace(/\burl\((.*?)\)/g, (found, url) => {
        const assetFile = `${getPath(file)}/${url}`;
        if (fs.existsSync(assetFile)) {
            const encoded = base64.fromByteArray(fs.readFileSync(assetFile));
            return `url(data:image/png;base64,${encoded})`;
        } else {
            console.error('asset file not found: ' + assetFile);
            return found;
        }
    });

    mkdir(getPath(outFile));
    fs.writeFileSync(outFile, compiled);
    fs.writeFileSync(toMD5Path(outFile), curMD5);
    console.log('Compiled!');

    return compiled;
}

function checkFingerPrint(file: string): [string, string] {
    const compiledPath = toCompiledPath(file);
    const source = fs.readFileSync(file);
    const curMD5 = new MD5().update(version + source).digest('hex');

    if (isTypescriptSource(file) && !fs.existsSync(toImportsPath(compiledPath))) {
        return [curMD5, null];
    }

    let fingerPrint, md5Path = toMD5Path(compiledPath);
    if (fs.existsSync(md5Path)) {
        fingerPrint = fs.readFileSync(md5Path).toString();
    }
    const content = curMD5 == fingerPrint && fs.existsSync(compiledPath) ?
        fs.readFileSync(compiledPath).toString() : null;
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
function transformer<T extends ts.Node>(file: string, curImports: ImportFile[]): ts.TransformerFactory<any> {
    const curPath = getPath(file);

    return (context): any => {
        const visit: ts.Visitor = (node: ts.Node) => {
            node = processImportDeclaration(node);
            node = processExportDeclaration(node);
            node = processRequireCall(node);
            node = processDecorator(node);
            return ts.visitEachChild(node, (child) => visit(child), context);
        };

        return (node) => ts.visitNode(node, visit);
    };

    function processImportDeclaration(node: ts.Node): ts.Node {
        // 有的非标准的import语法：import "xxxx"; 要过滤掉
        if (!ts.isImportDeclaration(node)) {
            return node;
        }

        let from, identifiers: ImportIdentifier[];
        if (node.getChildCount() < 4) {
            // 类似  import "rxjs/add/operator/mergeMap"; 这样的写法
            from = node.getChildAt(1).getText();
            identifiers = [];
        } else {
            // 标准的import写法：
            // import * as xx from "yy"
            // import {aa, bb as BB} from "cc"
            const clauseNode = node.getChildAt(1).getChildAt(0);
            if (clauseNode.kind == ts.SyntaxKind.NamedImports) {
                // import {ClassA, ClassB} from "fdfdfd"; 的方式
                identifiers = clauseNode.getChildAt(1).getText().split(/\s*,\s*/)
                    .map(raw => {
                        const tmp = raw.split(/\s+as\s+/);
                        if (tmp.length == 1) {
                            tmp.push(tmp[0]);
                        }
                        return {alias: tmp[0], identifier: tmp[1]};
                    });
            } else {
                // import * as ts from "fdfdf"; 的方式
                const identifier = clauseNode.getChildAt(2).getText();
                identifiers = [{identifier, alias: identifier}];
            }
            from = node.getChildAt(3).getText();
        }

        from = from.replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        from = fs.existsSync(`${curPath}/${from}/index.ts`) ? `${from}/index` : from;
        let type: ImportType = predictImportType(from);
        if (type == 'source') {
            from = toCompiledPath(normalizePath(path.resolve(curPath, from + '.ts')), false);
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
        from = toCompiledPath(normalizePath(path.resolve(curPath, from + '.ts')), false);
        curImports.push({from, type: "source", identifiers: []});
        return ts.createIdentifier(`/* insert export function here */\n__export(require("${from}"));`);
    }

    function processRequireCall(node: ts.Node): ts.Node {
        if (!ts.isCallExpression(node)) {
            return node;
        }
        let identifier;
        try {
            identifier = node.getChildAt(0);
        } catch (e) {
            // 前面改动了渲染器有问题，导致智力无法获取child
            // 这个问题貌似对最终生成的代码没啥影响，不管了
            return node;
        }
        if (!ts.isIdentifier(identifier)) {
            // 只处理直接 require('xx')
            // 不处理 aa.require('xx')
            return node;
        }
        if (identifier.getText() != 'require') {
            return node;
        }
        const paramList = node.getChildAt(2);
        if (paramList.getChildCount() != 1) {
            return node;
        }
        const paramNode = paramList.getChildAt(0);
        if (!ts.isStringLiteral(paramNode)) {
            return node;
        }

        // webpack支持这样的写法
        // require('!!raw-loader!./data.json') 和 require('./data.json')
        // 前者会把json文件当做字符串返回，而后者返回的是json对象

        // 这个写法与下游处理资源有冲突，这里要转换一下，抹平这个区别
        // raw-loader == 普通资源处理方式，需要删除
        // 而原不带loader的，表示用node的方式处理，需要增加node-loader标志
        const pattern = paramNode.getText().replace(/(^['"])|(['"]$)/g, '');
        const match = pattern.match(/(!!.*?!)?(.*)/);
        let loader = match[1];
        if (!!loader && loader != '!!raw-loader!') {
            throw new Error(`unsupported webpack loader ${loader}, fix me!`);
        }
        loader = !!loader ? '' : '!!node-loader!';
        const file = loader + toCompiledPath(normalizePath(path.resolve(curPath, match[2])), false);
        curImports.push({type: "resource", identifiers: null, from: file});
        return ts.createCall(ts.createIdentifier(transformedRequireName),
            node.typeArguments, [ts.createLiteral(file)]);
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
            return ['Component', 'NgModule', 'Injectable', 'Directive', 'Pipe'].indexOf(decoratorName) != -1;
        });
        if (!decoratorNode) {
            return node;
        }

        // 下面这段用于处理原来渲染器里的 templateUrl/styleUrls 这2个字段的值
        const callNode: ts.CallExpression = decoratorNode.getChildAt(1) as ts.CallExpression;
        const syntaxListNode = callNode.getChildAt(2);
        // let properties: ts.ObjectLiteralElementLike[];
        let decoratorArguments: ts.ObjectLiteralExpression[];
        if (syntaxListNode.getChildCount() > 0) {
            // 这个渲染器没有入参
            const propertiesNode = syntaxListNode.getChildAt(0).getChildAt(1);
            // 把传给渲染器的对象写成变量的方式了会导致propertiesNode是空
            if (!!propertiesNode) {
                let properties = propertiesNode.getChildren()
                    .filter(c => c.kind == ts.SyntaxKind.PropertyAssignment)
                    .map((propNode: ts.PropertyAssignment) => {
                        const prop = propNode.getChildAt(0).getText();
                        if (prop == 'templateUrl') {
                            const resource: ImportFile = {
                                from: normalizeStringLiteralPath(propNode.getChildAt(2).getText()),
                                identifiers: null,
                                type: "resource"
                            };
                            curImports.push(resource);
                            return ts.createPropertyAssignment(
                                ts.createIdentifier('template'),
                                ts.createCall(ts.createIdentifier('require'), [], [
                                    ts.createLiteral(resource.from)
                                ])
                            )
                        } else if (prop == 'styleUrls') {
                            const cssResources = propNode.getChildAt(2).getChildAt(1).getChildren()
                                .filter(c => c.kind == ts.SyntaxKind.StringLiteral)
                                .map(strLiter => normalizeStringLiteralPath(strLiter.getText()));
                            curImports.push(...cssResources.map(res => ({
                                from: res, identifiers: null, type: "resource" as ImportType
                            })));
                            const arrLiterVal = cssResources
                                .map(str => ts.createCall(ts.createIdentifier('require'),
                                    [], [ts.createLiteral(str)]));
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
                decoratorArguments = [ts.createObjectLiteral(properties, true)];
            }
        }

        // 下面这段代码用于给当前类添加一个新的渲染器 __metadata 这是angular编译器要用的
        const injectedParams = parseInjectedParams(node).map(param => {
            const type = predictImportType(param.from);
            let requirePath;
            if (type == 'source') {
                requirePath = param.from;
            } else {
                // std or non std node module
                requirePath = expandPackagePath(param.from);
            }
            return ts.createPropertyAccess(
                ts.createCall(ts.createIdentifier('require'), undefined,
                    [ts.createLiteral(requirePath)]),
                ts.createIdentifier(param.type)
            )
        });
        const fixedDecorator = ts.updateDecorator(decoratorNode,
            ts.updateCall(callNode, callNode.expression, callNode.typeArguments, decoratorArguments));
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
        node = findLastChildByType(classNode, ts.SyntaxKind.SyntaxList);
        const ctorNode = findChildByType(node, ts.SyntaxKind.Constructor);
        if (!ctorNode) {
            // 没有定义构造函数
            return injectedParams;
        }

        // 将所有import扁平化，要不然一个二维结构不方便检索
        const flatten = [];
        curImports.forEach(imf => {
            if (!imf.identifiers) {
                return;
            }
            imf.identifiers.forEach(id => {
                const obj: any = {...id};
                obj.from = imf.from;
                flatten.push(obj);
            });
        });
        const paramList = ctorNode.getChildAt(2);
        paramList.getChildren().filter(p => p.kind == ts.SyntaxKind.Parameter).forEach(paramNode => {
            // 最开始可能有public等修饰符，不理他
            const name = findChildByType(paramNode, ts.SyntaxKind.Identifier).getText().trim();
            const type = findChildByType(paramNode, ts.SyntaxKind.TypeReference).getText().trim();
            const found = flatten.find(imp => imp.alias == type);
            if (found) {
                injectedParams.push({name, from: found.from, type: found.identifier});
            }
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

    function findLastChildByType(node: ts.Node, type: ts.SyntaxKind, fromIdx: number = NaN): ts.Node {
        fromIdx = isNaN(fromIdx) ? node.getChildCount() : fromIdx;
        while (true) {
            const ch = node.getChildAt(--fromIdx);
            if (!ch || ch.kind == type || fromIdx == 0 /* 这个if必须放最后一个 */) {
                return ch;
            }
        }
    }

    function normalizeStringLiteralPath(value: string): string {
        value = value.replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        return toCompiledPath(normalizePath(path.resolve(curPath, value)), false);
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
    rawCompiled = rawCompiled
    // 在第一个插入标志上插入export实现
        .replace('/* insert export function here */', exportDef)
        // 删除多余的插入标志
        .replace(/\/\* insert export function here \*\//g, '');

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
