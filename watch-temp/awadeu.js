module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = require("@awade/basics");

/***/ }),

/***/ 26:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__update_svd_update_svd__ = __webpack_require__(27);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "upgradeProject", function() { return __WEBPACK_IMPORTED_MODULE_0__update_svd_update_svd__["a"]; });



/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = upgradeProject;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


const updaters = [];
let awadeVersion = 0;
if (__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].isInNode || __WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].isInRDK) {
    awadeVersion = toVersionValue(JSON.parse(Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])('app/ui-designer/web/package.json')).version);
    console.log(`awade version in numeric format: ${awadeVersion}`);
}
class UpdaterBase {
    constructor(version) {
        this.version = version;
    }
    get versionValue() {
        return toVersionValue(this.version);
    }
    get projectPath() {
        return toProjectPath(this.user, this.project);
    }
    get savingsPath() {
        return toSavingsPath(this.user, this.project);
    }
    updateSvd(metaSvd) {
        return true;
    }
    updateSeed() {
        return true;
    }
    updateUserProject() {
        return true;
    }
}
/* unused harmony export UpdaterBase */

// 高版本的升级器放上面，方便维护代码
updaters.unshift(new (class UpdateToV1_1_11 extends UpdaterBase {
    constructor() {
        super('v1.1.11');
    }
    updateUserProject() {
        let logCode = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])('app/ui-designer/services/legacy/log.js');
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(`${this.projectPath}/server/utils/log.js`, logCode);
        return true;
    }
})());
updaters.unshift(new (class UpdateToV1_1_9 extends UpdaterBase {
    constructor() {
        super('v1.1.9');
    }
    updateSvd(metaSvd) {
        const cursor = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(`${this.savingsPath}/histories/cursor`);
        const publishFile = `${this.savingsPath}/histories/${cursor}/publish.sh`;
        if (!Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["k" /* isPathExist */])(publishFile)) {
            Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["b" /* copyFile */])(`app/ui-designer/services/scripts/publish.sh`, publishFile);
        }
        return true;
    }
})());
updaters.unshift(new (class UpdateToV1_1_8 extends UpdaterBase {
    constructor() {
        super('v1.1.8');
    }
    updateSvd(metaSvd) {
        const newModuleCode = File.readString('app/ui-designer/compiler/project-seed/web/src/app/entry-module.ts');
        File.save(`${this.projectPath}/web/src/app/entry-module.ts`, newModuleCode);
        return true;
    }
})());
updaters.unshift(new (class UpdateToV1_1_7 extends UpdaterBase {
    constructor() {
        super('v1.1.7');
    }
    updateSvd(metaSvd) {
        metaSvd.children && metaSvd.children.forEach(item => {
            this.updateSvd(item);
        });
        if (metaSvd.selector != "jigsaw-icon") {
            return true;
        }
        if (metaSvd.selector == "jigsaw-icon" && metaSvd.inputs.length > 0) {
            metaSvd.inputs.forEach(item => {
                if (item.property == "icon" && item.selectedType == "iconType") {
                    item.selectedType = "AwadeIcon";
                }
            });
        }
        if (metaSvd.selector == "jigsaw-rate" && metaSvd.inputs.length > 0) {
            metaSvd.inputs.forEach(item => {
                if (item.property == "icon" && item.selectedType == "iconType") {
                    item.selectedType = "AwadeIcon";
                }
            });
        }
        return true;
    }
})());
updaters.unshift(new (class UpdateToV1_1_6 extends UpdaterBase {
    constructor() {
        super('v1.1.6');
    }
    updateSvd(metaSvd) {
        // 修改已有工程中的 proxy-config.json 文件中的 rdk端口号
        const proxyConfigPath = `${this.projectPath}/web/proxy-config.json`;
        let proxyConfigContent = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(proxyConfigPath);
        const match = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(`proc/conf/rdk.cfg`).match(/\blisten.port\s*=\s*(\d+)/);
        const port = (match && match.length > 1) ? match[1] : 5812;
        proxyConfigContent = proxyConfigContent.replace(/(\/rdk\/service(.*)\/\/)(.*)(:)(\d+)/, '$1127.0.0.1$4' + port);
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(proxyConfigPath, proxyConfigContent);
        metaSvd.children && metaSvd.children.forEach(item => {
            this.updateSvd(item);
        });
        if (!metaSvd.outputs || metaSvd.outputs.length == 0) {
            return true;
        }
        if (metaSvd.selector == "jigsaw-checkbox") {
            metaSvd.outputs.forEach(item => {
                if (item.property == "change") {
                    item.property = "checkedChange";
                }
            });
        }
        if (metaSvd.selector == "jigsaw-slider") {
            metaSvd.outputs.forEach(item => {
                if (item.property == "change") {
                    item.property = "valueChange";
                }
            });
        }
        if (metaSvd.selector == "jigsaw-switch") {
            metaSvd.outputs.forEach(item => {
                if (item.property == "change") {
                    item.property = "checkedChange";
                }
            });
        }
        return true;
    }
})());
updaters.unshift(new (class UpdateToV1_1_5 extends UpdaterBase {
    constructor() {
        super('v1.1.5');
    }
    updateSvd(metaSvd) {
        // 修改routers.json文件的格式
        const cursor = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(`${this.savingsPath}/histories/cursor`);
        const routersFile = `${this.savingsPath}/histories/${cursor}/routers.json`;
        let routersCode = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(routersFile);
        if (routersCode == null || routersCode == undefined || routersCode == '') {
            routersCode = `[
                    {
                        "path": "",
                        "component": "AppComponent"
                    }
                ]`;
        }
        try {
            let routerObj = JSON.parse(routersCode);
            if (routerObj instanceof Array) {
                // 需要升级
                routersCode = `
                    {
                        "routers": ${routersCode},
                        "guards": []
                    }`;
            }
        }
        catch (e) {
            console.error('upgrade routers error:', e.stack, ', routersCode: ', routersCode);
            return false;
        }
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(routersFile, routersCode);
        return true;
    }
})());
updaters.unshift(new (class UpdateToV1_1_4 extends UpdaterBase {
    constructor() {
        super('v1.1.4');
    }
    _updateHistoryItems() {
        const projectDataPath = this.savingsPath + "/histories";
        const resultList = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["m" /* listFiles */])(projectDataPath);
        let parseFileArray = [];
        resultList.forEach(function (item) {
            if (!isNaN(parseInt(item))) {
                parseFileArray.push(parseInt(item));
            }
        });
        parseFileArray.sort((a, b) => {
            return a - b;
        });
        let curMaxFilePath = parseFileArray[parseFileArray.length - 1];
        const maxHistoriesNum = 600;
        if (curMaxFilePath > maxHistoriesNum) {
            for (let i = 0; i < (curMaxFilePath - maxHistoriesNum); i++) {
                let folderPathToDelete = projectDataPath + "/" + curMaxFilePath[i];
                Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["c" /* deleteDir */])(folderPathToDelete);
                parseFileArray.shift();
            }
        }
        let historiesArray = [];
        parseFileArray.forEach(function (item) {
            let miscFilePath = projectDataPath + "/" + item + "/misc.json";
            let miscInfo = JSON.parse(Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(miscFilePath));
            let historiesObj = { createTime: miscInfo.createTime, tagged: miscInfo.tagged, id: item };
            historiesArray.unshift(historiesObj);
        });
        const historiesFilePath = projectDataPath + "/histories.json";
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(historiesFilePath, JSON.stringify(historiesArray));
        return true;
    }
    _updateSdkReference() {
        // sdk挪到@awade下了，不再放@rdkmaster里
        const srcRoot = `${this.projectPath}/web/src/app/`;
        const files = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["m" /* listFiles */])(srcRoot + '/*.ts', '-R');
        files.forEach(file => {
            const content = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(file)
                .replace(/@rdkmaster\/uid-sdk/g, '@awade/uid-sdk');
            Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(file, content);
        });
        // log.js需要对齐
        let logCode = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])('app/ui-designer/services/legacy/log.js');
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(`${this.projectPath}/server/utils/log.js`, logCode);
        return true;
    }
    updateUserProject() {
        return this._updateHistoryItems() && this._updateSdkReference();
    }
    updateSvd(metaSvd) {
        metaSvd.children && metaSvd.children.forEach(item => {
            this.updateSvd(item);
        });
        if (metaSvd.selector != "jigsaw-icon" && metaSvd.selector != "jigsaw-tag" && metaSvd.selector != "jigsaw-font-loading") {
            return true;
        }
        if (metaSvd.selector == "jigsaw-icon" && metaSvd.inputs.length > 0) {
            metaSvd.inputs.forEach(item => {
                if (item.property == "iconColor" && item.selectedType == "string" && item.value && item.value.initial) {
                    item.selectedType = "AwadeColor";
                    item.value.initial = '"' + item.value.initial + '"';
                }
                if (item.property == "textColor" && item.selectedType == "string" && item.value && item.value.initial) {
                    item.selectedType = "AwadeColor";
                    item.value.initial = '"' + item.value.initial + '"';
                }
            });
        }
        if (metaSvd.selector == "jigsaw-tag" && metaSvd.inputs.length > 0) {
            metaSvd.inputs.forEach(item => {
                if (item.property == "color" && item.selectedType == "string" && item.value && item.value.initial) {
                    item.selectedType = "AwadeColor";
                    item.value.initial = '"' + item.value.initial + '"';
                }
            });
        }
        if (metaSvd.selector == "jigsaw-font-loading" && metaSvd.inputs.length > 0) {
            metaSvd.inputs.forEach(item => {
                if (item.property == "color" && item.selectedType == "string" && item.value && item.value.initial) {
                    item.selectedType = "AwadeColor";
                    item.value.initial = '"' + item.value.initial + '"';
                }
            });
        }
        return true;
    }
})());
updaters.unshift(new (class UpdateToV1_1_3 extends UpdaterBase {
    constructor() {
        super('v1.1.3');
    }
    updateSvd(metaSvd) {
        metaSvd.children && metaSvd.children.forEach(item => {
            this.updateSvd(item);
        });
        if (!metaSvd.styles || !(metaSvd.styles.borderColor || metaSvd.styles.borderRadius || metaSvd.styles.borderWidth)) {
            return true;
        }
        metaSvd.styles.border = metaSvd.styles.border ? metaSvd.styles.border : {};
        if (metaSvd.styles.borderColor) {
            metaSvd.styles.border.border_color = metaSvd.styles.borderColor;
            delete metaSvd.styles.borderColor;
        }
        if (metaSvd.styles.borderRadius) {
            metaSvd.styles.border.border_radius = metaSvd.styles.borderRadius;
            delete metaSvd.styles.borderRadius;
        }
        if (metaSvd.styles.borderWidth) {
            metaSvd.styles.border.border_width = metaSvd.styles.borderWidth;
            delete metaSvd.styles.borderWidth;
        }
        return true;
    }
})());
updaters.unshift(new (class Updater extends UpdaterBase {
    constructor() {
        super('v1.1.2');
    }
    updateSeed() {
        const entryModuleContent = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(`app/ui-designer/compiler/project-seed/web/src/app/entry-module.ts`);
        const targetEntryModule = this.projectPath + '/web/src/app/entry-module.ts';
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(targetEntryModule, entryModuleContent);
        return true;
    }
})());
class UpdateToV1_1_1 extends UpdaterBase {
    constructor() {
        super('v1.1.1');
    }
    updateSeed() {
        const sourceIconfont = `app/ui-designer/web/src/assets/iconfont`;
        const targetIconfont = this.projectPath + '/web/src/built-in-assets/iconfont';
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["a" /* copyDir */])(sourceIconfont, targetIconfont);
        const angularCliContent = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(`app/ui-designer/compiler/project-seed/web/.angular-cli.json`);
        const angularCliRealContent = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(`app/ui-designer/compiler/project-seed/web/.angular-cli.json.real`);
        const targetAngularCli = this.projectPath + '/web/.angular-cli.json';
        const targetAngularCliReal = this.projectPath + '/web/.angular-cli.json.real';
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(targetAngularCli, angularCliContent);
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(targetAngularCliReal, angularCliRealContent);
        return true;
    }
}
/* unused harmony export UpdateToV1_1_1 */

updaters.unshift(new UpdateToV1_1_1());
class UpdateToV1_1_0 extends UpdaterBase {
    constructor() {
        super('v1.1.0');
    }
    updateSvd(metaSvd) {
        metaSvd.children && metaSvd.children.forEach(item => {
            this.updateSvd(item);
        });
        if (metaSvd.selector != "jigsaw-icon") {
            return true;
        }
        if (!metaSvd.styles || !metaSvd.styles.font) {
            return true;
        }
        let font = metaSvd.styles.font;
        if (font.color) {
            let iconColorProp = {
                "property": "iconColor",
                "selectedType": "string",
                "value": {
                    "initial": font.color,
                    "remote": {}
                }
            };
            let textColorProp = {
                "property": "textColor",
                "selectedType": "string",
                "value": {
                    "initial": font.color,
                    "remote": {}
                }
            };
            metaSvd.inputs.push(iconColorProp);
            metaSvd.inputs.push(textColorProp);
            delete font.color;
        }
        if (font.fontSize) {
            let iconSizeProp = {
                "property": "iconSize",
                "selectedType": "number",
                "editorMode": "simple",
                "value": {
                    "initial": font.fontSize,
                    "remote": {}
                }
            };
            let textSizeProp = {
                "property": "textSize",
                "selectedType": "number",
                "editorMode": "simple",
                "value": {
                    "initial": font.fontSize,
                    "remote": {}
                }
            };
            metaSvd.inputs.push(iconSizeProp);
            metaSvd.inputs.push(textSizeProp);
            delete font.fontSize;
        }
        return true;
    }
    updateSeed() {
        return this._updateStyle(this.projectPath) && this._updateRouter(this.projectPath);
    }
    _updateStyle(projectPath) {
        const styleCss = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])('app/ui-designer/compiler/project-seed/web/src/styles.scss');
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(projectPath + '/web/src/styles.scss', styleCss);
        return true;
    }
    _updateRouter(projectPath) {
        // 从种子工程复制app-params-resolver.ts到用户工程目录
        const resolverStr = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])('app/ui-designer/compiler/project-seed/web/src/app/app-params-resolver.ts');
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(projectPath + '/web/src/app/app-params-resolver.ts', resolverStr);
        // 读取用户工程router-config.ts
        const routerConfigStr = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(projectPath + '/web/src/app/router-config.ts');
        let routerConfigArray = routerConfigStr.split('\n');
        // 获取提取字符串的开始行和结尾行位置
        let routesIndex = [];
        routerConfigArray.forEach((line, index) => {
            if (/\*@awade-routers-configurations\*/g.test(line)) {
                routesIndex.push(index);
            }
        });
        const routesArray = routerConfigArray.slice(routesIndex[0] + 1, routesIndex[1]);
        let newRoutesArray = [];
        // 路由添加resolve
        routesArray.forEach((line, index) => {
            let newLine;
            if (/path: ''/g.test(line)) {
                newLine = line.replace(/path: ''/g, "path: '', resolve: {appQueryParamsService: AppQueryParamsService}");
            }
            else if (/path: '\*\*'/g.test(line)) {
                newLine = line.replace(/path: '\*\*'/g, "path: '**', resolve: {appQueryParamsService: AppQueryParamsService}");
            }
            else {
                newLine = line;
            }
            newRoutesArray.push(newLine);
        });
        // 删除原路由配置
        routerConfigArray.splice(routesIndex[0] + 1, routesIndex[1] - routesIndex[0] - 1);
        // 插入新路由配置
        routerConfigArray.splice(routesIndex[0] + 1, 0, ...newRoutesArray);
        // 添加import
        routerConfigArray.splice(0, 0, ...['import {AppQueryParamsService} from "./app-params-resolver";']);
        // 添加providers
        let pos = this._getProvidersInsertPos(routerConfigArray);
        routerConfigArray.splice(pos, 0, ...['    providers: [AppQueryParamsService],']);
        const newRouterConfigStr = routerConfigArray.join('\n');
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(projectPath + '/web/src/app/router-config.ts', newRouterConfigStr);
        return true;
    }
    _getProvidersInsertPos(routerConfig) {
        for (let i = 0; i < routerConfig.length; i++) {
            if (/RouterModule.forRoot/g.test(routerConfig[i])) {
                return i + 1;
            }
        }
    }
}
/* unused harmony export UpdateToV1_1_0 */

updaters.unshift(new UpdateToV1_1_0());
// -----------------------------------------------------------------------------------------------------------------
function upgradeProject(user, project) {
    // 补全老版本的svd的版本信息
    addVersionToOldSvd(user, project);
    // 升级种子工程、应用工程均会改动文件，只有他们升级成功了
    // 才去动svd，尽量让升级失败时，不会对svd有意外冲击
    return upgradeSeedAndProject(user, project) && upgradeSvd(user, project);
}
function addVersionToOldSvd(user, project) {
    const projectPath = toProjectPath(user, project);
    const projectInfo = JSON.parse(Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(projectPath + '/web/package.json'));
    const curVersion = projectInfo.version == '1.0.0' ? '1.0.0-beta12' : projectInfo.version;
    let projDataPath = toSavingsPath(user, project + "/histories");
    let curSvdPath = projDataPath + '/' + getCursor(projDataPath);
    let projectData = getSVDFileContent(curSvdPath);
    projectData.forEach(data => {
        const svd = JSON.parse(data.content);
        if (svd.config && svd.config.version)
            return;
        svd.config = svd.config ? svd.config : {};
        svd.config.version = curVersion;
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(curSvdPath + '/' + data.svd + '.svd', JSON.stringify(svd));
    });
}
function upgradeSeedAndProject(user, project) {
    const projectPath = toProjectPath(user, project);
    const projectInfo = JSON.parse(Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(projectPath + '/web/package.json'));
    if (projectInfo.version == '1.0.0') {
        // 这个升级器只从beta12开始升级，而v1.0.0是所有seed工程里的版本号，认为是无效的
        // 在升级之后，需要修改package.json里的版本号到升级后的版本号
        projectInfo.version = '1.0.0-beta12';
    }
    console.log('updater: target project version:', projectInfo.version);
    if (!checkVersion(projectInfo.version)) {
        console.error(`the current project version is newer than the current awade version [${awadeVersion}], unable to upgrade!`);
        return false;
    }
    const projectVersion = toVersionValue(projectInfo.version);
    let targetUpdaters = updaters.filter(u => u.versionValue > projectVersion);
    let result = true;
    if (targetUpdaters.length > 0) {
        const toVersion = targetUpdaters[targetUpdaters.length - 1].version;
        result = targetUpdaters.reduce((success, updater) => success && upgradeProjectFiles(updater, user, project), true);
        if (result) {
            // 取出最后一个升级器的版本
            projectInfo.version = toVersion;
            Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(projectPath + '/web/package.json', JSON.stringify(projectInfo, null, '  '));
        }
        console.log(`upgrade files of project ${projectPath} to version ${toVersion}, result: ${result}`);
    }
    return result;
}
function checkVersion(projectVersion) {
    return awadeVersion >= (typeof projectVersion === 'string' ? toVersionValue(projectVersion) : projectVersion);
}
function upgradeSvd(user, project) {
    let projDataPath = toSavingsPath(user, project + "/histories");
    let projectData = getSVDFileContent(projDataPath + '/' + getCursor(projDataPath));
    let result = true;
    projectData.forEach(data => {
        if (!result) {
            return;
        }
        data.metaSVD = JSON.parse(data.content);
        if (!data.metaSVD.config || !data.metaSVD.config.version) {
            console.error('invalid svd data format!');
            result = false;
            return;
        }
        const svdVersion = toVersionValue(data.metaSVD.config.version);
        if (!checkVersion(svdVersion)) {
            console.error(`the current svd file version [${svdVersion}] is newer than the current awade version [${awadeVersion}], unable to upgrade!`);
            result = false;
            return;
        }
        let targetUpdaters = updaters.filter(u => u.versionValue > svdVersion);
        result = targetUpdaters.reduce((success, updater) => success && upgradeProjectSvd(updater, user, project, data), true);
        delete data.metaSVD;
    });
    if (!result) {
        console.info("upgradeProject: update svd error!");
    }
    return result;
}
function toProjectPath(user, project) {
    return `app/ui-designer/pub/${user}/${project}`;
}
function toSavingsPath(user, project) {
    return `app/ui-designer/savings/${user}/${project}`;
}
function toVersionValue(version) {
    const match = version.match(/v?(\d+)\.(\d+)\.(\d+)(-beta(\d+))?/);
    const mainVersion = parseInt(match[1]);
    const subVersion = parseInt(match[2]);
    const patchVersion = parseInt(match[3]);
    const statusVersion = parseInt(match[5] || '99');
    return mainVersion * 1000000 + subVersion * 10000 + patchVersion * 100 + statusVersion;
}
function upgradeProjectFiles(updater, user, project) {
    updater.user = user;
    updater.project = project;
    console.log(`upgrading seed to version ${updater.version}`);
    let seedResult;
    try {
        seedResult = updater.updateSeed();
    }
    catch (e) {
        console.error('upgrade seed error:', e.stack);
        return false;
    }
    console.log(`upgrading user projects to version ${updater.version}`);
    let userProjectResult;
    try {
        userProjectResult = updater.updateUserProject();
    }
    catch (e) {
        console.error('upgrade user projects error:', e.stack);
        return false;
    }
    return seedResult && userProjectResult;
}
/**
 * 每个svd有自己的版本号，需要根据每个svd文件检索出合适的升级器独立升级
 * 详见这个issue https://gitlab.zte.com.cn/10045812/ng-eval/issues/1039
 */
function upgradeProjectSvd(updater, user, project, data) {
    updater.user = user;
    updater.project = project;
    console.log(`upgrading svd ${data.svd} to version: ${updater.version}`);
    let result = false;
    try {
        result = updater.updateSvd(data.metaSVD);
        if (result) {
            data.metaSVD.config.version = updater.version;
            data.content = JSON.stringify(data.metaSVD, null, '  ');
        }
    }
    catch (e) {
        console.error('upgrade svd error:', e.stack);
        return false;
    }
    // 所有的svd都升级成功了，才去修改他们，否则只要有一个升级失败，就不动他们；
    if (result) {
        const savingsPath = toSavingsPath(user, project);
        const cursor = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(`${savingsPath}/histories/cursor`);
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(`${savingsPath}/histories/${cursor}/${data.svd}.svd`, data.content);
    }
    return true;
}
function getSVDFileContent(filePath) {
    let svdFiles = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["m" /* listFiles */])(filePath + '/*.svd');
    let svdData = [];
    svdFiles.forEach((file) => {
        let svd = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(file);
        let svdFileName = file.match(/[\\\/]?([^\\\/]+)\.svd$/)[1];
        svdData.push({ svd: svdFileName, content: svd });
        console.info('svd file found: ' + file);
    });
    return svdData;
}
function getCursor(projDataPath) {
    let cursorPath = projDataPath + "/cursor";
    let cursorContent = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(cursorPath);
    let cursorValue = parseInt(cursorContent);
    if (!cursorContent || isNaN(cursorValue)) {
        cursorValue = 1;
    }
    return cursorValue;
}


/***/ }),

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = fixPath;
/* harmony export (immutable) */ __webpack_exports__["a"] = copyDir;
/* harmony export (immutable) */ __webpack_exports__["b"] = copyFile;
/* unused harmony export saveMiscInfo */
/* unused harmony export getMiscInfo */
/* harmony export (immutable) */ __webpack_exports__["t"] = updateAppPageTitle;
/* harmony export (immutable) */ __webpack_exports__["r"] = toSavingPath;
/* harmony export (immutable) */ __webpack_exports__["q"] = toPublishPath;
/* harmony export (immutable) */ __webpack_exports__["j"] = isFolderExist;
/* harmony export (immutable) */ __webpack_exports__["l"] = isProjDataFolderExist;
/* unused harmony export isProjPublishFolderExist */
/* unused harmony export createFolder */
/* harmony export (immutable) */ __webpack_exports__["c"] = deleteDir;
/* unused harmony export renameFolder */
/* unused harmony export deleteSavingPath */
/* unused harmony export getTemplatePath */
/* unused harmony export getPathLastLevelName */
/* unused harmony export getProjectLatestArchiveNo */
/* unused harmony export copyResult */
/* harmony export (immutable) */ __webpack_exports__["s"] = unzip;
/* harmony export (immutable) */ __webpack_exports__["n"] = moveFile;
/* harmony export (immutable) */ __webpack_exports__["g"] = getRouters;
/* unused harmony export getProjectData */
/* harmony export (immutable) */ __webpack_exports__["e"] = getCursor;
/* harmony export (immutable) */ __webpack_exports__["o"] = readString;
/* harmony export (immutable) */ __webpack_exports__["p"] = saveFile;
/* harmony export (immutable) */ __webpack_exports__["h"] = getSVDFileContent;
/* harmony export (immutable) */ __webpack_exports__["f"] = getI18n;
/* harmony export (immutable) */ __webpack_exports__["i"] = getSharedData;
/* unused harmony export cleanSharedData */
/* unused harmony export deleteFiles */
/* harmony export (immutable) */ __webpack_exports__["k"] = isPathExist;
/* unused harmony export isFileExist */
/* unused harmony export isDirectoryExist */
/* unused harmony export importZipFile */
/* harmony export (immutable) */ __webpack_exports__["m"] = listFiles;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__limited_shell__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


const fs = Object(__WEBPACK_IMPORTED_MODULE_0__limited_shell__["b" /* nodeRequire */])('fs');
function fixPath(path) {
    return path.replace(/\\/g, '/');
}
function copyDir(source, destination, isFile) {
    source = isFile ? source : source + '/.';
    source = fixPath(source);
    destination = fixPath(destination);
    let mdResult = Object(__WEBPACK_IMPORTED_MODULE_0__limited_shell__["a" /* limitedShell */])(`mkdir -p ${destination}`);
    let cpResult = Object(__WEBPACK_IMPORTED_MODULE_0__limited_shell__["a" /* limitedShell */])(`cp -r ${source} ${destination}`);
    return mdResult.code == 0 && cpResult.code == 0;
}
function copyFile(source, destination) {
    source = fixPath(source);
    destination = fixPath(destination);
    let cpResult = Object(__WEBPACK_IMPORTED_MODULE_0__limited_shell__["a" /* limitedShell */])(`cp ${source} ${destination}`);
    return cpResult.code == 0;
}
function saveMiscInfo(folderPath, infoName, infoContent) {
    let miscObj = {};
    miscObj[infoName] = infoContent;
    if (isFolderExist(folderPath, "misc.json")) {
        let content = readString(folderPath + "/misc.json");
        if (content) {
            miscObj = JSON.parse(content);
            miscObj[infoName] = infoContent;
        }
    }
    console.info("utils.file.saveMiscInfo: " + infoName + ": " + infoContent);
    return saveFile(folderPath + "/misc.json", JSON.stringify(miscObj));
}
function getMiscInfo(folderPath, key) {
    let value = 9999;
    if (isFolderExist(folderPath, "misc.json")) {
        let content = readString(folderPath + "/misc.json");
        if (content) {
            let miscObj = JSON.parse(content);
            value = miscObj[key] ? miscObj[key] : 9999;
        }
    }
    console.info("utils.file.getMiscInfo: " + key + ": " + value);
    return value;
}
function updateAppPageTitle(user, project, title) {
    let indexPath = toPublishPath(user, project) + '/web/src/index.html';
    let code = readString(indexPath);
    code = code.replace(/<title[\s\w='><-]*[\W]*[\w\s><]*(\/title>){1}/g, "<title>" + title + "</title>");
    return saveFile(indexPath, code);
}
function toSavingPath(user, path) {
    return 'app/ui-designer/savings/' + user + '/' + path;
}
function toPublishPath(user, path) {
    return 'app/ui-designer/pub/' + user + '/' + path;
}
function isFolderExist(path, folderOrFileName) {
    if (!path || !folderOrFileName) {
        return false;
    }
    let projFolderList = listFiles(path);
    for (let i = 0; i < projFolderList.length; i++) {
        if (projFolderList[i] == folderOrFileName) {
            return true;
        }
    }
    return false;
}
function isProjDataFolderExist(user, project) {
    if (!user || !project) {
        return false;
    }
    let projFolderList = listFiles(toSavingPath(user, ""));
    for (let i = 0; i < projFolderList.length; i++) {
        if (projFolderList[i] == project) {
            return true;
        }
    }
    return false;
}
function isProjPublishFolderExist(user, project) {
    if (!user || !project) {
        return false;
    }
    let projPubFolderList = listFiles(toPublishPath(user, ""));
    for (let i = 0; i < projPubFolderList.length; i++) {
        if (projPubFolderList[i] == project) {
            return true;
        }
    }
    return false;
}
/*参数：
 filePath 字符串。需要保存的文件路径，可使用路径宏简化路径。
 content 字符串。需要保存的内容。
 append 布尔，默认值是false。是否追加到已有文件的末尾。
 encoding 字符串，默认值是utf-8。写文件的编码，常用备选的是utf-8/gb2312/gbk。
    返回：true/false对应写入成功/失败。
*/
function createFolder(filePath, content, append, encoding) {
    let result;
    try {
        /* File.save函数创建的最后一级只能是文件，所以这里先创建出来路径再把里面的文件删除 */
        let tempPath = filePath + '/' + 'emptyfile';
        result = File.save(tempPath, content, append, encoding);
        if (!result) {
            return false;
        }
        result = deleteDir(tempPath) == 0;
    }
    catch (err) {
        console.error(err.stack);
    }
    return result;
}
function deleteDir(path) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__limited_shell__["a" /* limitedShell */])(`rm -rf ${path}`).code;
}
function renameFolder(path, origProjName, newProjName) {
    let renResult = Object(__WEBPACK_IMPORTED_MODULE_0__limited_shell__["a" /* limitedShell */])(`mv ${path + origProjName} ${path + newProjName}`);
    console.info("renameFolder result:", renResult.code);
    return renResult.code;
}
function deleteSavingPath(user, projectName) {
    return deleteDir(toSavingPath(user, projectName));
}
function getTemplatePath(path) {
    return 'app/ui-designer/shared-templates/' + path;
}
function getPathLastLevelName(path) {
    let strList = path.split(/[/]|[\\]/);
    return strList[strList.length - 1];
}
function getProjectLatestArchiveNo(projectPath) {
    let archiveNoList = listFiles(projectPath + "/histories").filter(file => file.match(/^\d+$/));
    let MaxArchiveNo = 0;
    archiveNoList.forEach((archiveNo) => {
        if (parseInt(archiveNo) > MaxArchiveNo) {
            MaxArchiveNo = parseInt(archiveNo);
        }
    });
    return MaxArchiveNo == 0 ? 1 : MaxArchiveNo;
}
//用于File.copy的返回值，暂时没用
function copyResult(copyCode) {
    switch (copyCode) {
        case 0:
            return { "code": 0, "result": "Create project success!" };
        case 1:
            return { "code": 1, "result": "Parameter is invalid!" };
        case 2:
            return { "code": 2, "result": "Source Path/files is not exists!" };
        case 3:
            return { "code": 3, "result": "Fail to open the source file stream!" };
        case 4:
            return { "code": 4, "result": "Fail to open the target file stream!" };
        case 5:
            return { "code": 5, "result": "Fail to write the target file!" };
        default:
            return { "code": 6, "result": "Fail: other reason!" };
    }
}
function unzip(zipFile, destination) {
    zipFile = fixPath(zipFile);
    destination = destination && fixPath(destination);
    let uzResult = Object(__WEBPACK_IMPORTED_MODULE_0__limited_shell__["a" /* limitedShell */])(`unzip ${zipFile} -d ${destination}`);
    console.info("file-system.ts unzip - result:", uzResult.code);
    return uzResult.code == 0;
}
function moveFile(source, destination) {
    source = fixPath(source);
    destination = fixPath(destination);
    let mvResult = Object(__WEBPACK_IMPORTED_MODULE_0__limited_shell__["a" /* limitedShell */])(`mv ${source} ${destination}`);
    console.info("moveFile -- mvResult:" + mvResult.code);
    return mvResult.code == 0;
}
function getRouters(filePath) {
    const content = readString(filePath);
    return content ? JSON.parse(content) : {
        "routers": [
            {
                "path": "",
                "component": "AppComponent"
            }
        ],
        "guards": []
    };
}
function getProjectData(user, project, cursor) {
    let value = cursor;
    let projDataPath = toSavingPath(user, project + "/histories");
    if (!cursor || isNaN(parseInt(cursor))) {
        let cursor = getCursor(projDataPath);
        if (cursor != -1) {
            value = String(cursor);
        }
        else {
            console.error("utils.file.getProjectData: reading or parsing cursor value error!");
            return null;
        }
    }
    let projFolderToRead = projDataPath + '/' + value;
    let svdFilesData = getSVDFileContent(projFolderToRead);
    let i18n = getI18n(projFolderToRead + '/i18n.json');
    let routers = getRouters(projFolderToRead + '/routers.json');
    let deployShell = File.readString(projFolderToRead + '/publish.sh');
    let sharedData = getSharedData(projFolderToRead);
    return { project: project, data: svdFilesData, i18n: i18n, routers: routers, deployShell: deployShell, sharedData };
}
function getCursor(projectPath) {
    let cursorPath = projectPath + "/cursor";
    let cursorContent = readString(cursorPath);
    let cursorValue = parseInt(cursorContent);
    if (!cursorContent || isNaN(cursorValue)) {
        console.error("getCursor: parsing cursor error!");
        return -1;
    }
    return cursorValue;
}
function readString(path) {
    if (__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].isInRDK) {
        return File.readString(path);
    }
    else if (__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].isInNode) {
        return fs.readFileSync(path).toString();
    }
}
function saveFile(path, content, encoding) {
    if (__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].isInRDK) {
        return File.save(path, content, false, encoding);
    }
    else if (__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].isInNode) {
        try {
            const dirPath = path.slice(0, path.lastIndexOf('/'));
            if (!fs.existsSync(dirPath)) {
                Object(__WEBPACK_IMPORTED_MODULE_0__limited_shell__["a" /* limitedShell */])(`mkdir -p ${dirPath}`);
            }
            fs.writeFileSync(path, content, encoding);
            return true;
        }
        catch (e) {
            console.error('save file in node shell failed: ', e);
            return false;
        }
    }
}
function getSVDFileContent(filePath) {
    let svdFiles = listFiles(filePath + '/*.svd');
    let svdData = [];
    svdFiles.forEach((file) => {
        let svd = readString(file);
        let svdFileName = file.match(/[\\\/]?([^\\\/]+)\.svd$/)[1];
        svdData.push({ svd: svdFileName, content: svd });
        console.info('svd file found: ' + file);
    });
    return svdData;
}
function getI18n(filePath) {
    let content;
    if (isPathExist(filePath)) {
        content = readString(filePath);
    }
    return content ? JSON.parse(content) : {
        "field": [
            "field",
            "zh",
            "en",
            "isUsed"
        ],
        "header": [
            "字段",
            "中文",
            "英文",
            "是否启用"
        ],
        "data": []
    };
}
function getSharedData(folderPath) {
    if (!isFolderExist(folderPath, 'shared-data.json'))
        return {};
    let sharedDataStr = readString(folderPath + '/shared-data.json');
    const sharedData = sharedDataStr ? JSON.parse(sharedDataStr) : {};
    return sharedData;
}
function cleanSharedData(user, project, cursor) {
    let value = cursor;
    let projDataPath = toSavingPath(user, project + "/histories");
    if (!cursor || isNaN(parseInt(cursor))) {
        let cursor = getCursor(projDataPath);
        if (cursor != -1) {
            value = String(cursor);
        }
        else {
            console.error("cleanSharedData: reading or parsing cursor value error!");
            return null;
        }
    }
    let projFolderToRead = projDataPath + '/' + value;
    let svdFilesData = getSVDFileContent(projFolderToRead);
    let sharedData = getSharedData(projFolderToRead);
    let allSvdContent = '';
    svdFilesData.forEach((svdData) => {
        allSvdContent += svdData.content;
    });
    let newSharedData = {};
    Object.keys(sharedData).map((hashId) => {
        if (allSvdContent.search(hashId) !== -1) {
            newSharedData[hashId] = sharedData[hashId];
        }
    });
    if (!File.save(projFolderToRead + '/shared-data.json', JSON.stringify(newSharedData, null, '  '), false)) {
        console.error("cleanSharedData: File.save function return fail: saving shared-data file content");
    }
}
function deleteFiles(pathToDelete) {
    pathToDelete.forEach(deleteDir);
}
function isPathExist(path) {
    if (__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].isInRDK) {
        let JavaFile = Java.type('java.io.File');
        let ckFile = new JavaFile(path);
        return !!ckFile.exists();
    }
    else {
        return fs.existsSync(path);
    }
}
function isFileExist(path) {
    if (__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].isInRDK) {
        let JavaFile = Java.type('java.io.File');
        let ckFile = new JavaFile(path);
        return ckFile.exists() && ckFile.isFile();
    }
    else {
        return fs.statSync(path).isFile();
    }
}
function isDirectoryExist(path) {
    if (__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].isInRDK) {
        let JavaFile = Java.type('java.io.File');
        let ckFile = new JavaFile(path);
        return ckFile.exists() && ckFile.isDirectory();
    }
    else {
        return fs.statSync(path).isDirectory();
    }
}
function importZipFile(initPath, zipFileName, currentProjectName, userName) {
    let unzipResult = unzip(initPath + '/' + zipFileName, initPath);
    if (!unzipResult) {
        console.error("_file._importZipFile: utils.file.unzip return fail: unzip project file");
        return null;
    }
    // 获取导入的zip包中的project-name
    let projectName = currentProjectName;
    let temp = listFiles(initPath + '/app');
    if (temp && temp.length == 1) {
        projectName = temp[0];
    }
    // 拷贝 app/project-name/source 下的文件至 initPath
    copyDir(initPath + '/app/' + projectName + '/source', initPath);
    let tempFiles = listFiles(initPath + '/app/' + projectName + '/source/*');
    let sourceFiles = [];
    if (tempFiles) {
        tempFiles.forEach(file => {
            let m = file.match(/^(.+)[\\\/]([^\\\/]+\.svd|i18n\.json|routers\.json|misc\.json)$/);
            m && sourceFiles.push(initPath + '/' + m[2]);
        });
    }
    // 拷贝资源文件 app/project-name/web-source/src/awade-assets 至 pub目录
    let webDir = 'app/ui-designer/pub/' + userName + '/' + currentProjectName + '/web/src/awade-assets';
    let copyResult = copyDir(initPath + '/app/' + projectName + '/web-source/src/awade-assets', webDir);
    if (!copyResult) {
        console.error("_file._importZipFile: utils.file.copyDir return fail: copying awade-assets files to pub folder");
    }
    // 删除临时文件
    deleteDir(initPath + '/app');
    deleteDir(initPath + '/' + zipFileName);
    deleteDir(initPath + '/meta-info.json');
    return sourceFiles;
}
function listFiles(filePattern, params = '') {
    const res = Object(__WEBPACK_IMPORTED_MODULE_0__limited_shell__["a" /* limitedShell */])(`ls ${params} ${filePattern}`);
    return res.code == 0 ? res.output.trim().split(/\s+/) : [];
}


/***/ }),

/***/ 5:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = limitedShell;
/* harmony export (immutable) */ __webpack_exports__["b"] = nodeRequire;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

console.log(`runtime environment statistic: isInRDK=${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInRDK}, isInNode=${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInNode},`, `isInBrowser=${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInBrowser}, isInWindows=${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInWindows}`);
// node runtime
const childProcess = nodeRequire('child_process');
const shelljs = nodeRequire('shelljs');
const path = nodeRequire('path');
// rdk runtime
const BufferedReader = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInRDK ? Java.type('java.io.BufferedReader') : null;
const JavaFile = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInRDK ? Java.type('java.io.File') : null;
const InputStreamReader = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInRDK ? Java.type('java.io.InputStreamReader') : null;
const ProcessBuilder = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInRDK ? Java.type('java.lang.ProcessBuilder') : null;
if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInNode) {
    shelljs.cd(path.join(__dirname, '../../../../../../'));
}
const mockShellPrograms = getMockShellPrograms();
function limitedShell(cmd, cwd = './') {
    cmd = fixCommand(cmd);
    console.log('limited shell:', cmd, ', cwd:', cwd);
    let result;
    if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInRDK) {
        result = rdkShell(cmd, cwd);
    }
    else if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInNode) {
        result = nodeShell(cmd, cwd);
    }
    else {
        throw new Error('limitedShell supports ONLY the runtime of RDK and node.');
    }
    if (result.code != 0) {
        console.error('limited shell:', cmd, ', result:', result);
    }
    return result;
}
function nodeShell(cmd, cwd) {
    let result = { code: 0 };
    try {
        result.output = childProcess.execSync(cmd, { cwd }).toString();
    }
    catch (e) {
        result.code = e.status;
        result.output = e.stderr.toString();
    }
    return result;
}
function rdkShell(cmd, cwd) {
    let pb = new ProcessBuilder(__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInWindows ? ['cmd', '/c', cmd] : ['sh', '-c', cmd]);
    if (!!cwd) {
        pb.directory(new JavaFile(cwd));
    }
    //merge the error output with the standard output
    pb.redirectErrorStream(true);
    let process = pb.start();
    let result = { code: 0 }, stdout;
    try {
        const encoding = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInWindows ? "GB2312" : "UTF-8";
        stdout = new BufferedReader(new InputStreamReader(process.getInputStream(), encoding));
    }
    catch (e) {
        result.code = 1;
        result.output = "create std out stream error, detail: " + e.message;
        return result;
    }
    let line;
    result.output = '';
    while (true) {
        line = stdout.readLine();
        if (line === null) {
            break;
        }
        result.output += line + '\n';
    }
    result.code = process.waitFor();
    return result;
}
function fixCommand(cmd) {
    return cmd.replace(/^\s*([^\s]*?)\s+(.*)/, (found, program, segment) => {
        program = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInWindows ? program.replace(/\//g, '\\') : program;
        program = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInWindows && mockShellPrograms.find(p => p == program) ?
            `tools\\mock-shell\\usr\\bin\\${program}` : program;
        return `${program} ${segment}`;
    });
}
function getMockShellPrograms() {
    if (!__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInWindows) {
        return [];
    }
    const programs = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInRDK ?
        File.list('tools/mock-shell/usr/bin', false, /.+\.exe$/i) :
        shelljs.ls('tools/mock-shell/usr/bin/*.exe');
    return programs.map(program => program.replace(/.*[\\\/](.*?)\.exe$/, '$1'));
}
function nodeRequire(module) {
    if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInNode) {
        try {
            // 使用这个方式给 node js 的require起个别名，
            // 这样 angular-cli / webpack 等编译器才不会跑去捞这些只能在node里跑的库
            let nodeRequire = eval('require');
            return nodeRequire(module);
        }
        catch (e) {
        }
    }
    return null;
}


/***/ })

/******/ });