import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";
import * as MD5 from "md5.js";
import {sync as mkdir} from "mkdirp";
import {
    builtInNodeModules,
    fixCompiled,
    getPath,
    getScriptSnapshot,
    imports, nodeModulesRoot, normalizePath,
    awadeRoot,
    toCompiledPath, expandPackagePath
} from "./shared";
import {InjectedParam, ImportedFile} from "./typings";

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

export function compileScript(file: string): string {
    if (!file.match(/.+\.ts$/) || !fs.existsSync(file)) {
        return '';
    }

    const compiledPath = toCompiledPath(file);
    let fingerPrint, md5Path = compiledPath.replace(/\.js$/, '.md5');
    if (fs.existsSync(md5Path)) {
        fingerPrint = fs.readFileSync(md5Path).toString();
    }
    const source = fs.readFileSync(file);
    const curMD5 = new MD5().update(source).digest('hex');
    if (curMD5 == fingerPrint) {
        return fs.readFileSync(compiledPath).toString();
    }

    console.log('Compiling...');
    logErrors(file);
    servicesHost.getCustomTransformers = () => ({before: [transformer(file)]});
    let output = services.getEmitOutput(file).outputFiles[0].text;
    output = fixCompiled(output);
    mkdir(getPath(compiledPath));
    fs.writeFileSync(compiledPath, output);
    fs.writeFileSync(md5Path, curMD5);
    console.log('Compiled!');

    return output;
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
    const importedFiles: ImportedFile[] = [];
    imports[compiledPath] = importedFiles;
    // const classes: ClassCtorParams[] = [];
    // ctorParamMap[compiledPath] = classes;

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
        let type, from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        if (fs.existsSync(`${nodeModulesRoot}/${from}/package.json`)) {
            type = "std_node_modules";
        } else if (fs.existsSync(`${nodeModulesRoot}/${from}.js`)) {
            type = "non_std_node_modules";
        } else if (builtInNodeModules.indexOf(from) != -1) {
            type = "node_built_in";
        } else {
            type = 'source';
        }
        if (type == 'source') {
            from = normalizePath(path.resolve(curPath, from + '.ts'));
            from = toCompiledPath(from);
        }
        importedFiles.push({from, type, identifiers});
        return ts.updateImportDeclaration(node, undefined, undefined,
            ts.createImportClause(
                undefined,
                ts.createNamedImports(
                    [ts.createImportSpecifier(undefined, undefined)])
            ),
            // 目的是为了更新这个
            ts.createLiteral(from));
    }

    function processExportDeclaration(node: ts.Node): ts.Node {
        if (!ts.isExportDeclaration(node)) {
            return node;
        }

        let from = node.getChildAt(3).getText().replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        from = normalizePath(path.resolve(curPath, from + '.ts'));
        from = toCompiledPath(from);
        importedFiles.push({from, type: "source", identifiers: []});
        return ts.createIdentifier(`/* insert export function here */\n__export(require("${from}"));`);
    }

    function processDecorator(node: ts.Node): ts.Node {
        if (!ts.isCallExpression(node) || !node.parent || !ts.isDecorator(node.parent)) {
            return node;
        }

        const propertiesNode = node.getChildAt(2).getChildAt(0).getChildAt(1);
        const properties = propertiesNode.getChildren()
            .filter(c => c.kind == ts.SyntaxKind.PropertyAssignment)
            .map((propNode: ts.PropertyAssignment) => {
                const prop = propNode.getChildAt(0).getText();
                if (prop == 'templateUrl') {
                    return ts.createPropertyAssignment(
                        ts.createIdentifier('template'),
                        ts.createCall(ts.createIdentifier('require'), undefined, [
                            ts.createLiteral(stringLiteral2CompiledPath(propNode.getChildAt(2).getText()))
                        ])
                    )
                } else if (prop == 'styleUrls') {
                    const arrLiterVal = propNode.getChildAt(2).getChildAt(1).getChildren()
                        .filter(c => c.kind == ts.SyntaxKind.StringLiteral)
                        .map(strLiter => stringLiteral2CompiledPath(strLiter.getText()))
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
        const injectedParams = parseInjectedParams(node.parent.parent).map(param => {
            return ts.createPropertyAccess(
                ts.createCall(ts.createIdentifier('require'), undefined,
                    [ts.createLiteral(expandPackagePath(param.from))]),
                ts.createIdentifier(param.type)
            )
        });

        return ts.updateCall(node, node.expression, undefined, [
            ts.createObjectLiteral(properties, true),
            ts.createCall(ts.createIdentifier('__metadata'), undefined, [
                ts.createLiteral("design:paramtypes"),
                ts.createArrayLiteral(injectedParams, true)
            ])
        ]);
    }

    function parseInjectedParams(classNode: ts.Node): InjectedParam[] {
        if (!ts.isClassDeclaration(classNode)) {
            return [];
        }

        let node = findChildByType(classNode, ts.SyntaxKind.Identifier);
        let injectedParams: InjectedParam[] = [];
        node = findChildByType(classNode, ts.SyntaxKind.SyntaxList, classNode.getChildren().indexOf(node));
        const ctorNode = findChildByType(node, ts.SyntaxKind.Constructor);
        const paramList = ctorNode.getChildAt(2);
        paramList.getChildren().filter(p => p.kind == ts.SyntaxKind.Parameter).forEach(paramNode => {
            // 最开始可能有public等修饰符，不理他
            const name = findChildByType(paramNode, ts.SyntaxKind.Identifier).getText().trim();
            const type = findChildByType(paramNode, ts.SyntaxKind.TypeReference).getText().trim();
            const from = importedFiles.find(imf => imf.identifiers.indexOf(type) != -1).from;
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

    function stringLiteral2CompiledPath(value: string): string {
        value = value.replace(/(^['"]\s*)|(\s*['"]$)/g, '');
        return toCompiledPath(normalizePath(path.resolve(curPath, value)));
    }
}
