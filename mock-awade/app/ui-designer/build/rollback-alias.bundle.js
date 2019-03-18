webpackJsonp(["rollback-alias"], {
    /***/ 0:
    /***/ (function (module, exports, __webpack_require__) {

        // 这个变量的实际值会在运行时被替换
        // 结构是 { [pkg: string]: {identifier: string, alias: string }[] }
        // replace-mark
        var identifierAliases = {};

        for (var pkg in identifierAliases) {
            var module = __webpack_require__(pkg);
            if (!module) {
                console.warn('rollback-alias: no bundle info:', pkg);
                continue;
            }
            var aliases = identifierAliases[pkg];
            for (var i = 0; i < aliases.length; i++) {
                var alias = aliases[i];
                module[alias.identifier] = module[alias.alias];
            }
        }

        /***/
    })
}, [0]);
