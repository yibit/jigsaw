import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from "fs";
import {sync as glob} from "glob";
import * as ts from "typescript";
import * as path from 'path';

export type AliasMap = { [pkg: string]: {identifier: string, alias: string }[] };
let identifierAliases: AliasMap = {};
const webPath = path.join(__dirname, '../../web/out/vmax-studio/awade/');

if (existsSync(path.join(webPath, 'identifierAliasesFromVendor.json'))) {
    identifierAliases = require(path.join(webPath, 'identifierAliasesFromVendor.json'));
} else {
    console.log('generate alias from vendor...');
    readAliasFromVendor();
    writeFileSync(path.join(webPath, 'identifierAliasesFromVendor.json'),
        JSON.stringify(identifierAliases, null, '  '));
}

export function getIdentifierAliases() {
    return identifierAliases;
}

function readAliasFromVendor() {
    let codeVendor = '';
    glob('vendor*.bundle.js', {cwd: webPath}).forEach(filePath => {
        codeVendor = readFileSync(path.join(webPath, filePath)).toString();
    });

    if(!codeVendor) {
        console.error('there is no verdor*.bundle.js in web, please build web');
        process.exit(1);
    }

    ts.transpileModule(codeVendor, {
        compilerOptions: {module: ts.ModuleKind.ES2015},
        transformers: {before: [getVendorIdentifierAliases()]}
    });
}

function getVendorIdentifierAliases<T extends ts.Node>(): ts.TransformerFactory<T> {
    return (context) => {
        const visit: ts.Visitor = (node) => {
            if(node.kind == ts.SyntaxKind.SourceFile) {
                const objExp = node.getChildAt(0).getChildAt(0).getChildAt(0).getChildAt(2).getChildAt(2);
                if(objExp.kind == ts.SyntaxKind.ObjectLiteralExpression) {
                    objExp.forEachChild(prop => {
                        const pkg = prop.getChildAt(0).getText().replace(/["']/g, '');
                        const parenthesizedExp = prop.getChildAt(2).getText();

                        const re1 = /__webpack_require__\.d\(__webpack_exports__,\s*"(.*?)",\s*function\(\)\s*{\s*return (.*?);\s*}\)/g;
                        parenthesizedExp.replace(re1, (found, alias, identifier) => {
                            if (/ɵ/.test(alias)) return found;
                            alias = alias.trim();
                            identifier = identifier.trim();
                            if(!identifierAliases[pkg]) {
                                identifierAliases[pkg] = [];
                            }
                            identifierAliases[pkg].push({
                                identifier: identifier,
                                alias: alias
                            });
                            return found;
                        });

                        // 处理tslib的__extends __webpack_exports__["b"] = __extends;
                        const re2 = /__webpack_exports__\["(.*?)"]\s*=\s*(.*?);/g;
                        parenthesizedExp.replace(re2, (found, alias, identifier) => {
                            if (/ɵ/.test(alias)) return found;
                            alias = alias.trim();
                            identifier = identifier.trim();
                            if(!identifierAliases[pkg]) {
                                identifierAliases[pkg] = [];
                            }
                            identifierAliases[pkg].push({
                                identifier: identifier,
                                alias: alias
                            });
                            return found;
                        });
                    })
                }
            }

            return ts.visitEachChild(node, (child) => visit(child), context);
        };
        return (node) => ts.visitNode(node, visit);
    }
}
