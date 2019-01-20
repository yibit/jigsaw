import {readFileSync, writeFileSync} from "fs";
import * as ts from "typescript";

let source = readFileSync('D:\\Codes\\teach-pinyin\\node_modules\\@rdkmaster\\jigsaw\\@rdkmaster\\jigsaw.es5.js').toString();

let identifierCount = 0;
const identifierAliases: {[identifier: string]: string} = {};
const identifierPackages: {[identifier: string]: string} = {};
const packagePaths: any = {};
readInfoFromWebpack();

let result = ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.ES2015},
    transformers: {before: [transformer()]}
});

writeFileSync('d:\\temp\\output.js', result.outputText);
writeFileSync('d:\\temp\\identifierAliases.json', JSON.stringify(identifierAliases, null, '  '))
writeFileSync('d:\\temp\\identifierPackages.json', JSON.stringify(identifierPackages, null, '  '))
writeFileSync('d:\\temp\\packagePaths.json', JSON.stringify(packagePaths, null, '  '))

function transformer<T extends ts.Node>(): ts.TransformerFactory<T> {
    return (context) => {
        const visit: ts.Visitor = (node) => {
            if (node.kind == ts.SyntaxKind.ImportDeclaration) {
                return ts.createIdentifier(transformImportClause(node));
            }
            if (node.kind == ts.SyntaxKind.PropertyAccessExpression &&
                node.getChildAt(0).kind == ts.SyntaxKind.Identifier) {
                // 处理整包引入的标识符转译
                const identifier = node.getChildAt(0).getFullText().trim();
                const pkg = identifierPackages[identifier];
                if (pkg) {
                    const property = node.getChildAt(2).getFullText().trim();
                    const alias = identifierAliases[property];
                    return ts.createIdentifier(`${pkg}["${alias}" /* ${property} */]`);
                } else {
                    return ts.visitEachChild(node, (child) => visit(child), context);
                }
            }
            if (node.kind == ts.SyntaxKind.Identifier && node.parent.kind != ts.SyntaxKind.PropertyAccessExpression) {
                const identifier = node.getFullText().trim();
                const alias = identifierAliases[identifier];
                const pkg = identifierPackages[identifier];
                if (alias && pkg) {
                    return ts.createIdentifier(`${pkg}["${alias}" /* ${identifier} */]`);
                }
            }
            return ts.visitEachChild(node, (child) => visit(child), context);
        };

        return (node) => ts.visitNode(node, visit);
    };
}

function transformImportClause(node: ts.Node) {
    const children = node.getChildren();
    const clauseNode = children.find(n => n.kind == ts.SyntaxKind.ImportClause);
    if (!clauseNode) {
        return '';
    }

    const identifiersNode = clauseNode.getChildren().find(
        n => n.kind == ts.SyntaxKind.NamedImports || n.kind == ts.SyntaxKind.NamespaceImport);
    if (!identifiersNode) {
        return '';
    }

    let ids = identifiersNode.getFullText().replace(/[{}]/g, '').split(/,/);
    let pkg = children.find(n => n.kind == ts.SyntaxKind.StringLiteral).getFullText();
    pkg = pkg.trim().replace(/['"]/g, '').replace(/[^\w]/g, '_');
    const wrapped = `__WEBPACK_IMPORTED_MODULE_${identifierCount++}_${pkg}__`;
    ids.forEach(i => identifierPackages[i.trim().replace(/.*\s+as\s+/, '')] = wrapped);
    return `var ${wrapped} = __webpack_require__("${packagePaths[pkg]}");`;
}

function readInfoFromWebpack() {
    const code = readFileSync('D:\\temp\\vendor.bundle.js').toString();
    const re1 = /\b__WEBPACK_IMPORTED_MODULE_\d+_\w+__\s*\[\s*['"](.*?)['"]\s*\/\*(.*?)\*\/]/g;
    code.replace(re1, (found, alias, identifier) => {
        alias = alias.trim();
        identifierAliases[`${identifier.trim()}`] = alias;
    });
    const re2 = /\bvar\s+__WEBPACK_IMPORTED_MODULE_\d+_(\w+)__\s*=\s*__webpack_require__\("(.*?)"\)/g;
    code.replace(re2, (found, pkg, path) => {
        packagePaths[pkg] = path.trim();
    });
}
