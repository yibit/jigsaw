"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var glob_1 = require("glob");
var ts = require("typescript");
var path = require("path");
var identifierAliases = {};
var webPath = path.join(__dirname, '../../web/out/vmax-studio/awade/');
if (fs_1.existsSync(path.join(webPath, 'identifierAliasesFromVendor.json'))) {
    identifierAliases = require(path.join(webPath, 'identifierAliasesFromVendor.json'));
}
else {
    console.log('generate alias from vendor...');
    readAliasFromVendor();
    fs_1.writeFileSync(path.join(webPath, 'identifierAliasesFromVendor.json'), JSON.stringify(identifierAliases, null, '  '));
}
function getIdentifierAliases() {
    return identifierAliases;
}
exports.getIdentifierAliases = getIdentifierAliases;
function readAliasFromVendor() {
    var codeVendor = '';
    glob_1.sync('vendor*.bundle.js', { cwd: webPath }).forEach(function (filePath) {
        codeVendor = fs_1.readFileSync(path.join(webPath, filePath)).toString();
    });
    if (!codeVendor) {
        console.error('there is no verdor*.bundle.js in web, please build web');
        process.exit(1);
    }
    ts.transpileModule(codeVendor, {
        compilerOptions: { module: ts.ModuleKind.ES2015 },
        transformers: { before: [getVendorIdentifierAliases()] }
    });
}
function getVendorIdentifierAliases() {
    return function (context) {
        var visit = function (node) {
            if (node.kind == ts.SyntaxKind.SourceFile) {
                var objExp = node.getChildAt(0).getChildAt(0).getChildAt(0).getChildAt(2).getChildAt(2);
                if (objExp.kind == ts.SyntaxKind.ObjectLiteralExpression) {
                    objExp.forEachChild(function (prop) {
                        var pkg = prop.getChildAt(0).getText().replace(/["']/g, '');
                        var parenthesizedExp = prop.getChildAt(2).getText();
                        var re1 = /__webpack_require__\.d\(__webpack_exports__,\s*"(.*?)",\s*function\(\)\s*{\s*return (.*?);\s*}\)/g;
                        parenthesizedExp.replace(re1, function (found, alias, identifier) {
                            if (/ɵ/.test(alias))
                                return found;
                            alias = alias.trim();
                            identifier = identifier.trim();
                            if (!identifierAliases[pkg]) {
                                identifierAliases[pkg] = [];
                            }
                            identifierAliases[pkg].push({
                                identifier: identifier,
                                alias: alias
                            });
                            return found;
                        });
                        // 处理tslib的__extends __webpack_exports__["b"] = __extends;
                        var re2 = /__webpack_exports__\["(.*?)"]\s*=\s*(.*?);/g;
                        parenthesizedExp.replace(re2, function (found, alias, identifier) {
                            if (/ɵ/.test(alias))
                                return found;
                            alias = alias.trim();
                            identifier = identifier.trim();
                            if (!identifierAliases[pkg]) {
                                identifierAliases[pkg] = [];
                            }
                            identifierAliases[pkg].push({
                                identifier: identifier,
                                alias: alias
                            });
                            return found;
                        });
                    });
                }
            }
            return ts.visitEachChild(node, function (child) { return visit(child); }, context);
        };
        return function (node) { return ts.visitNode(node, visit); };
    };
}
