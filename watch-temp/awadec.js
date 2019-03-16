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
/******/ 	return __webpack_require__(__webpack_require__.s = 28);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("@awade/basics");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class GeneralAjaxInput extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"] {
    coder(metaData, rawValue, env) {
        const [memberReference, memberDefineCode] = this.getMemberCode(metaData);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (!__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData) && !__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData))
            return codes;
        codes.import = [{ module: 'TableData', from: `${metaData.importFrom}` }];
        if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData)) {
            const [localParameterName, localParameterDefine] = this.getLocalParameterCode(metaData, initialData);
            codes.ctor += `
                ${localParameterDefine}
                ${memberReference} = TableData.isTableData(${localParameterName}) ? TableData.toArray(${localParameterName}) : ${localParameterName};
            `;
        }
        if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData)) {
            let options = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].generateRequestOptions(remoteData);
            const subscribers = `
                this._subscribers.push(this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, $event => {
                    this.http.request("${remoteData.method}", "${remoteData.url}", {${options}})${remoteData.dataReviser ? '.map(' + remoteData.dataReviser + ')' : ''}.subscribe((data: any) => {
                        ${memberReference} = TableData.isTableData(data) ? TableData.toArray(data) : data;
                        this.eventBus.emit('${metaData.id}_${this.property}_loaded', data);
                    });
                }));
            `;
            codes.ctor += `
                ${subscribers}
            `;
        }
        return codes;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GeneralAjaxInput;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeLayout extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'awade-layout';
        this.tagName = 'awade-layout';
        this.UNIT_LENGTH = 8;
        this._children = [];
        this.excludedProperties.push('UNIT_LENGTH');
        this.operations = [
            {
                ignores: ['uid-operation-delete']
            }
        ];
    }
    getLabel() {
        return 'this';
    }
    getAttributeHtml(svd) {
        let attributes = [];
        svd.inputs && svd.inputs.forEach(input => attributes.push(input.toAttribute(svd)));
        svd.outputs && svd.outputs.forEach(output => attributes.push(output.toAttribute(svd)));
        svd.events && svd.events.forEach(event => attributes.push(event.toAttribute(svd)));
        return `${attributes.join(' ')}  #${svd.id} agent="${svd.agentId}" `;
    }
    htmlCoder(svd, env) {
        const tag = env && env.target == 'dev' ? this.getTagName(svd) : 'div';
        //为了适用垂直响应的情况
        let styleStr = 'height:100%;';
        if (svd.layout && svd.layout.minWidth) {
            styleStr += `min-height: ${svd.layout.minWidth};`;
        }
        if (svd.layout && svd.layout.minHeight) {
            styleStr += `min-height: ${svd.layout.minHeight};`;
        }
        // 编辑态时不让样式影响网格画布，但预览时要正常放出来
        let htmlStr = `<${tag} ${this.getAttributeHtml(svd)} ${env.target == 'dev' ? ` style='height:100%;'` : ` class="${svd.id}_class awade-layout" style='${styleStr}'`}>`;
        let membersDefine = {
            ngStyle: '',
            members: []
        };
        if (svd.children && svd.children.length > 0) {
            if (env && env.target == 'dev') {
                htmlStr += this.absoluteLayout(svd.children, { env: env, membersDefine: membersDefine }, true);
            }
            else {
                htmlStr += this.scalableLayout(svd.children, { env: env, membersDefine: membersDefine });
            }
        }
        htmlStr += `</${tag}>`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
    scalableLayout(svds, data) {
        let copiedSvds = this.simplifyAndCopy(svds);
        this.regroupOverlaps(copiedSvds, data);
        const stickySvds = copiedSvds.filter(svd => !!svd.sticky);
        copiedSvds = copiedSvds.filter(svd => !svd.sticky);
        const matrix = this.toMatrix(copiedSvds);
        this.removeUnslicablesScalability(matrix);
        return this.scalableLayoutDo(matrix, data, 'row', stickySvds);
    }
    // 无视尺寸的响应性，直接生成绝对布局代码了，无论是否可以再切分的块，都可以采用这个方式布局
    absoluteLayout(svds, data, keepBorder = false) {
        const copiedSvds = this.simplifyAndCopy(svds);
        let left = Infinity, top = Infinity;
        if (keepBorder) {
            left = 0;
            top = 0;
        }
        else {
            copiedSvds.forEach(svd => {
                left = Math.min(svd.left, left);
                top = Math.min(svd.top, top);
            });
        }
        // 开发模式下画布是不产生滚动条的，滚动条由父元素.awade-layout-container产生
        let html = `<div class="awade-layout" style="position:relative; width:100%; height:100%;overflow: hidden;min-height: inherit;">\n`;
        copiedSvds.forEach((svd, index) => {
            if (svd.origin.selector == 'jigsaw-drawer') {
                html += this.getStickyLayout(svd, data);
            }
            else {
                html += this.getAbsoluteDiv(svd, svd.left - left, svd.top - top, svd.width, svd.height, index, data);
            }
        });
        html += `</div>`;
        return html;
    }
    getStickyLayout(svd, data) {
        let tempMembersDefine = {
            ngStyle: '',
            members: []
        };
        const itemHtmlCoder = svd.origin.htmlCoder.apply(svd.origin, [svd.origin, data.env]);
        data.membersDefine.members.push(itemHtmlCoder.member);
        data.membersDefine.members = data.membersDefine.members.concat(tempMembersDefine.members);
        return `
            ${itemHtmlCoder.htmlStr}
        `;
    }
    scalableLayoutDo(matrix, data, direction = 'row', stickySvds) {
        let html = '';
        if (matrix && matrix.length) {
            const separator = this.checkSeparator(matrix);
            if (separator) {
                const size = direction == 'column' ?
                    `min-height:${separator.height}px; max-height:${separator.height}px;` :
                    `min-width:${separator.width}px; max-width:${separator.width}px;`;
                return `<div style="${size}"></div>`;
            }
            const [blocks, childDirection] = this.slice(matrix);
            const slicable = blocks.length > 1;
            let sizeAndGrow = this.calcSizeAndGrow(matrix, direction, slicable);
            if (!slicable) {
                // 无法继续切下去，此时可能是只剩下一块了，也可能剩下多块
                return this.layoutUnslicable(matrix, sizeAndGrow, data);
            }
            const flexDirection = !!childDirection ? `flex-direction:${childDirection};` : '';
            html += `<div style="display:flex; ${flexDirection} ${sizeAndGrow}">\n`;
            blocks.forEach(block => {
                html += this.scalableLayoutDo(block, data, childDirection) + '\n';
            });
        }
        else {
            html += `<div style="display:flex;">\n`;
        }
        if (stickySvds) {
            stickySvds.forEach(svd => {
                html += this.getStickyLayout(svd, data);
            });
        }
        html += '</div>';
        return html;
    }
    layoutUnslicable(matrix, sizeAndGrow, data) {
        let html;
        // 只给外包div加style的 visible 和display的绑定
        let tempMembersDefine = {
            ngStyle: '',
            members: [],
            metaStyle: ''
        };
        if (this.containsMultipleBlocks(matrix)) {
            // 不止一块，那就无视尺寸的响应性，直接生成绝对布局代码了
            const processedSvds = [];
            html = `<div style="position:relative; width:100%; height:100%;">\n`;
            // 从左到右，从上到下遍历，在某个坐标下每发现一个新的svd，则此坐标必然是该svd的左上角坐标
            matrix.forEach((row, top) => {
                row.forEach((svd, left) => {
                    if (!svd || processedSvds.find(s => s === svd)) {
                        return;
                    }
                    html += this.getAbsoluteDiv(svd, left, top, svd.width, svd.height, left, data);
                    processedSvds.push(svd);
                });
            });
            html += `</div>`;
        }
        else {
            // 只有一块，那就不需要生成绝对布局代码了
            const svd = matrix[0][0];
            const itemHtmlCoder = svd.origin.htmlCoder.apply(svd.origin, [svd.origin, data.env]);
            // 处理控件的显示隐藏样式，要加载外层的div上
            let originSvd = svd.origin;
            if (originSvd instanceof Array && originSvd.length > 0) {
                // 重叠的控件，取层级最低的，也就是最下面的那个控件的，且重叠了，样式会在绝对布局里面加
                originSvd = originSvd[0];
            }
            else {
                //没有重叠，样式直接在相对布局里面加
                originSvd.getMetaStyle(originSvd, data.env, tempMembersDefine, 'flex');
            }
            data.membersDefine.members.push(itemHtmlCoder.member);
            data.membersDefine.members = data.membersDefine.members.concat(tempMembersDefine.members);
            html = itemHtmlCoder.htmlStr;
            sizeAndGrow += tempMembersDefine.metaStyle ? tempMembersDefine.metaStyle : `;display:flex;overflow:hidden;` + `justify-content:${svd.justify_content || 'flex-start'};align-items:${svd.align_items || 'flex-start'}`;
        }
        return `<div style="${sizeAndGrow}" ${tempMembersDefine.ngStyle}>\n${html}\n</div>`;
    }
    // 将包含多个独立块且无法切分的所有块的响应性去掉
    removeUnslicablesScalability(matrix) {
        const [blocks,] = this.slice(matrix);
        if (blocks.length > 1) {
            blocks.forEach(b => this.removeUnslicablesScalability(b));
            return;
        }
        if (!this.containsMultipleBlocks(matrix)) {
            return;
        }
        matrix.forEach(row => row.forEach(svd => svd && (svd.scaleDirection = 'none')));
    }
    slice(matrix) {
        const verBlocks = this.verSlice(matrix);
        const horBlocks = this.horSlice(matrix);
        if (verBlocks.length == 1 && horBlocks.length == 1) {
            return [[matrix], ''];
        }
        const blocks = horBlocks.length == 1 ? verBlocks : horBlocks;
        const direction = horBlocks.length == 1 ? 'row' : 'column';
        return [blocks, direction];
    }
    verSlice(matrix) {
        const borders = [];
        const columns = matrix[0] != undefined ? matrix[0].length : 0;
        for (let col = 1; col < columns; col++) {
            // 左右两边有svd的，不能为同一个svd（有组件跨越的不能切）
            // 两列能找到左右两边不等的单元格（左右两边都相等就没必要切了）
            if (!matrix.find(row => !!row[col] && row[col] === row[col - 1]) &&
                matrix.find(row => row[col] !== row[col - 1])) {
                borders.push(col);
            }
        }
        if (borders.length == 0) {
            return [matrix];
        }
        borders.unshift(0);
        borders.push(columns);
        const blocks = [];
        borders.forEach((start, idx) => {
            if (start === columns) {
                return;
            }
            const end = borders[idx + 1];
            const block = matrix.map(row => row.slice(start, end));
            blocks.push(block);
        });
        return blocks;
    }
    horSlice(matrix) {
        const borders = [];
        matrix.forEach((row, rowIdx) => {
            if (rowIdx == 0) {
                return;
            }
            const lastRow = matrix[rowIdx - 1];
            // 上下两边有svd的，不能为同一个svd（有组件跨越的不能切）
            // 两行能找到上下两边不等的单元格（上下两边都相等就没必要切了）
            if (!row.find((svd, colIdx) => !!svd && svd === lastRow[colIdx]) &&
                row.findIndex((svd, colIdx) => svd !== lastRow[colIdx]) != -1) {
                borders.push(rowIdx);
            }
        });
        if (borders.length == 0) {
            return [matrix];
        }
        borders.unshift(0);
        borders.push(matrix.length);
        const blocks = [];
        borders.forEach((start, idx) => {
            if (start === matrix.length) {
                return;
            }
            const end = borders[idx + 1];
            const block = matrix.slice(start, end);
            blocks.push(block);
        });
        return blocks;
    }
    checkSeparator(matrix) {
        const width = matrix[0].length * this.UNIT_LENGTH;
        const height = matrix.length * this.UNIT_LENGTH;
        const isSeparator = width > 0 && height > 0 && matrix.find(row => row.find(svd => !!svd)) === undefined;
        let result;
        if (isSeparator) {
            result = { width, height };
        }
        return result;
    }
    containsMultipleBlocks(matrix) {
        const target = matrix[0] != undefined ? matrix[0][0] : undefined;
        return matrix.find(row => row.find(svd => svd !== target));
    }
    calcSizeAndGrow(matrix, direction, slicable) {
        const grow = this.calcGrow(matrix, direction, slicable);
        const physicalSize = !slicable ? this.calcPhysicalSize(matrix) : { width: '100%', height: '100%' };
        if (direction == 'row') {
            return grow == 0 ? `width:${matrix[0].length * this.UNIT_LENGTH}px; height:${physicalSize.height}; flex-shrink: 0;` :
                `height:${physicalSize.height}; flex: ${grow} 1 0; overflow: auto;`; // 水平方向根据父元素响应时，应处理子元素溢出
        }
        else if (direction == 'column') {
            return grow == 0 ? `width:${physicalSize.width}; height:${matrix.length * this.UNIT_LENGTH}px; flex-shrink: 0;` :
                `width:${physicalSize.width}; flex: ${grow} 1 0;`;
        }
        else {
            return 'width:100%; height:100%; display:flex;';
        }
    }
    calcGrow(matrix, direction, slicable) {
        if (!slicable && this.containsMultipleBlocks(matrix)) {
            return 0;
        }
        let grows;
        if (direction == 'row') {
            grows = matrix.map(row => row.reduce((grow, svd) => {
                if (!svd) {
                    return grow;
                }
                const scaleDirection = svd.scaleDirection;
                if (scaleDirection == 'horizontal' || scaleDirection == 'both') {
                    grow++;
                }
                return grow;
            }, 0));
        }
        else if (direction == 'column') {
            grows = [];
            for (let col = 0, columns = matrix[0].length; col < columns; col++) {
                let grow = 0;
                for (let row = 0, rows = matrix.length; row < rows; row++) {
                    const svd = matrix[row][col];
                    if (!svd) {
                        continue;
                    }
                    const scaleDirection = svd.scaleDirection;
                    if (scaleDirection == 'vertical' || scaleDirection == 'both') {
                        grow++;
                    }
                }
                grows.push(grow);
            }
        }
        if (!grows || grows.length == 0) {
            grows = [0];
        }
        return Math.max(...grows);
    }
    // 计算单区块的物理尺寸，只用于计算不可切分区块。
    calcPhysicalSize(matrix) {
        if (this.containsMultipleBlocks(matrix)) {
            // 包含多个不同块，且不能再切分，我们只能无视其延展性，认为它是固定尺寸
            return {
                width: `${matrix[0].length * this.UNIT_LENGTH}px`,
                height: `${matrix.length * this.UNIT_LENGTH}px`
            };
        }
        else {
            const svd = matrix[0][0];
            const scaleDirection = svd.scaleDirection;
            return {
                width: scaleDirection == 'none' || scaleDirection == 'vertical' ?
                    `${matrix[0].length * this.UNIT_LENGTH}px` : '100%',
                height: scaleDirection == 'none' || scaleDirection == 'horizontal' ?
                    `${matrix.length * this.UNIT_LENGTH}px` : '100%'
            };
        }
    }
    simplifyAndCopy(svds) {
        return svds.map(svd => ({
            left: svd.layout.left, top: svd.layout.top,
            width: svd.layout.width, height: svd.layout.height,
            scaleDirection: svd.layout.scaleDirection, justify_content: svd.layout.justify_content,
            align_items: svd.layout.align_items, origin: svd, sticky: svd.layout.sticky
        }));
    }
    isInside(row, col, left, top, width, height) {
        return (row >= top && row < height + top) && (col >= left && col < width + left);
    }
    // 将有重叠的块重新分组，把重叠的块融合成一个大的虚拟块，再按照不重叠的算法来布局
    regroupOverlaps(svds, data) {
        for (let i = 0, len = svds.length; i < len; i++) {
            if (this.fixOverlaps(svds[i], svds, data)) {
                this.regroupOverlaps(svds, data);
                break;
            }
        }
    }
    fixOverlaps(target, svds, data) {
        for (let i = 0, len = svds.length; i < len; i++) {
            const svd = svds[i];
            if (svd === target) {
                continue;
            }
            // 算出组合后的区域的尺寸
            let width = Math.max(svd.left + svd.width, target.left + target.width);
            let height = Math.max(svd.top + svd.height, target.top + target.height);
            let count = 0;
            for (let row = 0; row < height; row++) {
                for (let col = 0; col < width; col++) {
                    // 有重叠的地方只会++一次，因此，如果有重叠，则count的数量必然小于2个块的数量之和
                    if (this.isInside(row, col, target.left, target.top, target.width, target.height)) {
                        count++;
                    }
                    else if (this.isInside(row, col, svd.left, svd.top, svd.width, svd.height)) {
                        count++;
                    }
                }
            }
            if (count === target.width * target.height + svd.width * svd.height) {
                // 没有重叠
                continue;
            }
            const left = Math.min(svd.left, target.left);
            const top = Math.min(svd.top, target.top);
            width -= left;
            height -= top;
            const scaleDirection = 'none';
            const foundOrigin = svd.origin instanceof Array ? svd.origin : [svd.origin];
            const origin = target.origin instanceof Array ? target.origin : [target.origin];
            origin.push(...foundOrigin);
            origin.htmlCoder = () => ({ htmlStr: this.absoluteLayout(origin, data), member: '' });
            svds.splice(i, 1, { left, top, width, height, origin, scaleDirection });
            let targetIdx = svds.findIndex(svd => svd === target);
            svds.splice(targetIdx, 1);
            return true;
        }
        return false;
    }
    getAbsoluteDiv(svd, left, top, width, height, index, data) {
        width *= this.UNIT_LENGTH;
        height *= this.UNIT_LENGTH;
        left *= this.UNIT_LENGTH;
        top *= this.UNIT_LENGTH;
        // 只给外包div加style的 visible 和display的绑定
        let tempMembersDefine = {
            ngStyle: '',
            members: [],
            metaStyle: ''
        };
        svd.origin.getMetaStyle(svd.origin, data.env, tempMembersDefine, 'flex');
        const css = `width:${width}px; height:${height}px;left:${left}px;top:${top}px;z-index:${index * 2 + 12};${tempMembersDefine.metaStyle ? tempMembersDefine.metaStyle : `display:flex;overflow:hidden;`}justify-content:${svd.justify_content || 'flex-start'};align-items:${svd.align_items || 'flex-start'};`;
        const itemHtmlCoder = svd.origin.htmlCoder.apply(svd.origin, [svd.origin, data.env]);
        data.membersDefine.members.push(itemHtmlCoder.member);
        data.membersDefine.members = data.membersDefine.members.concat(tempMembersDefine.members);
        return `
            <div style="position:absolute; ${css}" ${tempMembersDefine.ngStyle}>
                ${itemHtmlCoder.htmlStr}
            </div>
        `;
    }
    toMatrix(svds) {
        if (!svds || !svds.length)
            return [];
        let width = 0, height = 0;
        svds.forEach(svd => {
            width = Math.max(svd.left + svd.width, width);
            height = Math.max(svd.top + svd.height, height);
        });
        const matrix = [];
        for (let row = 0; row < height; row++) {
            matrix[row] = [];
            for (let col = 0; col < width; col++) {
                const svd = svds.find(svd => (row >= svd.top && row < svd.top + svd.height) &&
                    (col >= svd.left && col < svd.left + svd.width));
                matrix[row][col] = svd ? svd : null;
            }
        }
        return matrix;
    }
    get children() {
        return this._children || [];
    }
    set children(value) {
        this._children = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeLayout;



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// CommonJS / Node have global context exposed as "global" variable.
// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
// the global "global" var for now.
var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
var __global = typeof global !== 'undefined' && global;
var _root = __window || __global || __self;
exports.root = _root;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
(function () {
    if (!_root) {
        throw new Error('RxJS could not find any global context (window, self, global)');
    }
})();
//# sourceMappingURL=root.js.map

/***/ }),
/* 4 */
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
/* 5 */
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


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class MetadataUtil {
    static switchPointerEvent(agentId, inst, operation) {
        inst.pointerEvents = inst.pointerEvents === 'none' ? 'auto' : 'none';
        this.setPointerEvent(inst.pointerEvents, operation);
        const data = { toolBar: { pointer: inst.pointerEvents } };
        MetadataUtil.updateLocalStorage(agentId, data);
        return inst.pointerEvents;
    }
    static setPointerEvent(pointerEvents, operation) {
        if (pointerEvents === 'none') {
            operation.icon = 'iconfont iconfont-e8e4';
            operation.label = '启用鼠标事件';
            operation.tooltip = '启用鼠标事件';
        }
        else {
            operation.icon = 'iconfont iconfont-e924';
            operation.label = '禁用鼠标事件';
            operation.tooltip = '禁用鼠标事件';
        }
    }
    static updateLocalStorage(agentId, data) {
        if (!localStorage) {
            return;
        }
        let awadeRuntime = MetadataUtil.getAwadeRuntime();
        awadeRuntime[agentId] = data;
        localStorage.setItem('AwadeRuntime', JSON.stringify(awadeRuntime));
    }
    static getAwadeRuntime() {
        if (!localStorage) {
            return null;
        }
        let awadeRuntimeStr = localStorage.getItem('AwadeRuntime');
        let awadeRuntime;
        try {
            awadeRuntime = JSON.parse(awadeRuntimeStr ? awadeRuntimeStr : '{}');
        }
        catch (e) {
            console.error(`parse awade runtime data error`, e);
            awadeRuntime = {};
        }
        return awadeRuntime;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MetadataUtil;



/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("@awade/uid-sdk");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(3);
var toSubscriber_1 = __webpack_require__(99);
var observable_1 = __webpack_require__(24);
var pipe_1 = __webpack_require__(103);
/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable = (function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
     *
     * <span class="informal">Use it when you have all these Observables, but still nothing is happening.</span>
     *
     * `subscribe` is not a regular operator, but a method that calls Observable's internal `subscribe` function. It
     * might be for example a function that you passed to a {@link create} static factory, but most of the time it is
     * a library implementation, which defines what and when will be emitted by an Observable. This means that calling
     * `subscribe` is actually the moment when Observable starts its work, not when it is created, as it is often
     * thought.
     *
     * Apart from starting the execution of an Observable, this method allows you to listen for values
     * that an Observable emits, as well as for when it completes or errors. You can achieve this in two
     * following ways.
     *
     * The first way is creating an object that implements {@link Observer} interface. It should have methods
     * defined by that interface, but note that it should be just a regular JavaScript object, which you can create
     * yourself in any way you want (ES6 class, classic function constructor, object literal etc.). In particular do
     * not attempt to use any RxJS implementation details to create Observers - you don't need them. Remember also
     * that your object does not have to implement all methods. If you find yourself creating a method that doesn't
     * do anything, you can simply omit it. Note however, that if `error` method is not provided, all errors will
     * be left uncaught.
     *
     * The second way is to give up on Observer object altogether and simply provide callback functions in place of its methods.
     * This means you can provide three functions as arguments to `subscribe`, where first function is equivalent
     * of a `next` method, second of an `error` method and third of a `complete` method. Just as in case of Observer,
     * if you do not need to listen for something, you can omit a function, preferably by passing `undefined` or `null`,
     * since `subscribe` recognizes these functions by where they were placed in function call. When it comes
     * to `error` function, just as before, if not provided, errors emitted by an Observable will be thrown.
     *
     * Whatever style of calling `subscribe` you use, in both cases it returns a Subscription object.
     * This object allows you to call `unsubscribe` on it, which in turn will stop work that an Observable does and will clean
     * up all resources that an Observable used. Note that cancelling a subscription will not call `complete` callback
     * provided to `subscribe` function, which is reserved for a regular completion signal that comes from an Observable.
     *
     * Remember that callbacks provided to `subscribe` are not guaranteed to be called asynchronously.
     * It is an Observable itself that decides when these functions will be called. For example {@link of}
     * by default emits all its values synchronously. Always check documentation for how given Observable
     * will behave when subscribed and if its default behavior can be modified with a {@link Scheduler}.
     *
     * @example <caption>Subscribe with an Observer</caption>
     * const sumObserver = {
     *   sum: 0,
     *   next(value) {
     *     console.log('Adding: ' + value);
     *     this.sum = this.sum + value;
     *   },
     *   error() { // We actually could just remove this method,
     *   },        // since we do not really care about errors right now.
     *   complete() {
     *     console.log('Sum equals: ' + this.sum);
     *   }
     * };
     *
     * Rx.Observable.of(1, 2, 3) // Synchronously emits 1, 2, 3 and then completes.
     * .subscribe(sumObserver);
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Subscribe with functions</caption>
     * let sum = 0;
     *
     * Rx.Observable.of(1, 2, 3)
     * .subscribe(
     *   function(value) {
     *     console.log('Adding: ' + value);
     *     sum = sum + value;
     *   },
     *   undefined,
     *   function() {
     *     console.log('Sum equals: ' + sum);
     *   }
     * );
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Cancel a subscription</caption>
     * const subscription = Rx.Observable.interval(1000).subscribe(
     *   num => console.log(num),
     *   undefined,
     *   () => console.log('completed!') // Will not be called, even
     * );                                // when cancelling subscription
     *
     *
     * setTimeout(() => {
     *   subscription.unsubscribe();
     *   console.log('unsubscribed!');
     * }, 2500);
     *
     * // Logs:
     * // 0 after 1s
     * // 1 after 2s
     * // "unsubscribed!" after 2.5s
     *
     *
     * @param {Observer|Function} observerOrNext (optional) Either an observer with methods to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the subscribed
     *  Observable.
     * @param {Function} error (optional) A handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled.
     * @param {Function} complete (optional) A handler for a terminal event resulting from successful completion.
     * @return {ISubscription} a subscription reference to the registered handlers
     * @method subscribe
     */
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        }
        else {
            sink.add(this.source || !sink.syncErrorThrowable ? this._subscribe(sink) : this._trySubscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.syncErrorThrown = true;
            sink.syncErrorValue = err;
            sink.error(err);
        }
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            // Must be declared in a separate statement to avoid a RefernceError when
            // accessing subscription below in the closure due to Temporal Dead Zone.
            var subscription;
            subscription = _this.subscribe(function (value) {
                if (subscription) {
                    // if there is a subscription, then we can surmise
                    // the next handling is asynchronous. Any errors thrown
                    // need to be rejected explicitly and unsubscribe must be
                    // called manually
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                }
                else {
                    // if there is NO subscription, then we're getting a nexted
                    // value synchronously during subscription. We can just call it.
                    // If it errors, Observable's `subscribe` will ensure the
                    // unsubscription logic is called, then synchronously rethrow the error.
                    // After that, Promise will trap the error and send it
                    // down the rejection path.
                    next(value);
                }
            }, reject, resolve);
        });
    };
    /** @deprecated internal use only */ Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable_1.observable] = function () {
        return this;
    };
    /* tslint:enable:max-line-length */
    /**
     * Used to stitch together functional operators into a chain.
     * @method pipe
     * @return {Observable} the Observable result of all of the operators having
     * been called in the order they were passed in.
     *
     * @example
     *
     * import { map, filter, scan } from 'rxjs/operators';
     *
     * Rx.Observable.interval(1000)
     *   .pipe(
     *     filter(x => x % 2 === 0),
     *     map(x => x + x),
     *     scan((acc, x) => acc + x)
     *   )
     *   .subscribe(x => console.log(x))
     */
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i - 0] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipe_1.pipeFromArray(operations)(this);
    };
    /* tslint:enable:max-line-length */
    Observable.prototype.toPromise = function (PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
exports.Observable = Observable;
//# sourceMappingURL=Observable.js.map

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeDivBase extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeDivBase.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeDivBase;

AwadeDivBase.layout = {
    left: 0,
    top: 0,
    width: 20,
    height: 6,
    scaleDirection: 'horizontal'
};


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_layout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeTabsLayout extends __WEBPACK_IMPORTED_MODULE_0__awade_layout__["a" /* AwadeLayout */] {
    constructor() {
        super();
        this.selector = 'awade-tabs-layout';
        this.tagName = 'awade-layout';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'title', type: 'string', default: '', required: true,
                toAttribute: () => ''
            })
        ];
        this.operations = [
            {
                icon: 'iconfont iconfont-e48d', label: '添加一个Tab页', tooltip: '添加一个Tab页', context: true, type: 'add'
            },
            {
                icon: 'iconfont iconfont-e48b', label: '将Tab页移到最前面', tooltip: '将Tab页移到最前面', context: true, type: 'move'
            },
            {
                ignores: ['uid-operation-new']
            }
        ];
    }
    static initLayout(svd, title, selector) {
        let layout = svd.createSVD(selector);
        let titleProperty = layout.inputs.find(input => input.property == 'title');
        titleProperty.value = { initial: title };
        return layout;
    }
    getLabel() {
        let titleProperty = this.inputs.find(property => property.property == 'title');
        let label = __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"].isInitialDataValid(titleProperty.value.initial) ? titleProperty.value.initial.replace(/["']/g, '') : 'New Title';
        return label;
    }
    onOperation(svd, inst, operation) {
        let result = svd.getParent();
        let index = result[1].children.indexOf(result[0]);
        let resultSvd = result[1];
        switch (operation.type) {
            case 'add':
                let box = AwadeTabsLayout.initLayout(svd, 'New Tab', this.selector);
                if (resultSvd && resultSvd !== undefined) {
                    resultSvd.children.splice(index + 1, 0, box);
                }
                svd.save();
                svd.update();
                break;
            case 'move':
                if (resultSvd && resultSvd !== undefined) {
                    resultSvd.children.unshift(...resultSvd.children.splice(index, 1));
                }
                svd.save();
                svd.update();
                break;
            default:
        }
    }
    ;
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeTabsLayout;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pluto_renderer__ = __webpack_require__(94);



class PlutoRemoteData extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["RemoteData"] {
    convert(args) {
        if (__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__["CommonUtils"].isUndefined(this.additional.dataReviser)) {
            this.additional.dataReviser = [__WEBPACK_IMPORTED_MODULE_2__pluto_renderer__["a" /* PlutoParamRenderer */].dataReviserPluto, __WEBPACK_IMPORTED_MODULE_2__pluto_renderer__["a" /* PlutoParamRenderer */].dataReviserDim];
        }
        let dataReviser = `
            (data) => {
                const dataReviser = ${this.additional.dataReviser[this.additional.dataType.index]}
                try {
                    return dataReviser.call(this, data);
                } catch(e) {
                    console.error("the restful data reviser of property '${args.property}' in '${args.metaId}' throw error: " + e)
                    return null;
                }
            }`;
        // 获取报表数据
        if (this.additional.dataType.index == 0) {
            const match = (this.additional.pluto && this.additional.pluto.url) ? this.additional.pluto.url.match(/(.*)\/web\//) : null;
            if (__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__["CommonUtils"].isUndefined(match) || match.length != 2) {
                console.error(`can't get pluto name '${args.property}' in '${args.metaId}', pluto: ${this.additional.pluto.url}`);
                return;
            }
            let currentPage = 1;
            let pageSize = 200;
            // 由于本地测试的时候，pluto接口是转发调用的服务器上的，所以在使用分页的时候，需要完整的url
            let reportQueryUrl = `/rdk/service/app/vreport/web/${match[1]}/server/report_query`;
            if (args.selectedType == 'PageableTableData') {
                //@todo 分页请求pluto数据的时候，由于是从后端服务paging中发出去的，所以需要完整的url(实际环境不需要，因为pluto在本机)
                // reportQueryUrl = `http://10.43.150.99:26180/rdk/service/app/vreport/web/${match[1]}/server/report_query`;
                currentPage = args.bindTo ? `this.${args.bindTo}.pagingInfo.currentPage` : 1;
                pageSize = this.additional.topN ? this.additional.topN : 200; // 这里直接请求topN的数据，如果没有分页，正好全部查询，如果绑定了分页组件，分页的处理交给paging服务
            }
            // 检查时间粒度，是固定值，还是绑定变量
            if (!__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].checkVariable(this.additional.granularity)) {
                // 为空 或 非变量
                this.additional.granularity = this.additional.granularity == '15分钟' ? 1 : (this.additional.granularity == '小时' ? 2 : 3);
            }
            else {
                this.additional.granularity = `${this.additional.granularity}.value`;
            }
            // 检查时间，是固定值，还是绑定变量
            let startTime, endTime;
            if (!__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].checkVariable(this.additional.rangeTime)) {
                // 为空 或 非变量
                if (this.additional.granularity == 1) {
                    startTime = `"${__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__["TimeService"].getFormatDate('now', 1)}"`;
                    endTime = `"${__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__["TimeService"].getFormatDate('now', 1)}"`;
                }
                else if (this.additional.granularity == 2) {
                    startTime = `"${__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__["TimeService"].getFormatDate(new Date(new Date().setHours(0)), 2) + ':00'}"`;
                    endTime = `"${__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__["TimeService"].getFormatDate('now', 2) + ':00'}"`;
                }
                else {
                    startTime = `"${__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__["TimeService"].getFormatDate('now-1d', 3)}"`;
                    endTime = `"${__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__["TimeService"].getFormatDate('now-1d', 3)}"`;
                }
            }
            else {
                startTime = `(${this.additional.rangeTime} && ${this.additional.rangeTime}[0] ? ${this.additional.rangeTime}[0].label : 
                    "${__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__["TimeService"].getFormatDate('now-1d', 3)}")`;
                endTime = `(${this.additional.rangeTime} ? (${this.additional.rangeTime}.length == 2 ? ${this.additional.rangeTime}[1].label : 
                    ${this.additional.rangeTime}[0].label) : "${__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__["TimeService"].getFormatDate('now-1d', 3)}")`;
                if (this.additional.granularity == 2) {
                    startTime = `${startTime} + ':00'`;
                    endTime = `${endTime} + ':00'`;
                }
                else if (__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].checkVariable(this.additional.granularity)) {
                    startTime = `${this.additional.granularity} == 2 ? ${startTime} + ':00' : ${startTime}`;
                    endTime = `${this.additional.granularity} == 2 ? ${endTime} + ':00' : ${endTime}`;
                }
            }
            let params = `
            {
                param: {
                    condition: {
                        topN: ${this.additional.topN ? this.additional.topN : 200},
                        times: {
                            beginTime: ${startTime},
                            endTime: ${endTime},
                            granularity: ${this.additional.granularity} + 2,
                            multi_period: ""
                        },
                        filterList: {
                            filters: [
                                {
                                    fields: [
                                        `;
            // 这里通过typeof和length来判断绑定的变量的值，是数组还是具体的值，因为可能是ArrayCollection，又没有引入，无法通过instanceof的方式来判断
            // 如果绑定的变量为空(null undefined '')，直接写 [];
            // 如果绑定的变量值类型不是object，直接使用，
            // 如果绑定的变量值类型是object，再判断length，如果存在length，则认为是ArrayCollection数组，也就是下拉控件的选择值(多选)，此时直接通过map遍历就能拿到id的数组
            // 如果不存在length，则为一个对象，这里约定就是获取到的维度数据，下拉控件设为单选的时候的值，{label: 'xxx', id: 11}
            this.additional.params && this.additional.params.forEach(param => {
                const value = this._variableCheck(param.defaultValue);
                params += `
                {
                    name: "${param.id.id}",
                    data: (${value} == null || ${value} == undefined || ${value} == '') ? [] : (typeof ${value} == 'object' ? ((<any>${value}).length ? (<any>${value}).map(item => item.id) : [\`\$\{(<any>${value}).id\}\`]) : [\`\$\{${value}\}\`]),
                    operator: ${param.operator.id}
                },
                `;
            });
            params += `
                                    ],
                                    filter_type: 0
                                }
                            ],
                            filter_type: 0
                        }
                    },
                    paging: {
                        currentPage: ${currentPage},
                        pageSize: ${pageSize}
                    },
                    isDrill: 0,
                    area: [],
                    show: ${this.additional.selectedFields ? JSON.stringify(this.additional.selectedFields) : JSON.stringify([])}
                },
                app: "vreport"
            }`;
            return {
                url: reportQueryUrl,
                triggers: JSON.stringify(this.triggers),
                method: 'post',
                params: params,
                dataReviser: dataReviser
            };
        }
        // 获取维度数据
        if (this.additional.dataType.index == 1) {
            return {
                url: '/vReport/reportview/getDimData',
                triggers: JSON.stringify(this.triggers),
                method: 'post',
                params: `{
                    excludeValue: "",
                    id: ${this._variableCheck(this.additional.id)},
                    linkFieldValue: ${this._variableCheck(this.additional.linkFieldValue)},
                    paging: {currentPage: 1, pageSize: 2000},
                    search: {searchKey: "", searchFields: []},
                    sql: ${this._variableCheck(this.additional.fields)}
                }`,
                dataReviser: dataReviser
            };
        }
    }
    _variableCheck(value) {
        if (!__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].isDefined(value))
            return `""`;
        // 包含变量(this.xxx, $event, $result), 或者被引号包围   不加分隔符 `
        if (__WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].checkVariable(value) || __WEBPACK_IMPORTED_MODULE_1__awade_basics__["util"].checkQuotation(value)) {
            return value;
        }
        // 不包含变量，需要加上分隔符，并文本中的 ` 进行转义
        return '`' + value.replace(/`/g, '\\`') + '`';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlutoRemoteData;



/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("@rdkmaster/jigsaw");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isFunction_1 = __webpack_require__(18);
var Subscription_1 = __webpack_require__(100);
var Observer_1 = __webpack_require__(22);
var rxSubscriber_1 = __webpack_require__(23);
/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = Observer_1.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = Observer_1.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    // HACK(benlesh): To resolve an issue where Node users may have multiple
                    // copies of rxjs in their node_modules directory.
                    if (isTrustedSubscriber(destinationOrNext)) {
                        var trustedSubscriber = destinationOrNext[rxSubscriber_1.rxSubscriber]();
                        this.syncErrorThrowable = trustedSubscriber.syncErrorThrowable;
                        this.destination = trustedSubscriber;
                        trustedSubscriber.add(this);
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function () { return this; };
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    /** @deprecated internal use only */ Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
exports.Subscriber = Subscriber;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        _super.call(this);
        this._parentSubscriber = _parentSubscriber;
        var next;
        var context = this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== Observer_1.empty) {
                context = Object.create(observerOrNext);
                if (isFunction_1.isFunction(context.unsubscribe)) {
                    this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = this.unsubscribe.bind(this);
            }
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._error) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parentSubscriber.syncErrorValue = err;
                _parentSubscriber.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    /** @deprecated internal use only */ SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));
function isTrustedSubscriber(obj) {
    return obj instanceof Subscriber || ('syncErrorThrowable' in obj && obj[rxSubscriber_1.rxSubscriber]);
}
//# sourceMappingURL=Subscriber.js.map

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawInput extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-input';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawInput';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', default: ''
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'value', type: "string", default: ''
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'clearable', type: "boolean", default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'disabled', type: 'boolean', default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'blurOnClear', type: 'boolean', default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'placeholder', type: 'string', default: ''
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'password', type: 'boolean', default: false
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'focus'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'blur'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'valueChange'
            }),
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawInput.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            return ` [width]="'100%'" `;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawInput;

AwadeJigsawInput.layout = {
    left: 0,
    top: 0,
    width: 15,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawTable extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-table';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawTable';
        this.inputs = [
            new DataInput(),
            new ColumnDefinesInput(),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'columnDefineGeneratorContext', type: 'any'
            }),
            new AdditionalColumnDefinesInput(),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'contentWidth', type: ['"auto" as AutoWidth', 'string']
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'floatingHeader', type: 'boolean', default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'hideHeader', type: 'boolean', default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'selectedRow', type: 'number'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'additionalData', type: 'TableData'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'trackRowBy', type: 'string'
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'sort',
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'selectChange',
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'additionalDataChange'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'edit'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'doubleClick'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'selectedRowChange'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    // 检查是否使用了renderer渲染器, 如果有，则import
    static tableRenderCoder(input, metaData, rawValue, env) {
        const [memberReference, memberDefineCode] = input.getMemberCode(metaData);
        const codes = {
            ctor: '',
            member: memberDefineCode,
            import: []
        };
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        if (!__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData) && !__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData))
            return codes;
        input.dataCoder(metaData, rawValue, env, codes, memberReference);
        // 去掉注释
        if (typeof initialData === 'string') {
            initialData = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].removeAnnotations(initialData);
        }
        // 处理是否使用了渲染器
        let classes = [];
        initialData.replace(/\b(renderer|editorRenderer)\s*:\s*(\w+)\b/g, (found, arg1, className) => {
            if (classes.findIndex(clazz => className == clazz.name) == -1) {
                classes.push({ name: className, customized: false });
            }
            return className;
        });
        const components = env && env.components ? env.components : [];
        // 1. 自定义渲染器
        classes.forEach(clazz => {
            if (components.findIndex(component => component == clazz.name) != -1) {
                // 从自定义模块中找到了(自定义渲染器)，这里的优先级高于Jigsaw自带的渲染器
                codes.import.push({ module: clazz.name, from: `./${clazz.name}` });
                clazz.customized = true;
            }
        });
        // 2. Jigsaw自带渲染器
        classes.forEach(clazz => {
            if (AwadeJigsawTable.JIGSAW_TABLE_RENDERERS.findIndex(renderer => renderer == clazz.name) != -1 && !clazz.customized) {
                codes.import.push({ module: clazz.name, from: '@rdkmaster/jigsaw' });
            }
        });
        return codes;
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawTable.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    htmlCoder(svd) {
        let htmlStr = this.getAttributeHtml(svd);
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        htmlStr += ` ${membersDefine.ngStyle} >`;
        if (svd.children && svd.children.length > 0) {
            for (let item of svd.children) {
                const itemHtmlCoder = item.htmlCoder(item);
                itemHtmlCoder.member ? membersDefine.members.push(itemHtmlCoder.member) : '';
                htmlStr += itemHtmlCoder.htmlStr;
            }
        }
        htmlStr += `</${this.getTagName(svd)}>`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawTable;

// Jigsaw中自带的表格渲染器
AwadeJigsawTable.JIGSAW_TABLE_RENDERERS = ["DefaultCellRenderer", "TableCellTextEditorRenderer", "TableHeadCheckboxRenderer",
    "TableCellCheckboxRenderer", "TableCellSwitchRenderer", "TableCellSelectRenderer"];
AwadeJigsawTable.layout = {
    left: 0,
    top: 0,
    width: 60,
    height: 17,
    scaleDirection: 'horizontal'
};
class DataInput extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"] {
    constructor() {
        super();
        this.property = 'data';
        this.type = ['TableData', 'LocalPageableTableData', 'PageableTableData', 'BigTableData'];
        this.required = true;
        this.selectedType = 'TableData';
        this.default = `
               {
                   header: [ "Column1", "Column2", "Column3" ],
                   field: [ "field1", "field2", "field3" ],
                   data: [
                       [ "cell11", "cell12", "cell13" ], //row1
                       [ "cell21", "cell22", "cell23" ], //row2
                       [ "cell31", "cell32", "cell33" ]  //row3
                   ]
               }
    `;
        this.snippets.push(new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '默认表格数据',
            desc: '默认表格数据，3行3列',
            script: `
                    {
                        header: [ "Column1", "Column2", "Column3" ],
                        field: [ "field1", "field2", "field3" ],
                        data: [
                            [ "cell11", "cell12", "cell13" ], //row1
                            [ "cell21", "cell22", "cell23" ], //row2
                            [ "cell31", "cell32", "cell33" ]  //row3
                        ]
                    }
                `,
            filter: sourceType => sourceType == 'initial'
        }));
    }
    ;
    coder(metadata, rawValue, env) {
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata, this.selectedType);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (this.bindTo && `${metadata.id}_${this.property}` != this.findInputIdWithFirstDefinedBinding(env.svdTree, this.bindTo)) {
            return codes;
        }
        if (!__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData) && !__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData))
            return codes;
        codes.import = [{ module: this.selectedType, from: `${metadata.importFrom}` }];
        codes.import.push({ module: 'SortAs', from: '@rdkmaster/jigsaw' });
        codes.import.push({ module: 'SortOrder', from: '@rdkmaster/jigsaw' });
        codes.ctor += `
            ${memberReference}=new ${this.selectedType}${this.selectedType == 'PageableTableData' ? `(http, '${rawValue.url}')` : '()'};
        `;
        if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData) && this.selectedType != 'PageableTableData') {
            const [localParameterName, localParameterDefine] = this.getLocalParameterCode(metadata, initialData);
            codes.ctor += `
                ${localParameterDefine}
                ${memberReference}.fromObject(${localParameterName})
            `;
        }
        if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData)) {
            let options = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].generateRequestOptions(remoteData);
            const subscribers = `
                ${memberReference}.onAjaxComplete(() => {
                    this.loadingService.dispose();
                });
                ${memberReference}.onAjaxError((err) => {
                    this.loadingService.dispose();
                    this.eventBus.emit('${metadata.id}_${this.property}_loaded', err);
                });
                ${memberReference}.onAjaxSuccess((data) => {
                    this.loadingService.dispose();
                    this.eventBus.emit('${metadata.id}_${this.property}_loaded', data);
                });
                this._subscribers.push(this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, $event => {
                    this.loadingService.show();
                    ${remoteData.dataReviser ? memberReference + '.dataReviser = ' + remoteData.dataReviser : ''}
                    ${memberReference}.fromAjax({
                        url: '${remoteData.url}',
                        method: '${remoteData.method}',${options}
                    });
                }));
            `;
            codes.ctor += `
                ${memberReference}.http = http;
                ${subscribers}
            `;
        }
        return codes;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = DataInput;

class ColumnDefinesInput extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"] {
    constructor() {
        super();
        this.property = 'columnDefines';
        this.type = ['ColumnDefine[]'];
        this.default = `
        [
            // 请通过常用代码块添加各个配置项
        ]
    `;
        this.snippets.push(new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '给单元格文本加上超链',
            desc: '支持给单元格文本添加基础html标签，支持超链的交互',
            script: `
                    {
                        // 这里填写此配置项需要影响的列字段名/列索引值，
                        // 如果值是数组，则此配置项会影响对应的所有列
                        target: 'field-name',
                        cell: {
                            // 改单元格的渲染方式为html
                            renderer: 'html',
                            data: (td, row, col) => \`<a (click)="onClick($\{row}, $\{col})">$\{td.data[row][col]}</a>\`,
                            innerHtmlContext: {
                                // 往事件总线上发送一个名为 table-detail 的事件，一般来说，这里只要修改事件名就行了
                                onClick: (row) => this.eventBus.emit('table-detail', row)
                            }
                        }
                    }
                `,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '隐藏某一列',
            desc: '将服务端发送回来的数据里某些列隐藏起来不显示在界面上',
            script: `
                    {
                        // 这里填写此配置项需要影响的列字段名/列索引值，
                        // 如果值是数组，则此配置项会影响对应的所有列
                        target: 'field-name',
                        visible: false
                    }
                `,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '设置列宽',
            desc: '设置某列在表格中的显示宽度',
            script: `
                    {
                        // 这里填写此配置项需要影响的列字段名/列索引值，
                        // 如果值是数组，则此配置项会影响对应的所有列
                        target: 'field-name',
                        // 支持的单位有：px（默认）、百分比
                        width: 200
                    }
                `,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '定制列头',
            desc: '包括列头的文本、是否可排序、排序方式',
            script: `
                    {
                        // 这里填写此配置项需要影响的列字段名/列索引值，
                        // 如果值是数组，则此配置项会影响对应的所有列
                        target: 'field-name',
                        header: {
                            // 用于设置列头文本
                            text: 'my header',
                            // 本列是否可排序
                            sortable: true,
                            // 排序方式，支持 string/number
                            sortAs: 'string'
                        }
                    }
                `,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '设置某一列可编辑',
            desc: '当前只支持内置的input编辑器',
            script: `
                    {
                        // 这里填写此配置项需要影响的列字段名/列索引值，
                        // 如果值是数组，则此配置项会影响对应的所有列
                        target: 'field-name',
                        editable： true
                    }
                `,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '给单元格添加静态tooltip',
            desc: '鼠标hover到此单元格上的时候，给出提示信息',
            script: `
                    {
                        // 这里填写此配置项需要影响的列字段名/列索引值，
                        // 如果值是数组，则此配置项会影响对应的所有列
                        target: 'field-name',
                        tooltip: '提示信息'
                    }
                `,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '给单元格添加动态tooltip',
            desc: '将单元格的内容当做tooltip显示出来，单元格内包含长文本时，非要有用',
            script: `
                    {
                        // 这里填写此配置项需要影响的列字段名/列索引值，
                        // 如果值是数组，则此配置项会影响对应的所有列
                        target: 'field-name',
                        tooltip: (td, row, col) => td && td.data && td.data[row] ? td.data[row][col] : ''
                    }
                `,
            filter: sourceType => sourceType == 'initial'
        }));
    }
    coder(metaData, rawValue, env) {
        return AwadeJigsawTable.tableRenderCoder(this, metaData, rawValue, env);
    }
    ;
}
/* unused harmony export ColumnDefinesInput */

class AdditionalColumnDefinesInput extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"] {
    constructor() {
        super();
        this.property = 'additionalColumnDefines';
        this.type = 'AdditionalColumnDefine[]';
        this.default = `
        [{
            // 如果你想把这一列插入到表格的最前面，则需要放开下面这行配置
            // pos: 0,
            header: {
                // 请按照实际修改新增的列头
                text: '操作'
            },
            cell: {
                renderer: 'html',
                data: (data, row, col) => \`<a onclick="onClick(\${row})">详情</a>\`,
                innerHtmlContext: {
                    // 往事件总线上发送一个名为 table-detail 的事件，一般来说，这里只要修改事件名就行了
                    onClick: (row) => this.eventBus.emit('table-detail', row)
                }
            }
        }]
    `;
        this.snippets.push(new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '插入额外一列',
            desc: '在表格第一列前面插入额外一列',
            script: `
                    {
                        // 插入的列将出现在pos的指向的索引之前
                        pos: 0,
                        header: {
                            // 请按照实际修改新增的列头
                            text: '操作'
                        },
                        cell: {
                            renderer: 'html',
                            data: (data, row, col) => \`<a onclick="onClick($\{row})">详情</a>\`,
                            innerHtmlContext: {
                                // 往事件总线上发送一个名为 table-detail 的事件，一般来说，这里只要修改事件名就行了
                                onClick: (row) => this.eventBus.emit('table-detail', row)
                            }
                        }
                    }
                `,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '插入额外一列',
            desc: '在表格最后一列后面插入额外一列',
            script: `
                    {
                        header: {
                            // 请按照实际修改新增的列头
                            text: '操作'
                        },
                        cell: {
                            renderer: 'html',
                            data: (data, row, col) => \`<a onclick="onClick($\{row})">详情</a>\`,
                            innerHtmlContext: {
                                // 往事件总线上发送一个名为 table-detail 的事件，一般来说，这里只要修改事件名就行了
                                onClick: (row) => this.eventBus.emit('table-detail', row)
                            }
                        }
                    }
                `,
            filter: sourceType => sourceType == 'initial'
        }));
    }
    coder(metaData, rawValue, env) {
        return AwadeJigsawTable.tableRenderCoder(this, metaData, rawValue, env);
    }
    ;
}
/* unused harmony export AdditionalColumnDefinesInput */



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_awade_tabs_layout__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_utils__ = __webpack_require__(6);



class AwadeJigsawTabs extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-tabs';
        this.tagName = 'jigsaw-tabs';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawTab';
        this.operations = [
            {
                icon: 'iconfont iconfont-e48d', label: '添加一个Tab页', tooltip: '添加一个Tab页', context: true, type: 'add'
            },
            {
                icon: 'iconfont iconfont-e48b', label: '将Tab页移到最前面', tooltip: '将Tab页移到最前面', context: true, type: 'move'
            },
            {
                icon: 'iconfont iconfont-e489', label: '删除当前Tab页', tooltip: '删除当前Tab页', context: true, type: 'remove'
            },
        ];
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'editable', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'selectedIndex', type: 'number'
            }),
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({ property: 'selectChange' }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({ property: 'selectedIndexChange' })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['opacity', 'visibility']
        });
        if (this.excludedProperties) {
            this.excludedProperties.push('_removeSelectedIndexChangeListener');
        }
        else {
            this.excludedProperties = ['_removeSelectedIndexChangeListener'];
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawTabs.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    onSelect(svd, inst, selectedSVD, selectedInst) {
        if (!svd || !selectedSVD || selectedSVD.selector != "awade-tabs-layout") {
            return;
        }
        this.setIndex(svd, inst, selectedSVD);
    }
    setIndex(svd, inst, selectedSVD) {
        let index = svd.children.indexOf(selectedSVD);
        inst.selectedIndex = index;
    }
    afterContentInit(svd, inst) {
        if (this._removeSelectedIndexChangeListener) {
            this._removeSelectedIndexChangeListener.unsubscribe();
            this._removeSelectedIndexChangeListener = null;
        }
        this._removeSelectedIndexChangeListener = inst.selectedIndexChange.subscribe($event => {
            let openConfig = { properties: { selectedIndex: $event } };
            __WEBPACK_IMPORTED_MODULE_2__util_utils__["a" /* MetadataUtil */].updateLocalStorage(svd.agentId, openConfig);
        });
        let runtime = __WEBPACK_IMPORTED_MODULE_2__util_utils__["a" /* MetadataUtil */].getAwadeRuntime();
        if (localStorage && runtime && runtime.hasOwnProperty(svd.agentId)) {
            inst.selectedIndex = runtime[svd.agentId].properties.selectedIndex;
        }
    }
    onDestroy(svd, inst) {
        if (this._removeSelectedIndexChangeListener) {
            this._removeSelectedIndexChangeListener.unsubscribe();
            this._removeSelectedIndexChangeListener = null;
        }
    }
    getChildArea(svd, inst, el) {
        return el.nativeElement.children[0].children[1].getBoundingClientRect();
    }
    ;
    beforeCreate(svd) {
        if (svd.children == undefined) {
            svd.children = [];
            let box = this.initLayout(svd, 'New Tab', 'awade-tabs-layout');
            svd.children.push(box);
            svd.save();
        }
    }
    ;
    initLayout(svd, title, selector) {
        return __WEBPACK_IMPORTED_MODULE_0__awade_awade_tabs_layout__["a" /* AwadeTabsLayout */].initLayout(svd, title, selector);
    }
    onOperation(svd, inst, operation) {
        switch (operation.type) {
            case 'add':
                if (!svd.children) {
                    svd.children = [];
                }
                let box = this.initLayout(svd, 'New Tab', 'awade-tabs-layout');
                svd.children.push(box);
                svd.save();
                svd.update();
                break;
            case 'remove':
                if (inst) {
                    svd.children.splice(inst.selectedIndex, 1);
                    // 当删除之后没有tab页了，新增一个空的tab页
                    if (svd.children.length == 0) {
                        let box = this.initLayout(svd, 'New Tab', 'awade-tabs-layout');
                        svd.children.push(box);
                    }
                    svd.save();
                    svd.update();
                }
                break;
            case 'move':
                svd.children.unshift(...svd.children.splice(inst.selectedIndex, 1));
                svd.save();
                svd.update();
                break;
            default:
        }
    }
    ;
    htmlCoder(svd, env) {
        let children = [];
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        if (svd.children && svd.children.length > 0) {
            svd.children.forEach((cm) => {
                let title = '""';
                cm.inputs.forEach((item) => {
                    if (item.property == 'title') {
                        if (item.value && __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"].isInitialDataValid(item.value.initial)) {
                            title = item.value.initial;
                        }
                        else {
                            title = item.default;
                        }
                    }
                });
                const cmHtmlCoder = cm.htmlCoder(cm, env);
                title = title.match(/\bthis\.\w+/g) ? `[title]='${title}'` : `title='${title}'`;
                children.push(`<jigsaw-tab-pane ${title} >
                    <ng-template>
                        ${cmHtmlCoder.htmlStr}
                    </ng-template>
                </jigsaw-tab-pane>`);
                cmHtmlCoder.member ? membersDefine.members.push(cmHtmlCoder.member) : '';
            });
        }
        let htmlStr = this.getAttributeHtml(svd);
        htmlStr += ` ${membersDefine.ngStyle} >${children.join('')}</jigsaw-tabs>`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawTabs;

AwadeJigsawTabs.layout = {
    left: 0,
    top: 0,
    width: 40,
    height: 20,
    scaleDirection: 'both'
};


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadePopupableComponent extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'awade-popupable-component';
        this.tagName = 'div';
        this.operations = [{
                ignores: ['uid-operation-delete', 'uid-operation-new']
            }];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['opacity', 'visibility', 'width', 'height', 'background'],
            width: "600",
            widthUnit: "PX",
            height: "480",
            heightUnit: "PX",
            defaultStyle: 'background:#ffffff; '
        });
    }
    getLabel() {
        return 'this';
    }
    htmlCoder(svd, env) {
        let htmlStr = this.getAttributeHtml(svd);
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        htmlStr += ` ${membersDefine.ngStyle} >`;
        if (svd.children && svd.children.length > 0) {
            // popupable-component 只有一个awade-layout子元素
            for (let item of svd.children) {
                let itemCoderResult;
                const itemHtmlCoder = item.htmlCoder(item, env);
                itemCoderResult = itemHtmlCoder.htmlStr;
                membersDefine.members.push(itemHtmlCoder.member);
                htmlStr += itemCoderResult;
            }
        }
        htmlStr += `</${this.getTagName(svd)}>`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            let cssStr = '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkNumber(svd.styles.width) ? cssStr += `width: ${svd.styles.width}${svd.styles.widthUnit}; ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkNumber(svd.styles.height) ? cssStr += `height: ${svd.styles.height}${svd.styles.heightUnit}; ` : '';
            return cssStr;
        }
        else {
            let ngStyle = '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkNumber(svd.styles.width) ? ngStyle += ` [style.width]="'${svd.styles.width}${svd.styles.widthUnit}'" ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkNumber(svd.styles.height) ? ngStyle += ` [style.height]="'${svd.styles.height}${svd.styles.heightUnit}'" ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkVariable(svd.styles.width) ? ngStyle += ` [style.width]="${svd.styles.width.trim().substring(5)}" ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkVariable(svd.styles.height) ? ngStyle += ` [style.height]="${svd.styles.height.trim().substring(5)}" ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkCalc(svd.styles.width) ? ngStyle += ` [style.width]="${svd.styles.width}" ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkCalc(svd.styles.height) ? ngStyle += ` [style.height]="${svd.styles.height}" ` : '';
            return ngStyle;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadePopupableComponent;



/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=isFunction.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArray.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isObject(x) {
    return x != null && typeof x === 'object';
}
exports.isObject = isObject;
//# sourceMappingURL=isObject.js.map

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// typeof any so that it we don't have to cast when comparing a result to the error object
exports.errorObject = { e: {} };
//# sourceMappingURL=errorObject.js.map

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.empty = {
    closed: true,
    next: function (value) { },
    error: function (err) { throw err; },
    complete: function () { }
};
//# sourceMappingURL=Observer.js.map

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(3);
var Symbol = root_1.root.Symbol;
exports.rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
    Symbol.for('rxSubscriber') : '@@rxSubscriber';
/**
 * @deprecated use rxSubscriber instead
 */
exports.$$rxSubscriber = exports.rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(3);
function getSymbolObservable(context) {
    var $$observable;
    var Symbol = context.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.observable) {
            $$observable = Symbol.observable;
        }
        else {
            $$observable = Symbol('observable');
            Symbol.observable = $$observable;
        }
    }
    else {
        $$observable = '@@observable';
    }
    return $$observable;
}
exports.getSymbolObservable = getSymbolObservable;
exports.observable = getSymbolObservable(root_1.root);
/**
 * @deprecated use observable instead
 */
exports.$$observable = exports.observable;
//# sourceMappingURL=observable.js.map

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pluto_remote_data__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__awade_basics__);



class PlutoAction extends __WEBPACK_IMPORTED_MODULE_2__awade_basics__["BaseAction"] {
    constructor() {
        super(...arguments);
        this.label = "Pluto";
        this.type = 'Pluto';
        this.desc = '通过Pluto获取数据';
    }
    convert(metaDataId, property, structuredCode) {
        const remoteDataInstance = new __WEBPACK_IMPORTED_MODULE_1__pluto_remote_data__["a" /* PlutoRemoteData */]({ additional: this.additional });
        const scriptObj = remoteDataInstance.convert({
            property: property,
            metaId: metaDataId
        });
        if (__WEBPACK_IMPORTED_MODULE_0__rdkmaster_jigsaw__["CommonUtils"].isUndefined(scriptObj)) {
            return `
                // ${this.label}
                console.log('执行请求pluto请求失败，参数有误！');
            `;
        }
        const options = __WEBPACK_IMPORTED_MODULE_2__awade_basics__["util"].generateRequestOptions(scriptObj);
        return `
            ($context: any) => {
                ${this.getContextVariableDefinition()}
                // ${this.label}
                return new Promise<any>(resolve =>
                    this.http.request("${scriptObj.method}", "${scriptObj.url}", {${options}})${scriptObj.dataReviser ? '.map(' + scriptObj.dataReviser + ')' : ''}
                    .subscribe(data => {
                        $context.$result = data;
                        resolve($context);
                    }));
            }
        `;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlutoAction;



/***/ }),
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__generate_generator__ = __webpack_require__(29);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "generate", function() { return __WEBPACK_IMPORTED_MODULE_0__generate_generator__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__generate_exportor__ = __webpack_require__(114);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "create", function() { return __WEBPACK_IMPORTED_MODULE_1__generate_exportor__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "exportCode", function() { return __WEBPACK_IMPORTED_MODULE_1__generate_exportor__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "clearCode", function() { return __WEBPACK_IMPORTED_MODULE_1__generate_exportor__["a"]; });




/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = generate;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__component_metadata_metadata_index__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__translator_svd_translator__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__plugins_index__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__awade_uid_sdk__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__awade_uid_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__awade_uid_sdk__);





__WEBPACK_IMPORTED_MODULE_3__plugins_index__["a" /* allPluginInfo */] && __WEBPACK_IMPORTED_MODULE_3__plugins_index__["a" /* allPluginInfo */].forEach(plugin => {
    // 注册插件metadata
    plugin.metadatas && plugin.metadatas.forEach(meta => {
        __WEBPACK_IMPORTED_MODULE_0__component_metadata_metadata_index__["a" /* metadatas */][meta.selector] = meta.class;
    });
    // 注册插件hook
    if (plugin.hooks && plugin.hooks.length) {
        plugin.hooks.forEach(hook => {
            Object(__WEBPACK_IMPORTED_MODULE_4__awade_uid_sdk__["registerHook"])(plugin.name, 'compile', hook);
        });
    }
});
/**
 * 在pub目录，更新当前工程的源码
 * @param {string} user
 * @param {string} project
 * @returns {boolean}
 */
function generate(user, project, target) {
    if (!Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["l" /* isProjDataFolderExist */])(user, project)) {
        console.error("generator.ts: project folder does not exist!");
        return false;
    }
    //读出cursor文件的内容，强转为数字，如果没有或者非法，则报错
    let projDataPath = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["r" /* toSavingPath */])(user, project + "/histories");
    let cursor = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["e" /* getCursor */])(projDataPath);
    if (!cursor) {
        console.error("generator.ts ,reading or parsing cursor value error!");
        return false;
    }
    const currentCursorPath = projDataPath + '/' + cursor;
    let svdCollection = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["h" /* getSVDFileContent */])(currentCursorPath).map(s => ({ component: s.svd, svd: s.content }));
    let projectHome = 'app/ui-designer/pub/' + user + '/' + project;
    importComponents(svdCollection, projectHome);
    deleteUnExistComponentFile(projectHome, svdCollection);
    generateSourceCode(user, project, currentCursorPath, svdCollection, target);
    installPlugins(user, project);
    return true;
}
function installPlugins(user, project) {
    __WEBPACK_IMPORTED_MODULE_3__plugins_index__["a" /* allPluginInfo */].forEach(plugin => {
        const pluginHome = 'app/ui-designer/plugins/' + plugin.name;
        const pkgName = '@awade/plugin-' + plugin.name;
        const seedPkgPath = 'app/ui-designer/compiler/project-seed/dependencies/node_modules/' + pkgName;
        const manifest = JSON.parse(Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["o" /* readString */])(pluginHome + '/manifest.json'));
        // copy plugin package
        Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["a" /* copyDir */])(pluginHome + '/' + manifest.path, seedPkgPath);
        // import plugin module to AppModule
        const moduleName = manifest.module;
        const appModulePath = `app/ui-designer/pub/${user}/${project}/web/src/app/entry-module.ts`;
        let appModuleCode = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["o" /* readString */])(`app/ui-designer/pub/${user}/${project}/web/src/app/entry-module.ts`);
        if (appModuleCode.indexOf(pkgName) == -1) {
            appModuleCode = appModuleCode.replace('/*replace-by-import-plugins*/', `import {${moduleName}} from '${pkgName}';\n/*replace-by-import-plugins*/`)
                .replace('/*replace-by-import-plugins-module*/', `${moduleName},\n/*replace-by-import-plugins-module*/`);
        }
        Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["p" /* saveFile */])(appModulePath, appModuleCode);
    });
}
function generateSourceCode(user, project, currentCursorPath, svdCollection, target) {
    const projectHome = 'app/ui-designer/pub/' + user + '/' + project;
    let projectEnv = {
        user: user, project: project, metadata: __WEBPACK_IMPORTED_MODULE_0__component_metadata_metadata_index__["a" /* metadatas */], appName: target == 'prod' ? project : 'ui-designer/pub/' + user + '/' + project,
        templates: {
            rest: __webpack_require__(112),
            dynamicOrSql: __webpack_require__(113)
        },
        target: target // dev preview prod 分别代表编译类型，影响translator生成的ts
    };
    let i18n = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["f" /* getI18n */])(currentCursorPath + '/i18n.json');
    let routers = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["g" /* getRouters */])(currentCursorPath + '/routers.json');
    let sharedData = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["i" /* getSharedData */])(currentCursorPath);
    let translatedCodes = __WEBPACK_IMPORTED_MODULE_1__translator_svd_translator__["a" /* translate */](svdCollection, projectEnv, i18n, routers, sharedData);
    const componentPath = projectHome + '/web/src/app/generated/';
    translatedCodes.components.forEach(ts => {
        let file = componentPath + ts.component + '.ts';
        console.info('saving component source ' + file);
        // 加上时间戳以避免文件内容没变化时，编译器不生成main.bundle.js
        let code = ts.code + ';var __uid_ts_' + (+new Date);
        Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["p" /* saveFile */])(file, code);
    });
    const serverPath = projectHome + '/server/';
    Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["c" /* deleteDir */])(serverPath);
    let logCode = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["o" /* readString */])('app/ui-designer/services/legacy/log.js');
    const logHome = 'app/ui-designer/pub/' + user + '/' + project + '/server/utils/';
    Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["p" /* saveFile */])(logHome + 'log.js', logCode);
    translatedCodes.services.forEach(js => {
        let file = serverPath + js.service + '.js';
        console.info('compile: creating service:' + file);
        Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["p" /* saveFile */])(file, js.code);
    });
    // 生成路由代码
    if (translatedCodes.routersCode) {
        routerConfig(translatedCodes.routersCode, projectHome);
    }
    let modulePath = projectHome + '/web/src/app/entry-module.ts';
    // 在模块中插入i18n
    let appModuleCode = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["o" /* readString */])(modulePath)
        .replace('/*replace-by-set-translation*/', translatedCodes.i18nCode);
    Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["p" /* saveFile */])(modulePath, appModuleCode);
}
/**
 * 多组件自动import
 */
function importComponents(svdCollection, projectHome) {
    let appModuleTempHome = 'app/ui-designer/compiler/project-seed/web/src/app/entry-module.ts';
    let appModuleProHome = projectHome + '/web/src/app/entry-module.ts';
    // 第一次写入module时，先从模板里读取，避免模板更新后无法升级原项目
    let appModuleCode = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["o" /* readString */])(appModuleTempHome);
    svdCollection.forEach(svd => {
        if (!new RegExp(svd.component + ', /\\* added by awade @ declarations \\*/').test(appModuleCode)) {
            let importStatement = 'import {' + svd.component + '} from "./generated/' + svd.component + '"; \n' +
                '/*replace-by-import-components*/';
            let declarationStatement = svd.component + ', /* added by awade @ declarations */ \n /*replace-by-declarations-components*/';
            appModuleCode = appModuleCode.replace('/*replace-by-import-components*/', importStatement);
            appModuleCode = appModuleCode.replace('/*replace-by-declarations-components*/', declarationStatement);
        }
        // 对话框组件,可弹出模块,可复制模块需要 entryComponents 动态引入
        let metaSvd = eval('(' + svd.svd + ')');
        if (metaSvd.config && (metaSvd.config.moduleType === 'dialog' || metaSvd.config.moduleType === 'popupable' || metaSvd.config.moduleType === 'repeat') &&
            !new RegExp(svd.component + ', /\\* added by awade @ entryComponents \\*/').test(appModuleCode)) {
            let entryComponents = svd.component + ', /* added by awade @ entryComponents */ \n /*replace-by-entryComponents*/';
            appModuleCode = appModuleCode.replace('/*replace-by-entryComponents*/', entryComponents);
        }
    });
    Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["p" /* saveFile */])(appModuleProHome, appModuleCode);
}
/**
 * 已删除组件处理
 */
function deleteUnExistComponentFile(projectHome, svdCollection) {
    let componentPath = projectHome + '/web/src/app/generated/';
    let files = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["m" /* listFiles */])(componentPath);
    let deletedComponents = [];
    files.forEach(file => {
        let index = -1;
        // 这里不用findIndex，因为有时svdCollection的类型不是数组，看起来是一个object
        for (let i = 0; i < svdCollection.length; i++) {
            const svd = svdCollection[i];
            if (svd.component + '.ts' === file) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["c" /* deleteDir */])(componentPath + file);
            let match = file.match(/^(\w+?)\.ts$/);
            if (match && match.length > 1) {
                deletedComponents.push(match[1]);
            }
        }
    });
    // 去掉已删除组件的声明和引入
    if (deletedComponents.length > 0) {
        let appModuleProHome = projectHome + '/web/src/app/entry-module.ts';
        let appModuleCode = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["o" /* readString */])(appModuleProHome);
        deletedComponents.forEach(component => {
            appModuleCode = appModuleCode.replace(new RegExp(component + ', /\\* added by awade @ declarations \\*/'), '');
            appModuleCode = appModuleCode.replace(new RegExp(component + ', /\\* added by awade @ entryComponents \\*/'), '');
            appModuleCode = appModuleCode.replace(new RegExp('import {' + component + '} from "./generated/' + component + '";'), '');
        });
        Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["p" /* saveFile */])(appModuleProHome, appModuleCode);
    }
}
/**
 * 处理路由配置相关代码
 * @param routersCode
 * @param projectHome
 */
function routerConfig(routersCode, projectHome) {
    // 路由配置读取种子工程中的，，避免模板更新后无法升级原项目
    let appRouterTempHome = 'app/ui-designer/compiler/project-seed/web/src/app/router-config.ts';
    let appRouterCode = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["o" /* readString */])(appRouterTempHome);
    projectHome = projectHome + '/web/src/app/';
    let appRouterProHome = projectHome + 'router-config.ts';
    // 处理import
    let importStatement = '/*@replace-by-import-components*/' + '\n' + routersCode.import + '\n' + '/*@replace-by-import-components*/';
    appRouterCode = appRouterCode.replace(/\/\*@replace-by-import-components\*\/([\s\S]*)\/\*@replace-by-import-components\*\//g, importStatement);
    // 处理路由配置
    let routersConfigCode = '/*@awade-routers-configurations*/' + '\n' + routersCode.code + '\n' + '/*@awade-routers-configurations*/';
    appRouterCode = appRouterCode.replace(/\/\*@awade-routers-configurations\*\/([\s\S]*)\/\*@awade-routers-configurations\*\//g, routersConfigCode);
    //2、生成守卫类代码
    if (routersCode.usedGuards && routersCode.usedGuards.length > 0) {
        // 1、 路由守卫引入到entry-module.ts中，这里读取当前project的，因为在importComponents方法中已经更新过了
        const guardClasses = routersCode.usedGuards.map(guard => guard.name);
        let appModuleProHome = projectHome + 'entry-module.ts';
        let appModuleCode = Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["o" /* readString */])(appModuleProHome);
        let importStatement = 'import {' + guardClasses.join(', ') + '} from "./router-config"; \n' +
            '/*replace-by-import-components*/';
        appModuleCode = appModuleCode.replace('/*replace-by-import-components*/', importStatement);
        // 2、 将守卫类放到providers中
        let providersStatement = guardClasses.join(', ') + ', \n' +
            '/*replace-by-router-guards-components*/';
        appModuleCode = appModuleCode.replace('/*replace-by-router-guards-components*/', providersStatement);
        Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["p" /* saveFile */])(appModuleProHome, appModuleCode);
        let guardCode = `/*@replace-by-router-guards*/`;
        // 3、存在退出守卫
        let index = -1;
        for (let i = 0; i < routersCode.usedGuards.length; i++) {
            const guard = routersCode.usedGuards[i];
            if (guard.type == 'exit') {
                index = i;
                break;
            }
        }
        if (index > -1) {
            guardCode += `
                export interface CanComponentDeactivate {
                    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
                }
            `;
        }
        // 4、生成守卫类代码
        routersCode.usedGuards.forEach((guard) => {
            let script = guard.script ? guard.script : 'return true';
            script = `
                // 自定义代码生成位置
                try {
                    ${script}
                } catch(e) {
                    console.error(' Router guard ${guard.name} has en error: ', e);
                    return false;
                }
            `;
            const constructor = `constructor(private router: Router, private http: HttpClient, private dataBus: DataBus, private eventBus: EventBus) {}`;
            if (guard.type == 'entry') {
                guardCode += `
                    @Injectable()
                    export class ${guard.name} implements CanActivate {
                        ${constructor}
                        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
                            Observable<boolean> | Promise<boolean> | boolean {
                            ${script}
                        }
                    }
                `;
            }
            if (guard.type == 'exit') {
                guardCode += `
                    @Injectable()
                    export class ${guard.name} implements CanDeactivate<CanComponentDeactivate> {
                        ${constructor}
                        canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: 
                            RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
                            ${script}
                        }
                    }
                `;
            }
        });
        guardCode += `/*@replace-by-router-guards*/`;
        appRouterCode = appRouterCode.replace(/\/\*@replace-by-router-guards\*\/([\s\S]*)\/\*@replace-by-router-guards\*\//g, guardCode);
    }
    Object(__WEBPACK_IMPORTED_MODULE_2__server_utils_file_system__["p" /* saveFile */])(appRouterProHome, appRouterCode);
}


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__jigsaw_jigsaw_box__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__jigsaw_jigsaw_select__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__jigsaw_jigsaw_tile_lite__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__awade_uid_basic_gis__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__awade_awade_layout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__html_origin_a__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__html_origin_div__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__html_origin_h1__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__html_origin_h2__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__html_origin_h3__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__html_origin_h4__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__html_origin_h5__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__html_origin_h6__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__html_origin_hr__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__html_origin_img__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__html_origin_p__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__awade_awade_iframe__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__html_origin_span__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__jigsaw_jigsaw_button__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__jigsaw_jigsaw_button_bar__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__jigsaw_jigsaw_cascade__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__jigsaw_jigsaw_checkbox__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__jigsaw_jigsaw_combo_select__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__jigsaw_jigsaw_dialog__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__jigsaw_jigsaw_drawer__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__jigsaw_jigsaw_graph__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__jigsaw_jigsaw_input__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__jigsaw_jigsaw_auto_complete_input__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__jigsaw_jigsaw_list__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__jigsaw_jigsaw_list_lite__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__jigsaw_jigsaw_numeric_input__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__jigsaw_jigsaw_pagination__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__jigsaw_jigsaw_radios_lite__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__jigsaw_jigsaw_range_time__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__jigsaw_jigsaw_slider__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__jigsaw_jigsaw_switch__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__jigsaw_jigsaw_table__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__jigsaw_jigsaw_time__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__jigsaw_jigsaw_tree_ext__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__jigsaw_jx_range_time_select__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__jigsaw_jx_time_select__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__jigsaw_jigsaw_icon__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__jigsaw_jigsaw_tag__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__jigsaw_jigsaw_loading__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__jigsaw_jigsaw_transfer__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__jigsaw_jigsaw_upload__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__angular_router_outlet__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__jigsaw_jigsaw_breadcrumb__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__awade_awade_tabs_layout__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__jigsaw_jigsaw_tabs__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__awade_awade_combo_layout__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__awade_awade_drawer_layout__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__jigsaw_jigsaw_textarea__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__awade_awade_placeholder__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__awade_awade_group__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__awade_awade_group_layout__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__jigsaw_jx_view_stack__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__awade_awade_view_stack_layout__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__angular_ngx_if__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__jigsaw_jigsaw_rate__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__directive_jigsaw_float__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__awade_awade_popupable_component__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_62__directive_jigsaw_upload_directive__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_63__awade_awade_repeat_component__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_64__awade_awade_repeat__ = __webpack_require__(89);

































































const categories = [
    {
        category: "容器 Container",
        components: [
            // {
            //     selector: 'jigsaw-box',
            //     label: '容器 Box',
            //     icon: 'assets/icon/components/containers/u4073.png',
            // },
            {
                selector: 'jigsaw-tabs',
                label: '选项卡 Tabs',
                desc: '提供多页签切换视图功能，常常用于处理多视图叠加/切换的场景',
                icon: 'assets/icon/components/containers/tab.svg'
            },
            {
                selector: 'jigsaw-drawer',
                label: '抽屉',
                desc: '提供类似抽屉一样的视图收纳功能，需要时抽出，不需要时合起来',
                icon: 'assets/icon/components/containers/drawer.svg'
            },
            {
                selector: 'jigsaw-combo-select',
                label: '组合下拉框',
                desc: '提供下拉式收纳视图的功能，这是最广泛使用的视图收纳手段',
                icon: 'assets/icon/components/containers/comboselect.svg'
            },
            {
                selector: 'router-outlet',
                label: '路由插座',
                desc: '这是路由实际视图在设计师的占位符，路由实际视图需要在运行/预览时才能够有实际效果',
                icon: 'assets/icon/components/containers/u4073.png'
            },
            {
                selector: 'awade-group',
                label: '分组',
                desc: '对视图上的组件提供逻辑分组功能，使得视图上的组件易于维护，也常常用于统一设置样式、动作等场景',
                icon: 'assets/icon/components/containers/box_group.svg'
            },
            {
                selector: 'jx-view-stack',
                label: '重叠视图',
                desc: '在一个区域内提供多个重叠的视图，并可随时切换呈现的视图',
                icon: 'assets/icon/components/containers/box_overlay.svg'
            },
            {
                selector: 'ngx-if',
                label: '显示隐藏容器',
                desc: '提供视图的显示隐藏功能，隐藏后，容器中的组件将彻底被销毁，可提升app的运行速度',
                icon: 'assets/icon/components/containers/box_hide.svg'
            },
            {
                selector: 'awade-repeat',
                label: '视图复制容器',
                desc: '复制选中模块',
                icon: 'assets/icon/components/containers/box_copy.svg'
            }
        ]
    },
    {
        category: '基础 Basic',
        components: [
            {
                selector: 'jigsaw-button',
                label: '按钮',
                icon: 'assets/icon/components/basic/button.svg'
            },
            {
                selector: 'jigsaw-icon',
                label: '图标',
                icon: 'assets/icon/components/basic/icon.svg'
            },
            {
                selector: 'jigsaw-tag',
                label: '标签',
                icon: 'assets/icon/components/basic/tag.svg'
            },
            {
                selector: 'jigsaw-font-loading',
                label: '加载中',
                icon: 'assets/icon/components/basic/loading.svg'
            },
            {
                selector: 'a',
                label: '超链',
                desc: '超链不仅仅用于内外部链接跳转，也常常当做界面上的简约交互按钮使用',
                icon: 'assets/icon/components/basic/superchain.svg'
            },
            {
                selector: 'span',
                label: '单行文本',
                desc: '在界面上显示单行只读文本，常常用于表单标签、简单提示、简单出错提示等场景',
                icon: 'assets/icon/components/basic/span.svg'
            },
            {
                selector: 'p',
                label: '多行文本',
                desc: '在界面上显示多行只读文本，在界面上空间容纳不下单行文本时，则需要使用多行文本',
                icon: 'assets/icon/components/basic/p.svg'
            },
            {
                selector: 'div',
                label: 'div',
                desc: '一般用于需要深度定制视图的场合，需要对其innerHtml进行深度定制',
                icon: 'assets/icon/components/basic/div.svg'
            },
            {
                selector: 'h1',
                label: '标题1',
                desc: '标题1~标题6用于一些醒目的提示场合，字号从大到小',
                icon: 'assets/icon/components/basic/heading.svg'
            },
            {
                selector: 'h2',
                label: '标题2',
                desc: '标题1~标题6用于一些醒目的提示场合，字号从大到小',
                icon: 'assets/icon/components/basic/heading.svg'
            },
            {
                selector: 'h3',
                label: '标题3',
                desc: '标题1~标题6用于一些醒目的提示场合，字号从大到小',
                icon: 'assets/icon/components/basic/heading.svg'
            },
            {
                selector: 'h4',
                label: '标题4',
                desc: '标题1~标题6用于一些醒目的提示场合，字号从大到小',
                icon: 'assets/icon/components/basic/heading.svg'
            },
            {
                selector: 'h5',
                label: '标题5',
                desc: '标题1~标题6用于一些醒目的提示场合，字号从大到小',
                icon: 'assets/icon/components/basic/heading.svg',
                path: 'html-origin'
            },
            {
                selector: 'h6',
                label: '标题6',
                desc: '标题1~标题6用于一些醒目的提示场合，字号从大到小',
                icon: 'assets/icon/components/basic/heading.svg'
            },
            {
                selector: 'hr',
                label: '水平分割线',
                desc: '在界面上显示一根水平分割线，用于对视图做隔离/分组',
                icon: 'assets/icon/components/basic/hr.svg'
            },
            {
                selector: 'img',
                label: '图片',
                icon: 'assets/icon/components/basic/picture.svg'
            },
            {
                selector: 'awade-iframe',
                label: '内嵌网页',
                icon: 'assets/icon/components/basic/heading.svg'
            }
        ]
    },
    {
        category: '数据输入 DataEntry',
        components: [
            {
                selector: 'jigsaw-checkbox',
                label: '复选框',
                desc: '提供两个或者三个状态切换，常常用于开关配置，也常常用于组内多选的场景',
                icon: 'assets/icon/components/data-entry/checkbox.svg'
            },
            {
                selector: 'jigsaw-radios-lite',
                label: '单选框',
                desc: '提供在一组选项最多选择一项的功能，常常用于组内单选的场景',
                icon: 'assets/icon/components/data-entry/radio.svg'
            },
            {
                selector: 'jigsaw-input',
                label: '单行文本框',
                desc: '提供单行文本的读写功能，常常用于接收用户文本输入',
                icon: 'assets/icon/components/data-entry/input.svg'
            },
            {
                selector: 'jigsaw-textarea',
                label: '多行文本框',
                desc: '提供多行文本的读写功能，常常用于接收用户文本输入',
                icon: 'assets/icon/components/data-entry/txtarea.svg'
            },
            {
                selector: 'jigsaw-auto-complete-input',
                label: '自动完成输入框',
                desc: '提供与单行文本输入框相似功能，但是额外提供了输入模糊匹配和选择的能力，推荐优先使用',
                icon: 'assets/icon/components/data-entry/input.svg'
            },
            {
                selector: 'jigsaw-numeric-input',
                label: '数字输入框',
                desc: '用于接收用户输入数字，在只能输入数字的场景推荐优先使用，支持整数和浮点数',
                icon: 'assets/icon/components/data-entry/digitalinput.svg'
            },
            {
                selector: 'jigsaw-switch',
                label: '开关',
                desc: '提供两个状态切换，常常用于开关配置',
                icon: 'assets/icon/components/data-entry/switch.svg'
            },
            {
                selector: 'jigsaw-list-lite',
                label: '列表选择',
                desc: '以垂直列表形式展示一组数据，也常常用于接收用户选择的场合，支持单选和多选',
                icon: 'assets/icon/components/data-entry/list.svg'
            },
            {
                selector: 'jigsaw-list',
                label: '高级列表',
                desc: '提供列表项视图深度定制的列表功能，如非必要，请优先使用“列表选择”组件替代',
                icon: 'assets/icon/components/data-entry/list.svg'
            },
            {
                selector: 'jigsaw-tile-lite',
                label: '平铺选择',
                desc: '以水平列表形式展示一组数据，也常常用于接收用户选择的场合，支持单选和多选',
                icon: 'assets/icon/components/data-entry/comboselect.svg'
            },
            {
                selector: 'jigsaw-button-bar',
                label: '切换按钮栏',
                desc: '以水平方式铺开一组开关，常常用于处理一组相关性较大的开关的配置场景',
                icon: 'assets/icon/components/data-entry/button-bar_l.svg'
            },
            {
                selector: 'jigsaw-slider',
                label: '滑动条',
                desc: '以鼠标滑动来切换数字/状态，常常用于无需键盘的输入，也可用于展示进度信息',
                icon: 'assets/icon/components/data-entry/slider.svg'
            },
            {
                selector: 'jigsaw-time',
                label: '时间选择框',
                desc: '以平铺方式提供日期+时间的选择，只能选择一个时刻',
                icon: 'assets/icon/components/data-entry/time.svg'
            },
            {
                selector: 'jx-time-select',
                label: '下拉时间选择',
                desc: '以下拉方式提供日期+时间的选择，只能选择一个时刻',
                icon: 'assets/icon/components/containers/comboselect.svg',
                dependencies: ['jigsaw-combo-select', 'jigsaw-time']
            },
            {
                selector: 'jigsaw-range-time',
                label: '时间范围选择框',
                desc: '以平铺方式提供日期+时间的选择，可以选择一个时间范围',
                icon: 'assets/icon/components/data-entry/timerange.svg'
            },
            {
                selector: 'jx-range-time-select',
                label: '下拉时间范围选择',
                desc: '以下拉方式提供日期+时间的选择，可以选择一个时间范围',
                icon: 'assets/icon/components/containers/comboselect.svg',
                dependencies: ['jigsaw-combo-select', 'jigsaw-range-time']
            },
            {
                selector: 'jigsaw-select',
                label: '下拉框',
                desc: '以下拉方式提供垂直列表选择，支持单选和多选',
                icon: 'assets/icon/components/data-entry/dropdownselect.svg'
            },
            {
                selector: 'jigsaw-cascade',
                label: '级联选择',
                desc: '专用于处理有级联关系的数据的选择，比如省/市/区就是一个典型的级联关系',
                icon: 'assets/icon/components/data-entry/cascade.svg'
            },
            {
                selector: 'jigsaw-transfer',
                label: '穿梭框',
                desc: '专用于处理条目非常多的组内多选场景，支持各种分页，支持超大数据集',
                icon: 'assets/icon/components/data-entry/transfer.svg'
            },
            {
                selector: 'jigsaw-upload',
                label: '上传控件',
                desc: '提供文件上传入口，支持文件类型过滤，单选多选等',
                icon: 'assets/icon/components/data-entry/upload.svg'
            },
            {
                selector: 'jigsaw-rate',
                label: '评分控件',
                desc: '提供自定义图标评分，支持半分粒度',
                icon: 'assets/icon/components/data-entry/star.svg'
            }
        ]
    },
    {
        category: '数据呈现 DataDisplay',
        components: [
            {
                selector: 'uid-basic-gis',
                label: 'Basic GIS',
                desc: '基础 WebGIS 组件，对 WebGIS 提供极简包装，支持最多4个GIS同框对比',
                icon: 'assets/icon/components/data-display/webgis.svg'
            },
            {
                selector: 'jigsaw-graph',
                label: '图形',
                desc: '提供了各种数据可视化功能，基于 echarts，且与 echarts 能力相同',
                icon: 'assets/icon/components/data-display/graph.svg'
            },
            {
                selector: 'jigsaw-table',
                label: '数据表',
                desc: '提供了功能强大的二维数据展示能力',
                icon: 'assets/icon/components/data-display/table.svg'
            },
            {
                selector: 'jigsaw-list-lite',
                label: '列表展示',
                desc: '以垂直列表形式展示一组数据，也常常用于接收用户选择的场合，支持单选和多选',
                icon: 'assets/icon/components/data-display/list.svg'
            },
            {
                selector: 'jigsaw-tile-lite',
                label: '平铺展示',
                desc: '以水平列表形式展示一组数据，也常常用于接收用户选择的场合，支持单选和多选',
                icon: 'assets/icon/components/data-display/comboselect.svg'
            },
            {
                selector: 'jigsaw-tree-ext',
                label: '树',
                desc: '以树桩形式展示有层级结构的数据，支持拖拽树节点、节点改名、节点删除等功能',
                icon: 'assets/icon/components/data-display/tree.svg'
            },
        ]
    },
    {
        category: '导航 Navigation',
        components: [
            {
                selector: 'jigsaw-pagination',
                label: '分页',
                desc: '提供数据分页功能，常常与数据表配合使用，也可与其他组件配合使用',
                icon: 'assets/icon/components/navigation/pagination.svg'
            },
            {
                selector: 'router-outlet',
                label: '路由插座',
                desc: '这是路由实际视图在设计师的占位符，路由实际视图需要在运行/预览时才能够有实际效果',
                icon: 'assets/icon/components/containers/u4073.png'
            },
            {
                selector: 'jigsaw-breadcrumb',
                label: '面包屑',
                desc: '留下用户访问过的历史状态，并提供快速切换到历史状态的导航能力',
                icon: 'assets/icon/components/containers/breadcrume.svg'
            },
        ]
    },
    {
        category: "布局 Layout", components: [
            {
                selector: 'awade-placeholder',
                label: '占位符/空白',
                desc: '在实现响应式布局时常常需要使用到的辅助组件',
                icon: 'assets/icon/components/containers/u4073.png'
            },
        ]
    },
    { category: "反馈 Feedback", components: [] },
];
/* unused harmony export categories */

const metadatas = {
    "uid-basic-gis": __WEBPACK_IMPORTED_MODULE_3__awade_uid_basic_gis__["a" /* AwadeBasicGis */],
    "awade-layout": __WEBPACK_IMPORTED_MODULE_4__awade_awade_layout__["a" /* AwadeLayout */],
    "a": __WEBPACK_IMPORTED_MODULE_5__html_origin_a__["a" /* AwadeA */],
    "div": __WEBPACK_IMPORTED_MODULE_6__html_origin_div__["a" /* AwadeDiv */],
    "h1": __WEBPACK_IMPORTED_MODULE_7__html_origin_h1__["a" /* AwadeH1 */],
    "h2": __WEBPACK_IMPORTED_MODULE_8__html_origin_h2__["a" /* AwadeH2 */],
    "h3": __WEBPACK_IMPORTED_MODULE_9__html_origin_h3__["a" /* AwadeH3 */],
    "h4": __WEBPACK_IMPORTED_MODULE_10__html_origin_h4__["a" /* AwadeH4 */],
    "h5": __WEBPACK_IMPORTED_MODULE_11__html_origin_h5__["a" /* AwadeH5 */],
    "h6": __WEBPACK_IMPORTED_MODULE_12__html_origin_h6__["a" /* AwadeH6 */],
    "hr": __WEBPACK_IMPORTED_MODULE_13__html_origin_hr__["a" /* AwadeHr */],
    "img": __WEBPACK_IMPORTED_MODULE_14__html_origin_img__["a" /* AwadeImg */],
    "p": __WEBPACK_IMPORTED_MODULE_15__html_origin_p__["a" /* AwadeP */],
    "span": __WEBPACK_IMPORTED_MODULE_17__html_origin_span__["a" /* AwadeSpan */],
    "jigsaw-float": __WEBPACK_IMPORTED_MODULE_60__directive_jigsaw_float__["a" /* AwadeFloatDirective */],
    'j-upload': __WEBPACK_IMPORTED_MODULE_62__directive_jigsaw_upload_directive__["a" /* AwadeUploadDirective */],
    "awade-popupable-component": __WEBPACK_IMPORTED_MODULE_61__awade_awade_popupable_component__["a" /* AwadePopupableComponent */],
    "awade-placeholder": __WEBPACK_IMPORTED_MODULE_53__awade_awade_placeholder__["a" /* AwadePlaceholder */],
    "awade-group": __WEBPACK_IMPORTED_MODULE_54__awade_awade_group__["a" /* AwadeGroup */],
    "awade-group-layout": __WEBPACK_IMPORTED_MODULE_55__awade_awade_group_layout__["a" /* AwadeGroupLayout */],
    "awade-iframe": __WEBPACK_IMPORTED_MODULE_16__awade_awade_iframe__["a" /* AwadeIframe */],
    "jigsaw-box": __WEBPACK_IMPORTED_MODULE_0__jigsaw_jigsaw_box__["a" /* AwadeJigsawBox */],
    "jigsaw-button": __WEBPACK_IMPORTED_MODULE_18__jigsaw_jigsaw_button__["a" /* AwadeJigsawButton */],
    "jigsaw-button-bar": __WEBPACK_IMPORTED_MODULE_19__jigsaw_jigsaw_button_bar__["a" /* AwadeJigsawButtonBar */],
    "jigsaw-cascade": __WEBPACK_IMPORTED_MODULE_20__jigsaw_jigsaw_cascade__["a" /* AwadeJigsawCascade */],
    "jigsaw-checkbox": __WEBPACK_IMPORTED_MODULE_21__jigsaw_jigsaw_checkbox__["a" /* AwadeJigsawCheckbox */],
    "jigsaw-combo-select": __WEBPACK_IMPORTED_MODULE_22__jigsaw_jigsaw_combo_select__["a" /* AwadeJigsawComboSelect */],
    "awade-combo-layout": __WEBPACK_IMPORTED_MODULE_50__awade_awade_combo_layout__["a" /* AwadeComboLayout */],
    "jigsaw-dialog": __WEBPACK_IMPORTED_MODULE_23__jigsaw_jigsaw_dialog__["a" /* AwadeJigsawDialog */],
    "jigsaw-drawer": __WEBPACK_IMPORTED_MODULE_24__jigsaw_jigsaw_drawer__["a" /* AwadeJigsawDrawer */],
    "awade-drawer-layout": __WEBPACK_IMPORTED_MODULE_51__awade_awade_drawer_layout__["a" /* AwadeDrawerLayout */],
    "jigsaw-graph": __WEBPACK_IMPORTED_MODULE_25__jigsaw_jigsaw_graph__["a" /* AwadeJigsawGraph */],
    "jigsaw-input": __WEBPACK_IMPORTED_MODULE_26__jigsaw_jigsaw_input__["a" /* AwadeJigsawInput */],
    "jigsaw-auto-complete-input": __WEBPACK_IMPORTED_MODULE_27__jigsaw_jigsaw_auto_complete_input__["a" /* AwadeJigsawAutoCompleteInput */],
    "jigsaw-list": __WEBPACK_IMPORTED_MODULE_28__jigsaw_jigsaw_list__["a" /* AwadeJigsawList */],
    "jigsaw-list-lite": __WEBPACK_IMPORTED_MODULE_29__jigsaw_jigsaw_list_lite__["a" /* AwadeJigsawListLite */],
    "jigsaw-numeric-input": __WEBPACK_IMPORTED_MODULE_30__jigsaw_jigsaw_numeric_input__["a" /* AwadeJigsawNumericInput */],
    "jigsaw-pagination": __WEBPACK_IMPORTED_MODULE_31__jigsaw_jigsaw_pagination__["a" /* AwadeJigsawPagination */],
    "jigsaw-radios-lite": __WEBPACK_IMPORTED_MODULE_32__jigsaw_jigsaw_radios_lite__["a" /* AwadeJigsawRadiosLite */],
    "jigsaw-range-time": __WEBPACK_IMPORTED_MODULE_33__jigsaw_jigsaw_range_time__["a" /* AwadeJigsawRangeTime */],
    "jigsaw-select": __WEBPACK_IMPORTED_MODULE_1__jigsaw_jigsaw_select__["a" /* AwadeJigsawSelect */],
    "jigsaw-slider": __WEBPACK_IMPORTED_MODULE_34__jigsaw_jigsaw_slider__["a" /* AwadeJigsawSlider */],
    "jigsaw-switch": __WEBPACK_IMPORTED_MODULE_35__jigsaw_jigsaw_switch__["a" /* AwadeJigsawSwitch */],
    "jigsaw-table": __WEBPACK_IMPORTED_MODULE_36__jigsaw_jigsaw_table__["a" /* AwadeJigsawTable */],
    "jigsaw-tabs": __WEBPACK_IMPORTED_MODULE_49__jigsaw_jigsaw_tabs__["a" /* AwadeJigsawTabs */],
    "awade-tabs-layout": __WEBPACK_IMPORTED_MODULE_48__awade_awade_tabs_layout__["a" /* AwadeTabsLayout */],
    "jigsaw-tile-lite": __WEBPACK_IMPORTED_MODULE_2__jigsaw_jigsaw_tile_lite__["a" /* AwadeJigsawTileLite */],
    "jigsaw-time": __WEBPACK_IMPORTED_MODULE_37__jigsaw_jigsaw_time__["a" /* AwadeJigsawTime */],
    "jigsaw-tree-ext": __WEBPACK_IMPORTED_MODULE_38__jigsaw_jigsaw_tree_ext__["a" /* AwadeJigsawTreeExt */],
    "jx-range-time-select": __WEBPACK_IMPORTED_MODULE_39__jigsaw_jx_range_time_select__["a" /* AwadeJxRangeTimeSelect */],
    "jx-time-select": __WEBPACK_IMPORTED_MODULE_40__jigsaw_jx_time_select__["a" /* AwadeJxTimeSelect */],
    "jigsaw-icon": __WEBPACK_IMPORTED_MODULE_41__jigsaw_jigsaw_icon__["a" /* AwadeJigsawIcon */],
    "jigsaw-rate": __WEBPACK_IMPORTED_MODULE_59__jigsaw_jigsaw_rate__["a" /* AwadeJigsawRate */],
    "jigsaw-tag": __WEBPACK_IMPORTED_MODULE_42__jigsaw_jigsaw_tag__["a" /* AwadeJigsawTag */],
    "jigsaw-font-loading": __WEBPACK_IMPORTED_MODULE_43__jigsaw_jigsaw_loading__["a" /* AwadeJigsawLoading */],
    "jigsaw-transfer": __WEBPACK_IMPORTED_MODULE_44__jigsaw_jigsaw_transfer__["a" /* AwadeJigsawTransfer */],
    "router-outlet": __WEBPACK_IMPORTED_MODULE_46__angular_router_outlet__["a" /* RouterOutlet */],
    "jigsaw-upload": __WEBPACK_IMPORTED_MODULE_45__jigsaw_jigsaw_upload__["a" /* AwadeJigsawUpload */],
    "jigsaw-breadcrumb": __WEBPACK_IMPORTED_MODULE_47__jigsaw_jigsaw_breadcrumb__["a" /* AwadeJigsawBreadcrumb */],
    "jigsaw-textarea": __WEBPACK_IMPORTED_MODULE_52__jigsaw_jigsaw_textarea__["a" /* AwadeJigsawTextarea */],
    "jx-view-stack": __WEBPACK_IMPORTED_MODULE_56__jigsaw_jx_view_stack__["a" /* AwadeViewStack */],
    'awade-view-stack-layout': __WEBPACK_IMPORTED_MODULE_57__awade_awade_view_stack_layout__["a" /* AwadeViewStackLayout */],
    'ngx-if': __WEBPACK_IMPORTED_MODULE_58__angular_ngx_if__["a" /* AwadeNgIf */],
    'awade-repeat-component': __WEBPACK_IMPORTED_MODULE_63__awade_awade_repeat_component__["a" /* AwadeRepeatComponent */],
    'awade-repeat': __WEBPACK_IMPORTED_MODULE_64__awade_awade_repeat__["a" /* AwadeRepeat */]
};
/* harmony export (immutable) */ __webpack_exports__["a"] = metadatas;



/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawBox extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-box';
        this.tagName = 'jigsaw-box';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawBox';
        this.grow = 1;
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'resizable', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'justify',
                type: '"start"|"end"|"center"|"between"|"around" as BoxJustify',
                default: '"around"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'align', type: '"start"|"end"|"center"|"baseline"|"stretch" as BoxAlign', default: '"center"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'order', type: "number"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'direction', type: '"horizontal"|"vertical" as Direction', default: '"vertical"'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawBox.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    beforeCreate(svd) {
        if (svd.children == undefined) {
            svd.children = [];
            let placeholder = svd.createPlaceHolder();
            svd.children.push(placeholder);
            svd.save();
        }
    }
    onInit(metadata, inst) {
        if (inst) {
            inst.resizable = true;
        }
    }
    afterContentInit(metadata, inst) {
        if (!inst) {
            return;
        }
        inst.resize.subscribe(event => {
            metadata.grow = event.grow;
            metadata.save();
        });
        if (metadata.children && metadata.children.length > 1) {
            let childrenBox = inst._$childrenBox;
            for (let i = metadata.children.length - 1; i >= 0; i--) {
                if (!childrenBox[i].resize.observers || childrenBox[i].resize.observers.length == 0) {
                    childrenBox[i].resizable = true;
                    childrenBox[i].resize.subscribe(event => {
                        metadata.children[i].grow = event.grow;
                        metadata.children[i].save();
                    });
                }
            }
        }
    }
    getAttributeHtml(svd) {
        let attributes = [];
        svd.inputs && svd.inputs.forEach(input => attributes.push(input.toAttribute(svd)));
        svd.outputs && svd.outputs.forEach(output => attributes.push(output.toAttribute(svd)));
        svd.events && svd.events.forEach(event => attributes.push(event.toAttribute(svd)));
        return `<${svd.tagName} [perfectScrollbar]="{wheelSpeed: 0.5, wheelPropagation: true}"
                    [grow]="${svd.grow}" style="min-width: 22px;min-height:22px" ${attributes.join(' ')}
                    #${svd.id} agent="${svd.agentId}" class="${svd.id}_class" `;
    }
    htmlCoder(svd, env) {
        let htmlStr = this.getAttributeHtml(svd);
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        htmlStr += ` ${membersDefine.ngStyle} >`;
        if (svd.children && svd.children.length > 0) {
            for (let item of svd.children) {
                let itemCoderResult;
                let itemTagName = item.tagName || item.selector;
                // 对于给组件自动添加的box，属性取相应实际控件的值，这样在隐藏的时候，等于直接作用于box上
                const itemHtmlCoder = item.htmlCoder(item, env);
                if (svd.children.length > 1 && itemTagName != 'jigsaw-box') {
                    itemCoderResult = `
                        <jigsaw-box [grow]="${item.grow}" [perfectScrollbar]="{wheelSpeed: 0.5, wheelPropagation: true}" 
                                    style="min-width: 22px;min-height:22px" >${itemHtmlCoder.htmlStr}</jigsaw-box>
                    `;
                }
                else {
                    itemCoderResult = itemHtmlCoder.htmlStr;
                }
                membersDefine.members.push(itemHtmlCoder.member);
                htmlStr += itemCoderResult;
            }
        }
        htmlStr += `</${this.getTagName(svd)}>`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawBox;

AwadeJigsawBox.layout = {
    left: 0,
    top: 0,
    width: 10,
    height: 10,
    scaleDirection: 'both'
};


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeJigsawSelect extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-select';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawSelect';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__["a" /* GeneralAjaxInput */]({
                property: 'data', type: "any[]", required: true, default: `["条目1","条目2","条目3","条目4","条目5"]`,
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'value', type: "any"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'trackItemBy', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'labelField', type: 'string', default: 'label'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'clearable', type: "boolean", default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'placeholder', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'disabled', type: 'boolean', default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'optionWidth', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'optionHeight', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'autoWidth', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'optionCount', type: 'number'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'multipleSelect', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'searchable', type: 'boolean', default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'openTrigger', type: "'click'|'mouseenter' as OpenTrigger", default: '"mouseenter"'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'closeTrigger', type: "'click'|'mouseleave' as CloseTrigger", default: '"mouseleave"'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'valueChange'
            })];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawSelect.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawSelect;

AwadeJigsawSelect.layout = {
    left: 0,
    top: 0,
    width: 15,
    height: 4,
    scaleDirection: 'none'
};


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeJigsawTileLite extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-tile-lite';
        this.className = 'JigsawTileLite';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__["a" /* GeneralAjaxInput */]({
                property: 'data', type: 'GroupOptionValue[]', required: true,
                default: `["条目1","条目2","条目3","条目4","条目5"]`
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'selectedItems', type: 'any[]'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'trackItemBy', type: ["string", "string[]"]
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'labelField', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'multipleSelect', type: "boolean"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'optionWidth', type: ["string", "number"]
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'optionHeight', type: ["string", "number"]
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'selectedItemsChange'
            })];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawTileLite.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [width]="'100%'" `;
            return ngStyle;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawTileLite;

AwadeJigsawTileLite.layout = {
    left: 0,
    top: 0,
    width: 44,
    height: 6,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeBasicGis extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'uid-basic-gis';
        this.tagName = 'uid-basic-gis';
        this.className = 'UIDBasicGIS';
        this.importFrom = '@awade/uid-sdk';
        this._pointerEvents = 'none';
        this.operations = [
            {
                icon: 'iconfont iconfont-e8e4', label: '启用鼠标事件', tooltip: '启用鼠标事件', context: true, type: 'pointer'
            }
        ];
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'src', type: 'string', default: '/webgis/map.html'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'maps', type: 'number', default: 1
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'ready',
                snippets: [
                    new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredSnippet"]({
                        name: '初始化地图脚本',
                        desc: '调用Webgis的InitMap接口，完成地图初始化',
                        script: (svd) => {
                            return `
                                var userName = "admin";
                                var pageName = "test";		
                                var hostIP = "127.0.0.1";
                                var options = {
                                    center: [103.7, 39],
                                    zoomLevel:3,
                                };	
                                this.${svd.id}.api.InitMap(userName,pageName,hostIP,options);
                            `;
                        },
                        type: __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredSnippet"].SNIPPET_TYPE_OUTPUT_CODEBLOCK
                    })
                ]
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'InitMap',
                snippets: [
                    new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredSnippet"]({
                        name: '加载工参脚本',
                        desc: '调用Webgis的LoadCells接口，加载工参数据',
                        script: (svd) => {
                            return `
                                var systemType = "GSM";
                                var serveFileName = "/home/netnumen/ems/ums-server/procs/ppus/webgis.ppu/webgis-web.pmu/webgis.ear/webgis.war/data/test/GSM.csv";
                                var options = {
                                    minLevel: 3,
                                    maxLevel: 13
                                };	
                                this.${svd.id}.api.LoadCells(systemType, serveFileName,"","",function callback(success,errorinfo){
                                    console.log('LoadCells => ', success);
                                },options);
                            `;
                        },
                        type: __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredSnippet"].SNIPPET_TYPE_OUTPUT_CODEBLOCK
                    })
                ]
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'CellInfoWindowShowing'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'GridInfoWindowShowing'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'PAInfoWindowShowing'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'NewCallInfoWindowShowing'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'CallInfoWindowShowing'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeBasicGis.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    onOperation(svd, inst, operation) {
        switch (operation.type) {
            case 'pointer':
                this._pointerEvents = __WEBPACK_IMPORTED_MODULE_0__util_utils__["a" /* MetadataUtil */].switchPointerEvent(svd.agentId, inst, operation);
                break;
            default:
        }
    }
    afterContentInit(svd, inst) {
        if (this._pointerEvents) {
            inst.pointerEvents = this._pointerEvents;
        }
    }
    onInit(svd, inst) {
        let awadeRuntime = __WEBPACK_IMPORTED_MODULE_0__util_utils__["a" /* MetadataUtil */].getAwadeRuntime();
        if (awadeRuntime.hasOwnProperty(svd.agentId)) {
            this._pointerEvents = awadeRuntime[svd.agentId].toolBar.pointer;
        }
        // 设置初始toolbar状态
        __WEBPACK_IMPORTED_MODULE_0__util_utils__["a" /* MetadataUtil */].setPointerEvent(this._pointerEvents, this.operations[0]);
    }
    getAttributeHtml(svd, env) {
        let htmlStr = '';
        const attributes = [];
        svd.inputs && svd.inputs.forEach(input => attributes.push(input.toAttribute(svd)));
        svd.outputs && svd.outputs.forEach(output => attributes.push(output.toAttribute(svd)));
        svd.events && svd.events.forEach(event => attributes.push(event.toAttribute(svd)));
        const tagName = this.getTagName(svd);
        if (svd.agentId) {
            htmlStr = `<${tagName} ${env.target !== 'dev' ? 'pointerEvents="auto"' : ''}  ${attributes.join(' ')} #${svd.id} 
            agent="${svd.agentId}" class="${svd.id}_class" [perfectScrollbar]="{wheelSpeed: 0.5, wheelPropagation: true, minScrollbarLength: 40}"`;
        }
        else {
            htmlStr = `<${tagName} ${env.target !== 'dev' ? 'pointerEvents="auto"' : ''} ${attributes.join(' ')} #${svd.id} 
            class="${svd.id}_class" [perfectScrollbar]="{wheelSpeed: 0.5, wheelPropagation: true, minScrollbarLength: 40}"`;
        }
        return htmlStr;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeBasicGis;

AwadeBasicGis.layout = {
    left: 0,
    top: 0,
    width: 30,
    height: 30,
    scaleDirection: 'both'
};


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeA extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'a';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'href', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'target', type: "'_blank'|'_self' as Target", default: '"_blank"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '链接'
            })
        ];
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeA.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    getAttributeHtml(svd, env) {
        let htmlStr = '';
        const attributes = [];
        svd.inputs && svd.inputs.forEach(input => attributes.push(input.toAttribute(svd)));
        svd.outputs && svd.outputs.forEach(output => attributes.push(output.toAttribute(svd)));
        svd.events && svd.events.forEach(event => attributes.push(event.toAttribute(svd)));
        const tagName = this.getTagName(svd);
        if (svd.agentId) {
            htmlStr = `<${tagName} ${attributes.join(' ')} #${svd.id} agent="${svd.agentId}" class="${svd.id}_class"`;
        }
        else {
            htmlStr = `<${tagName} ${attributes.join(' ')} #${svd.id} class="${svd.id}_class"`;
        }
        return htmlStr;
    }
    sizeCoder(svd, type) {
        return '';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeA;

AwadeA.layout = {
    left: 0,
    top: 0,
    width: 3,
    height: 2,
    scaleDirection: 'none'
};


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_div_base__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeDiv extends __WEBPACK_IMPORTED_MODULE_0__common_div_base__["a" /* AwadeDivBase */] {
    constructor() {
        super();
        this.selector = 'div';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: ''
            })
        ];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeDiv;



/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeH1 extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'h1';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '标题 H1'
            })
        ];
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeH1.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeH1;

AwadeH1.layout = {
    left: 0,
    top: 0,
    width: 18,
    height: 5,
    scaleDirection: 'horizontal'
};


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeH2 extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'h2';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '标题 H2'
            })
        ];
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeH2.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeH2;

AwadeH2.layout = {
    left: 0,
    top: 0,
    width: 15,
    height: 4,
    scaleDirection: 'horizontal'
};


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeH3 extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'h3';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '标题 H3'
            })
        ];
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeH3.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeH3;

AwadeH3.layout = {
    left: 0,
    top: 0,
    width: 12,
    height: 4,
    scaleDirection: 'horizontal'
};


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeH4 extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'h4';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '标题 H4'
            })
        ];
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeH4.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeH4;

AwadeH4.layout = {
    left: 0,
    top: 0,
    width: 9,
    height: 3,
    scaleDirection: 'horizontal'
};


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeH5 extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'h5';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '标题 H5'
            })
        ];
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeH5.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeH5;

AwadeH5.layout = {
    left: 0,
    top: 0,
    width: 7,
    height: 2,
    scaleDirection: 'horizontal'
};


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeH6 extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'h6';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '标题 H6'
            })
        ];
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeH6.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeH6;

AwadeH6.layout = {
    left: 0,
    top: 0,
    width: 6,
    height: 2,
    scaleDirection: 'horizontal'
};


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeHr extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'hr';
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            return ` [style.width]="'100%'" `;
        }
    }
    htmlCoder(svd) {
        let htmlStr = this.getAttributeHtml(svd);
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        htmlStr += ` ${membersDefine.ngStyle} >`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeHr.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeHr;

AwadeHr.layout = {
    left: 0,
    top: 0,
    width: 30,
    height: 1,
    scaleDirection: 'horizontal',
    align_items: 'center'
};


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeImg extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'img';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'src',
                type: 'string',
                required: true,
                default: 'awade-assets/sample.ico'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'alt', type: "string", default: "图片路径错误，无法显示"
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeImg.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    htmlCoder(svd, env) {
        let htmlStr = this.getAttributeHtml(svd, env);
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        htmlStr += ` ${membersDefine.ngStyle} >`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
    getAttributeHtml(svd, env) {
        let htmlStr = '';
        const attributes = [];
        svd.inputs && svd.inputs.forEach(input => {
            if (!input.hasOwnProperty('value')) {
                input.value = { initial: input.default };
            }
            attributes.push(input.toAttribute(svd));
        });
        svd.outputs && svd.outputs.forEach(output => attributes.push(output.toAttribute(svd)));
        svd.events && svd.events.forEach(event => attributes.push(event.toAttribute(svd)));
        const tagName = this.getTagName(svd);
        if (svd.agentId) {
            htmlStr = `<${tagName} ${attributes.join(' ')} #${svd.id} agent="${svd.agentId}" class="${svd.id}_class"`;
        }
        else {
            htmlStr = `<${tagName} ${attributes.join(' ')} #${svd.id} class="${svd.id}_class"`;
        }
        return htmlStr;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeImg;

AwadeImg.layout = {
    left: 0,
    top: 0,
    width: 32,
    height: 32,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeP extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'p';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '一段文本'
            })
        ];
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeP.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    getAttributeHtml(svd, env) {
        let htmlStr = '';
        const attributes = [];
        svd.inputs && svd.inputs.forEach(input => attributes.push(input.toAttribute(svd)));
        svd.outputs && svd.outputs.forEach(output => attributes.push(output.toAttribute(svd)));
        svd.events && svd.events.forEach(event => attributes.push(event.toAttribute(svd)));
        const tagName = this.getTagName(svd);
        if (svd.agentId) {
            htmlStr = `<${tagName} ${attributes.join(' ')} #${svd.id} agent="${svd.agentId}" class="${svd.id}_class" [perfectScrollbar]="{wheelSpeed: 0.5, wheelPropagation: true, minScrollbarLength: 20}"`;
        }
        else {
            htmlStr = `<${tagName} ${attributes.join(' ')} #${svd.id} class="${svd.id}_class" [perfectScrollbar]="{wheelSpeed: 0.5, wheelPropagation: true, minScrollbarLength: 20}"`;
        }
        return htmlStr;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeP;

AwadeP.layout = {
    left: 0,
    top: 0,
    width: 6,
    height: 3,
    scaleDirection: 'horizontal'
};


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeIframe extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'awade-iframe';
        this.tagName = 'awade-iframe';
        this.className = 'AwadeIframeComponent';
        this.importFrom = '@awade/uid-sdk';
        this._pointerEvents = 'none';
        this.operations = [
            {
                icon: 'iconfont iconfont-e8e4', label: '启用鼠标事件', tooltip: '启用鼠标事件', context: true, type: 'pointer'
            }
        ];
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'src',
                type: 'string',
                required: true,
                default: '/rdk/app/ui-designer/compiler/module/src/component-metadata/awade/awade-iframe-default-page.html'
            })
        ];
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeIframe.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    onOperation(svd, inst, operation) {
        switch (operation.type) {
            case 'pointer':
                this._pointerEvents = __WEBPACK_IMPORTED_MODULE_0__util_utils__["a" /* MetadataUtil */].switchPointerEvent(svd.agentId, inst, operation);
                break;
            default:
        }
    }
    ;
    getAttributeHtml(svd, env) {
        let htmlStr = '';
        const attributes = [];
        svd.inputs && svd.inputs.forEach(input => attributes.push(input.toAttribute(svd)));
        svd.outputs && svd.outputs.forEach(output => attributes.push(output.toAttribute(svd)));
        svd.events && svd.events.forEach(event => attributes.push(event.toAttribute(svd)));
        const tagName = this.getTagName(svd);
        if (svd.agentId) {
            htmlStr = `<${tagName} ${env.target !== 'dev' ? 'pointerEvents="auto"' : ''}  ${attributes.join(' ')} #${svd.id} 
            agent="${svd.agentId}" class="${svd.id}_class" [perfectScrollbar]="{wheelSpeed: 0.5, wheelPropagation: true, minScrollbarLength: 40}"`;
        }
        else {
            htmlStr = `<${tagName} ${env.target !== 'dev' ? 'pointerEvents="auto"' : ''} ${attributes.join(' ')} #${svd.id} 
            class="${svd.id}_class" [perfectScrollbar]="{wheelSpeed: 0.5, wheelPropagation: true, minScrollbarLength: 40}"`;
        }
        return htmlStr;
    }
    afterContentInit(svd, inst) {
        if (this._pointerEvents) {
            inst.pointerEvents = this._pointerEvents;
        }
    }
    onInit(svd, inst) {
        let awadeRuntime = __WEBPACK_IMPORTED_MODULE_0__util_utils__["a" /* MetadataUtil */].getAwadeRuntime();
        if (awadeRuntime.hasOwnProperty(svd.agentId)) {
            this._pointerEvents = awadeRuntime[svd.agentId].toolBar.pointer;
        }
        // 设置初始toolbar状态
        __WEBPACK_IMPORTED_MODULE_0__util_utils__["a" /* MetadataUtil */].setPointerEvent(this._pointerEvents, this.operations[0]);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeIframe;

AwadeIframe.layout = {
    left: 0,
    top: 0,
    width: 30,
    height: 30,
    scaleDirection: 'both'
};


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeSpan extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'span';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '单行文本'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['font', 'opacity', 'visibility', 'background', 'border', 'shadow'],
            defaultStyle: 'display: inline-block;max-width: 100%;overflow: hidden;text-overflow: ellipsis; white-space: nowrap; '
        });
    }
    sizeCoder(svd, type) {
        return '';
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeSpan.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeSpan;

AwadeSpan.layout = {
    left: 0,
    top: 0,
    width: 6,
    height: 3,
    scaleDirection: 'horizontal'
};


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawButton extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-button';
        this.className = 'JigsawButton';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'preSize', type: "'small'|'default'|'large' as preSize", default: '"default"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'colorType',
                type: '"default"|"primary"|"warning"|"error"|"danger" as colorType',
                default: '"default"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'disabled', type: "boolean", default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '按钮'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawButton.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            return ` [width]="'100%'" `;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawButton;

AwadeJigsawButton.layout = {
    left: 0,
    top: 0,
    width: 10,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeJigsawButtonBar extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-button-bar';
        this.className = 'JigsawButtonBar';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'colorType',
                type: '"default"|"primary"|"warning"|"error"|"danger" as colorType',
                default: '"primary"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__["a" /* GeneralAjaxInput */]({
                property: 'data', type: 'GroupOptionValue[]', required: true,
                default: '["选项1","选项2","选项3"]'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'selectedItems', type: 'any[]'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'trackItemBy', type: ["string", "string[]"]
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'labelField', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'selectedItemsChange'
            })];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['height', 'margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        return '';
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawButtonBar.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawButtonBar;

AwadeJigsawButtonBar.layout = {
    left: 0,
    top: 0,
    width: 23,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawCascade extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-cascade';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawCascade';
        this.inputs = [
            new DataInput(),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'dataGenerator', type: "any"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'generatorContext', type: "any"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'selectedItems', type: "any[]"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'labelField', type: "string", default: "label"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'trackItemBy', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'multipleSelect', type: "boolean", default: false
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'selectedItemsChange'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [width]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawCascade.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawCascade;

AwadeJigsawCascade.layout = {
    left: 0,
    top: 0,
    width: 19,
    height: 12,
    scaleDirection: 'none',
    align_items: 'center'
};
class DataInput extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"] {
    constructor() {
        super();
        this.property = 'data';
        this.type = ['TreeData'];
        this.required = true;
        this.selectedType = 'TreeData';
        this.default = `
        {
            nodes: [
                {
                    label:"北京市",
                    nodes:[
                        {label:"东城区"},
                        {label:"西城区"},
                        {label:"朝阳区"},
                        {label:"丰台区"},
                        {label:"石景山区"},
                        {label:"海淀区"},
                        {label:"顺义区"},
                        {label:"通州区"},
                        {label:"大兴区"},
                        {label:"房山区"},
                        {label:"门头沟区"},
                        {label:"昌平区"},
                        {label:"平谷区"},
                        {label:"密云区"},
                        {label:"怀柔区"},
                        {label:"延庆区"}
                    ],
                    title:"区"
                },
                {
                    label:"江苏省",
                    nodes:[
                        {
                            label:"南京市",
                            nodes:[
                                {label:"玄武区"},
                                {label:"秦淮区"},
                                {label:"鼓楼区"},
                                {label:"建邺区"},
                                {label:"雨花台区"},
                                {label:"栖霞区"},
                                {label:"浦口区"},
                                {label:"六合区"},
                                {label:"江宁区"},
                                {label:"溧水区"},
                                {label:"高淳区"}
                            ],
                            title:"区"
                        },
                        {
                            label:"无锡市",
                            nodes:[
                                {label:"梁溪区"},
                                {label:"滨湖区"},
                                {label:"惠山区"},
                                {label:"锡山区"},
                                {label:"新吴区"},
                                {label:"江阴市"},
                                {label:"宜兴市"}
                            ],
                            title:"区"
                        },
                        {
                            label:"苏州市",
                            nodes:[
                                {label:"姑苏区"},
                                {label:"相城区"},
                                {label:"吴中区"},
                                {label:"虎丘区"},
                                {label:"吴江区"},
                                {label:"常熟市"},
                                {label:"昆山市"},
                                {label:"张家港市"},
                                {label:"太仓市"}
                            ],
                            title:"区"
                        }
                    ],
                    title:"市"
                }
            ],
            title: "省/直辖市"
        }
    `;
        this.snippets.push(new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '默认数据',
            desc: '默认的数据格式，可供参考',
            script: `
                    {
                        nodes: [
                            {
                                label:"北京市",
                                nodes:[
                                    {label:"东城区"},
                                    {label:"西城区"},
                                    {label:"朝阳区"},
                                    {label:"丰台区"},
                                    {label:"石景山区"},
                                    {label:"海淀区"},
                                    {label:"顺义区"},
                                    {label:"通州区"},
                                    {label:"大兴区"},
                                    {label:"房山区"},
                                    {label:"门头沟区"},
                                    {label:"昌平区"},
                                    {label:"平谷区"},
                                    {label:"密云区"},
                                    {label:"怀柔区"},
                                    {label:"延庆区"}
                                ],
                                title:"区"
                            },
                            {
                                label:"江苏省",
                                nodes:[
                                    {
                                        label:"南京市",
                                        nodes:[
                                            {label:"玄武区"},
                                            {label:"秦淮区"},
                                            {label:"鼓楼区"},
                                            {label:"建邺区"},
                                            {label:"雨花台区"},
                                            {label:"栖霞区"},
                                            {label:"浦口区"},
                                            {label:"六合区"},
                                            {label:"江宁区"},
                                            {label:"溧水区"},
                                            {label:"高淳区"}
                                        ],
                                        title:"区"
                                    },
                                    {
                                        label:"无锡市",
                                        nodes:[
                                            {label:"梁溪区"},
                                            {label:"滨湖区"},
                                            {label:"惠山区"},
                                            {label:"锡山区"},
                                            {label:"新吴区"},
                                            {label:"江阴市"},
                                            {label:"宜兴市"}
                                        ],
                                        title:"区"
                                    },
                                    {
                                        label:"苏州市",
                                        nodes:[
                                            {label:"姑苏区"},
                                            {label:"相城区"},
                                            {label:"吴中区"},
                                            {label:"虎丘区"},
                                            {label:"吴江区"},
                                            {label:"常熟市"},
                                            {label:"昆山市"},
                                            {label:"张家港市"},
                                            {label:"太仓市"}
                                        ],
                                        title:"区"
                                    }
                                ],
                                title:"市"
                            }
                        ],
                        title: "省/直辖市"
                    }
                `,
            filter: sourceType => sourceType == 'initial'
        }));
    }
    ;
}
/* unused harmony export DataInput */



/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawCheckbox extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-checkbox';
        this.className = 'JigsawCheckBox';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'checked', type: "boolean", default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'disabled', type: "boolean", default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'enableIndeterminate', type: "boolean", default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: 'Checkbox'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'checkedChange'
            })];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        return '';
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawCheckbox.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawCheckbox;

AwadeJigsawCheckbox.layout = {
    left: 0,
    top: 0,
    width: 12,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawComboSelect extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-combo-select';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawComboSelect';
        this.acceptDroppedNode = true;
        this.operations = [
            {
                icon: 'fa fa-thumb-tack', label: '展开下拉框', tooltip: '展开下拉框', context: true, type: 'pin'
            }
        ];
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'value', type: 'ArrayCollection'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'openTrigger',
                type: '"click"|"mouseenter"|"mouseleave"|"none" as DropDownTrigger',
                default: '"mouseenter"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'closeTrigger',
                type: '"click"|"mouseenter"|"mouseleave"|"none" as DropDownTrigger',
                default: '"mouseleave"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'showBorder', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'clearable', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'autoClose', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'autoWidth', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'open', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'disabled', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'placeholder', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'maxWidth', type: 'number'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'labelField', type: "string", default: 'label'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'searchable', type: "boolean", default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'searching', type: "boolean", default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'searchKeyword', type: "string", default: ''
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'searchBoxMinWidth', type: "number", default: '40'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'dropdownWidth', type: 'number', default: 0,
                toAttribute: () => ''
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'dropdownHeight', type: 'number', default: 50,
                toAttribute: () => ''
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'valueChange'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'select'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'remove'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'openChange'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'searchKeywordChange'
            }),
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawComboSelect.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    onOperation(svd, inst, operation) {
        switch (operation.type) {
            case 'pin':
                if (inst && inst.open == false) {
                    inst.openTrigger = 'none';
                    inst.closeTrigger = 'none';
                    inst.open = true;
                }
                else if (inst) {
                    let openTriggerInput = svd.inputs.find(input => input.property == 'openTrigger');
                    inst.openTrigger = openTriggerInput.value && openTriggerInput.value.initial ? openTriggerInput.value.initial.replace(/"/g, '') : openTriggerInput.default.replace(/"/g, '');
                    let closeTriggerInput = svd.inputs.find(input => input.property == 'closeTrigger');
                    inst.closeTrigger = closeTriggerInput.value && closeTriggerInput.value.initial ? closeTriggerInput.value.initial.replace(/"/g, '') : closeTriggerInput.default.replace(/"/g, '');
                    inst.open = false;
                }
                break;
            default:
        }
    }
    ;
    getChildArea(svd, inst, el) {
        return { left: 0, top: 0, bottom: 99999, right: 99999, width: 99999, height: 99999 };
    }
    ;
    beforeCreate(svd) {
        if (svd.children == undefined) {
            svd.children = [];
            let layout = svd.createSVD('awade-combo-layout');
            svd.children.push(layout);
            svd.save();
        }
    }
    ;
    beforeComponentUpdate(svd, inst) {
        if (inst) {
            inst.open = false;
        }
    }
    beforeRemove(svd, inst) {
        if (inst) {
            inst.open = false;
        }
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [width]="'100%'" `;
            return ngStyle;
        }
    }
    htmlCoder(svd, env) {
        let children = [];
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        let dropdownWidth = svd.inputs && svd.inputs.find(input => input.property == 'dropdownWidth');
        let dropdownHeight = svd.inputs && svd.inputs.find(input => input.property == 'dropdownHeight');
        if (svd.children && svd.children.length > 0) {
            svd.children.forEach(cm => {
                const cmHtmlCoder = cm.htmlCoder(cm, env);
                children.push(`<ng-template><div style="width:${dropdownWidth.value ? dropdownWidth.value.initial + 'px' : 'auto'};height:${dropdownHeight.value ? dropdownHeight.value.initial + 'px' : 'auto'}">${cmHtmlCoder.htmlStr}</div></ng-template>`);
                cmHtmlCoder.member ? membersDefine.members.push(cmHtmlCoder.member) : '';
            });
        }
        let htmlStr = this.getAttributeHtml(svd);
        htmlStr += ` ${membersDefine.ngStyle} >${children.join('\n')}</jigsaw-combo-select>`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawComboSelect;

AwadeJigsawComboSelect.layout = {
    left: 0,
    top: 0,
    width: 30,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawDialog extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-dialog';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawDialog';
        this.operations = [{
                ignores: ['uid-operation-delete', 'uid-operation-new']
            }];
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'buttons',
                type: "{[index: string]: any, label?: string, clazz?: string = '', type?: string, disabled?: boolean, preSize?: string}[] as ButtonInfo[]",
                coder(metaData, rawValue, env) {
                    const [memberReference, memberDefineCode] = this.getMemberCode(metaData);
                    const codes = {
                        ctor: '',
                        member: memberDefineCode,
                        import: [{ module: 'ButtonInfo', from: '@rdkmaster/jigsaw' }]
                    };
                    this.dataCoder(metaData, rawValue, env, codes, memberReference);
                    codes.ctor += `
                        this.buttons = this.${this.getMemberName(metaData)};
                    `;
                    return codes;
                }
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'caption', type: 'string', default: '对话框模块', required: true,
                coder(metaData, rawValue, env) {
                    const [memberReference, memberDefineCode] = this.getMemberCode(metaData);
                    const codes = {
                        ctor: '',
                        member: memberDefineCode,
                        extend: ' extends DialogBase ',
                        import: [{ module: 'DialogBase', from: '@rdkmaster/jigsaw' }],
                        super: ` super(); \n`,
                        afterViewInit: `
                            setTimeout(() => { 
                                this.caption = (this.initData && this.initData.caption && this.initData.caption != 'undefined') ? this.initData.caption : this.${this.getMemberName(metaData)};
                            });
                        `
                    };
                    codes.member += ` @ViewChild(JigsawDialog) public dialog: JigsawDialog; \n`;
                    return this.dataCoder(metaData, rawValue, env, codes, memberReference);
                }
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'answer', value: [
                    {
                        "label": "按钮点击",
                        "type": "executive-function",
                        "extra": {
                            "desc": "按钮点击",
                            "data": `
                                if($event == undefined) {
                                    console.log("关闭按钮被点击了");
                                    this.dispose();
                                    return;
                                }
                                if($event.value == 0) {
                                    console.log("确定按钮被点击了");
                                    this.dispose();
                                }
                                if($event.value == 1) {
                                    console.log("取消按钮被点击了");
                                    this.dispose();
                                }
                        `
                        }
                    }
                ],
                coder(metaData, rawValue) {
                    if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isDefined(rawValue) && rawValue instanceof Array) {
                        const structuredCode = this.convert(rawValue, metaData.id);
                        const property = `${metaData.id}_${this.property}`;
                        let method = structuredCode.method ? structuredCode.method : '';
                        structuredCode.method = method + `
                            ${property}($event) {
                                if(this.dispose == undefined || typeof this.dispose != 'function') {
                                    console.log("在设计态下，关闭对话框及按钮功能无法正常工作");
                                    return;
                                }
                                // 防止出现，在emit之后的监听中，使用了某个变量，而该变量的初始化在用户自定义的 script 中，导致变量未初始化的问题
                                setTimeout(() => {
                                    this.answer.emit($event);
                                }, 0);
                                ${structuredCode.script}
                            }
                        `;
                        return structuredCode;
                    }
                    else {
                        return {};
                    }
                },
                snippets: [
                    new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
                        name: '关闭对话框',
                        desc: '关闭对话框',
                        script: `
                            this.dispose(); 
                        `,
                        filter: sourceType => sourceType == 'initial'
                    })
                ]
            }),
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['opacity', 'visibility', 'width', 'height'],
            width: "600",
            widthUnit: "PX",
            height: "480",
            heightUnit: "PX"
        });
    }
    getLabel() {
        return 'this';
    }
    htmlCoder(svd, env) {
        let htmlStr = this.getAttributeHtml(svd);
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        htmlStr += ` ${membersDefine.ngStyle} >`;
        if (svd.children && svd.children.length > 0) {
            // dialog 只有一个awade-layout子元素
            for (let item of svd.children) {
                let itemCoderResult;
                const itemHtmlCoder = item.htmlCoder(item, env);
                itemCoderResult = itemHtmlCoder.htmlStr;
                membersDefine.members.push(itemHtmlCoder.member);
                htmlStr += itemCoderResult;
            }
        }
        htmlStr += `</${this.getTagName(svd)}>`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            let cssStr = '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkNumber(svd.styles.width) ? cssStr += `width: ${svd.styles.width}${svd.styles.widthUnit}; ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkNumber(svd.styles.height) ? cssStr += `height: ${svd.styles.height}${svd.styles.heightUnit}; ` : '';
            return cssStr;
        }
        else {
            let ngStyle = '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkNumber(svd.styles.width) ? ngStyle += ` [width]="'${svd.styles.width}${svd.styles.widthUnit}'" ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkNumber(svd.styles.height) ? ngStyle += ` [height]="'${svd.styles.height}${svd.styles.heightUnit}'" ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkVariable(svd.styles.width) ? ngStyle += ` [width]="${svd.styles.width.trim().substring(5)}" ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkVariable(svd.styles.height) ? ngStyle += ` [height]="${svd.styles.height.trim().substring(5)}" ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkCalc(svd.styles.width) ? ngStyle += ` [width]="${svd.styles.width}" ` : '';
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkCalc(svd.styles.height) ? ngStyle += ` [height]="${svd.styles.height}" ` : '';
            return ngStyle;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawDialog;



/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeJigsawDrawer extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-drawer';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawDrawer';
        this.acceptDroppedNode = true;
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'position', type: '"left" | "right" | "top" | "bottom" as position', default: '"left"'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'open', type: "boolean", default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'width', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'height', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'offsetTop', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'offsetLeft', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'offsetRight', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'offsetBottom', type: "string"
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['opacity', 'visibility']
        });
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'openChange'
            })
        ];
        if (this.excludedProperties) {
            this.excludedProperties.push('_removeOpenChangeListener');
        }
        else {
            this.excludedProperties = ['_removeOpenChangeListener'];
        }
    }
    sizeCoder(svd, type) {
        return '';
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawDrawer.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = Object.assign(value, AwadeJigsawDrawer.layout);
    }
    getChildArea(svd, inst, el) {
        return el.nativeElement.children[0].getBoundingClientRect();
    }
    ;
    beforeCreate(svd) {
        if (svd.children == undefined) {
            svd.children = [];
            let layout = svd.createSVD('awade-drawer-layout');
            svd.children.push(layout);
            svd.save();
        }
    }
    onInit(svd, inst) {
        if (this._removeOpenChangeListener) {
            this._removeOpenChangeListener.unsubscribe();
            this._removeOpenChangeListener = null;
        }
        this._removeOpenChangeListener = inst.openChange.subscribe($event => {
            let openConfig = { properties: { open: $event } };
            __WEBPACK_IMPORTED_MODULE_0__util_utils__["a" /* MetadataUtil */].updateLocalStorage(svd.agentId, openConfig);
        });
        let runtime = __WEBPACK_IMPORTED_MODULE_0__util_utils__["a" /* MetadataUtil */].getAwadeRuntime();
        if (localStorage && runtime && runtime.hasOwnProperty(svd.agentId)) {
            inst.open = runtime[svd.agentId].properties.open;
        }
    }
    onDestroy(svd, inst) {
        if (this._removeOpenChangeListener) {
            this._removeOpenChangeListener.unsubscribe();
            this._removeOpenChangeListener = null;
        }
    }
    htmlCoder(svd, env) {
        // 添加默认属性
        let containerInput = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
            property: 'container', type: 'string', value: { initial: '.awade-layout' }
        });
        svd.inputs.push(containerInput);
        return super.htmlCoder(svd, env);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawDrawer;

AwadeJigsawDrawer.layout = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    scaleDirection: 'none',
    sticky: true
};


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawGraph extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-graph';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawGraph';
        this.inputs = [
            new DataInput()
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'click'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'dblclick'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'mousedown'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'mouseup'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'mouseover'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'mouseout'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'globalout'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'contextmenu'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'legendselectchanged'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'legendselected'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'legendunselected'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'datazoom'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'datarangeselected'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'timelinechanged'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'timelineplaychanged'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'restore'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'dataviewchanged'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'magictypechanged'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'geoselectchanged'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'geoselected'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'geounselected'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'pieselectchanged'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'pieselected'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'pieunselected'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'mapselectchanged'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'mapselected'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'mapunselected'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'axisareaselected'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'focusNodeAdjacency'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'unfocusNodeAdjacency'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'brush'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'brushselected'
            })
        ];
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawGraph.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawGraph;

AwadeJigsawGraph.layout = {
    left: 0,
    top: 0,
    width: 60,
    height: 30,
    scaleDirection: 'horizontal'
};
class DataInput extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"] {
    constructor() {
        super();
        this.property = 'data';
        this.type = ['EChart Options', 'Graph Data', 'PieGraphData', 'LineGraphData', 'LineGraphDataByRow', 'BarGraphData',
            'BarGraphDataByRow', 'DoughnutGraphData', 'StripGraphData', 'StripSequenceGraphData', 'StripColorGraphData',
            'StackedAreaGraphData', 'GaugeGraphData', 'ScatterGraphData', 'RadarGraphData', 'KLineGraphData', 'BoxPlotGraphData',
            'HeatGraphData', 'RelationalGraphData', 'FunnelPlotGraphData'];
        this.required = true;
        this.default = `
        {
            title:{text: '某站点用户访问来源',x:'center'},
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            },
            series: [
                {
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    data:[
                        {value: 335, name: '直接访问'},
                        {value: 310, name: '邮件营销'},
                        {value: 234, name: '联盟广告'},
                        {value: 135, name: '视频广告'},
                        {value: 1548, name: '搜索引擎'}
                    ]
                }
            ]
        }
    `;
        this.snippets.push(getPieOptionsSnippet(), getBarOptionsSnippet(), getLineOptionsSnippet(), getGaugeOptionsSnippet(), getMapOptionsSnippet(), ...getPieSnippets(), ...getDoughnutSnippets(), ...getLineSnippets(), ...getBarSnippets(), ...getStripSnippets(), ...getStackedAreaSnippets(), ...getGaugeSnippets(), ...getScatterSnippets(), ...getRadarSnippets(), ...getKLineSnippets(), ...getBoxPlotSnippets(), ...getHeatSnippets(), ...getRelationalSnippets(), ...getFunnelPlotSnippets());
    }
    ;
    _coderOfEChartOptions(metadata, rawValue, env) {
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata, 'GraphData');
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode
        };
        if (this.bindTo && `${metadata.id}_${this.property}` != this.findInputIdWithFirstDefinedBinding(env.svdTree, this.bindTo)) {
            return codes;
        }
        if (!__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData) && !__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData))
            return codes;
        codes.import = [{ module: 'GraphData', from: `${metadata.importFrom}` }];
        codes.ctor = `
            ${memberReference} = new GraphData(undefined);
        `;
        if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData)) {
            codes.ctor = `
                ${memberReference} = new GraphData(${initialData});
            `;
        }
        if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData)) {
            let options = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].generateRequestOptions(remoteData);
            const subscribers = `
                this._subscribers.push(this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, $event => {
                    this.loadingService.show();
                    let handler= this.http.request("${remoteData.method}", "${remoteData.url}", {${options}})${remoteData.dataReviser ? '.map(' + remoteData.dataReviser + ')' : ''}.subscribe((req)=>{
                        this.zone.run(()=>{
                            req = JSON.parse(JSON.stringify(req), funReviser);
                            function funReviser(key, value) {
                                if(key == 'formatter' && "string" == typeof value && value.indexOf('function')== 0 ) {
                                    return Function('return ' + value)();
                                }
                                return value;
                            }
                            ${memberReference}.echartOptions = req;
                            ${memberReference}.refresh();
                        })
                        handler.unsubscribe();
                        this.loadingService.dispose();
                        this.eventBus.emit('${metadata.id}_${this.property}_loaded',req);
                    }, (err)=>{
                            this.loadingService.dispose();
                            this.eventBus.emit('${metadata.id}_${this.property}_loaded',err);
                    })
                }));
            `;
            codes.ctor += `
                ${subscribers}
            `;
        }
        return codes;
    }
    _coderOfGraphData(metadata, rawValue, env, type) {
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata, 'AbstractGraphData');
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode
        };
        if (this.bindTo && `${metadata.id}_${this.property}` != this.findInputIdWithFirstDefinedBinding(env.svdTree, this.bindTo)) {
            return codes;
        }
        if (!__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData) && !__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData))
            return codes;
        codes.import = [{ module: 'GraphData', from: `${metadata.importFrom}` }];
        codes.import.push({ module: 'AbstractGraphData', from: `${metadata.importFrom}` });
        codes.ctor = '';
        if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData)) {
            codes.ctor += `
                const rawTableData: any = ${initialData};
                ${type ? `rawTableData.type = '${type}';` : ''}

                ${memberReference} = GraphData.of(rawTableData);
                if(${memberReference}) {
                    ${memberReference}.rowDescriptor = rawTableData.rowDescriptor;
                    ${memberReference}.header = rawTableData.header;
                    ${memberReference}.data = rawTableData.data;
                }
            `;
        }
        if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData)) {
            let options = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].generateRequestOptions(remoteData);
            const subscribers = `
                this._subscribers.push(this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, $event => {
                    this.loadingService.show();
                    this.zone.run(() => {
                        this.http.request("${remoteData.method}", "${remoteData.url}", {${options}})${remoteData.dataReviser ? '.map(' + remoteData.dataReviser + ')' : ''}.subscribe((rawTableData: any) => {
                            rawTableData.rowDescriptor = rawTableData.rowDescriptor ? rawTableData.rowDescriptor : [];
                            rawTableData.header = rawTableData.header ? rawTableData.header : [];
                            rawTableData.data = rawTableData.data ? rawTableData.data : [];
                            ${type ? `rawTableData.type = '${type}';` : ''}

                            ${memberReference} = GraphData.of(rawTableData);
                            if(${memberReference}) {
                                ${memberReference}.rowDescriptor = rawTableData.rowDescriptor;
                                ${memberReference}.header = rawTableData.header;
                                ${memberReference}.data = rawTableData.data;
                            }
                            this.loadingService.dispose();
                            this.eventBus.emit('${metadata.id}_${this.property}_loaded',rawTableData);
                        }, (err)=>{
                            this.loadingService.dispose();
                            this.eventBus.emit('${metadata.id}_${this.property}_loaded',err);
                        })
                    });
                }));
            `;
            codes.ctor += `
                ${subscribers}
            `;
        }
        return codes;
    }
    coder(metadata, rawValue, env) {
        switch (this.selectedType) {
            case "EChart Options":
                return this._coderOfEChartOptions(metadata, rawValue, env);
            case "Graph Data":
                return this._coderOfGraphData(metadata, rawValue, env);
            default:
                return this._coderOfGraphData(metadata, rawValue, env, this.selectedType);
        }
    }
}
/* unused harmony export DataInput */

function getPieOptionsSnippet() {
    return new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
        name: '饼图',
        desc: '某站点用户访问来源',
        script: `
                {
                    title:{text: '某站点用户访问来源',x:'center'},
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            data:[
                                {value: 335, name: '直接访问'},
                                {value: 310, name: '邮件营销'},
                                {value: 234, name: '联盟广告'},
                                {value: 135, name: '视频广告'},
                                {value: 1548, name: '搜索引擎'}
                            ]
                        }
                    ]
                }
            `,
        filter: (sourceType, dataType) => sourceType == 'initial' && dataType == 'EChart Options'
    });
}
function getBarOptionsSnippet() {
    return new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
        name: '柱状图',
        desc: '某站点用户访问来源',
        script: `
                {
                    title:{text: '某站点用户访问来源',x:'center'},
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        left: 'center',
                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: 55,
                        right: 55,
                        top: 60,
                        show: true,
                        borderWidth: 1
                      },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            type: 'bar',
                            animation: true,
                            legendHoverLink: false,
                            barCategoryGap: '15%',//控制条形柱间的间距
                            barMaxWidth: 20,
                            data:[210, 310, 410, 320, 1320, 1000, 200]
                        }
                    ]
                }
            `,
        filter: (sourceType, dataType) => sourceType == 'initial' && dataType == 'EChart Options'
    });
}
function getLineOptionsSnippet() {
    return new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
        name: '折线图',
        desc: '某站点用户访问来源',
        script: `
                {
                    title:{text: '某站点用户访问来源',x:'center'},
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        left: 'center',
                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: 55,
                        right: 55,
                        top: 60,
                        show: true,
                        borderWidth: 1
                      },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            type: 'line',
                            animation: true,
                            legendHoverLink: false,
                            barCategoryGap: '15%',//控制条形柱间的间距
                            barMaxWidth: 20,
                            data:[210, 310, 410, 320, 1320, 1000, 200]
                        }
                    ]
                }
            `,
        filter: (sourceType, dataType) => sourceType == 'initial' && dataType == 'EChart Options'
    });
}
function getGaugeOptionsSnippet() {
    return new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
        name: '仪表盘',
        desc: '完成率指标',
        script: `
                {
                    tooltip: {
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    toolbox: {
                        feature: {
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    series: [
                        {
                            name: '业务指标',
                            type: 'gauge',
                            splitNumber: 10,             // 分割段数，默认为5
                            axisLine: {            // 坐标轴线
                                show: true,        // 默认显示，属性show控制显示与否
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.2, '#92D050'], [0.8, '#ff3'], [1, '#FF0000']],
                                    width: 10
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                show: true,        // 属性show控制显示与否，默认不显示
                                splitNumber: 3,    // 每份split细分多少段
                            },
                            splitLine: {           // 分隔线
                                show: true,        // 默认显示，属性show控制显示与否
                                length: 10,         // 属性length控制线长
                            },
                            pointer: {
                                length: '100%',
                                width: 2,
                                color: '6e767b'
                            },
                            detail: { //仪表盘详情
                                formatter: '{value}%'
                            },
                            title: { //仪表盘标题
                                show: true,
                                offsetCenter: [0, '-15%'],
                                textStyle: {
                                    color: '#333',
                                    fontSize: 10,
                                    width: '50%'
                                }
                            },

                            data: 35
                        }
                    ]
                }
            `,
        filter: (sourceType, dataType) => sourceType == 'initial' && dataType == 'EChart Options'
    });
}
function getMapOptionsSnippet() {
    return new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
        name: '地图',
        desc: '省市地图',
        script: `
            {
                backgroundColor: '#404a59',
                title: {
                    text: '上海',
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: [
                    {
                        type: 'map',
                        mapType: 'shanghai',
                        label: {
                            emphasis: {
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#389BB7',
                                areaColor: '#fff',
                            },
                            emphasis: {
                                areaColor: '#389BB7',
                                borderWidth: 0
                            }
                        },
                        animation: false
                        // animationDurationUpdate: 1000,
                        // animationEasingUpdate: 'quinticInOut'
                    }
                ]
            }
            `,
        filter: (sourceType, dataType) => sourceType == 'initial' && dataType == 'EChart Options'
    });
}
function getPieSnippets() {
    const pieLocalScript = `
                {
                    "header": ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
                    "data": [
                        [120, 220, 150, 320, 820]
                    ],
                    "type": "PieGraphData"
                }
            `;
    const pieRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                        [120, 220, 150, 320, 820]
                    ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.header = ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'];
                data.type = 'PieGraphData';
                return data;
            `;
    const pieByRowLocalScript = `
                {
                    "rowDescriptor": ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
                    "data": [
                        [120],
                        [220],
                        [150],
                        [320],
                        [820]
                    ],
                    "type": "PieGraphDataByRow"
                }
            `;
    const pieByRowRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                        [120],
                        [220],
                        [150],
                        [320],
                        [820]
                    ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.rowDescriptor = ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'];
                data.type = 'PieGraphDataByRow';
                return data;
            `;
    const pie = {
        name: 'PieGraphData',
        desc: '饼图'
    };
    const pieByRow = {
        name: 'PieGraphDataByRow',
        desc: '饼图',
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, pie, { script: pieLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'PieGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, pie, { script: pieRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'PieGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, pieByRow, { script: pieByRowLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'PieGraphDataByRow') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, pieByRow, { script: pieByRowRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'PieGraphDataByRow') }))
    ];
}
function getDoughnutSnippets() {
    const doughnutLocalScript = `
                {
                    "rowDescriptor": ["终端", "无线网", "互联网", "核心网"],
                    "header": ["次数"],
                    "field": ["field1"],
                    "data": [
                        [52],
                        [15],
                        [15],
                        [18]
                    ],
                    "type": "DoughnutGraphData"
                }
            `;
    const doughnutRemoteScript = `
        // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
        var data = { data: [
                        [52],
                        [15],
                        [15],
                        [18]
                    ] };

        // 实际数据往往来自于数据库，因此请放开下面这行注释
        // var data = Data.fetch('select a,b,c from abc');

        data.rowDescriptor = ["终端", "无线网", "互联网", "核心网"];
        data.header = ["次数"];
        data.type = 'DoughnutGraphData';
        return data;
        `;
    const doughnutRateLocalScript = `
                {
                    "rowDescriptor": ["无线网"],
                    "header": ["次数"],
                    "field": ["field1"],
                    "data": [
                        [55]
                    ],
                    "type": "DoughnutRateGraphData"
                }
            `;
    const doughnutRateRemoteScript = `
        // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
        var data = { data: [
                        [55]
                    ] };

        // 实际数据往往来自于数据库，因此请放开下面这行注释
        // var data = Data.fetch('select a,b,c from abc');

        data.rowDescriptor = ["无线网"];
        data.header = ["次数"];
        data.type = 'DoughnutRateGraphData';
        return data;
        `;
    const doughnutScoreLocalScript = `
        {
            "rowDescriptor": ["TOEFL得分"],
            "header": ["得分"],
            "field": ["field1"],
            "data": [
                [60]
            ],
            "type": "DoughnutScoreGraphData"
        }
        `;
    const doughnutScoreRemoteScript = `
        // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
        var data = { data: [[60]] };

        // 实际数据往往来自于数据库，因此请放开下面这行注释
        // var data = Data.fetch('select a,b,c from abc');

        data.rowDescriptor = ["TOEFL得分"];
        data.header = ["得分"];
        data.type = 'DoughnutScoreGraphData';
        return data;
        `;
    const doughnut = {
        name: 'DoughnutGraphData',
        desc: '环形对比图'
    };
    const doughnutRate = {
        name: 'DoughnutRateGraphData',
        desc: '环形比例图'
    };
    const doughnutScore = {
        name: 'DoughnutScoreGraphData',
        desc: '环形得分图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, doughnut, { script: doughnutLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'DoughnutGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, doughnut, { script: doughnutRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'DoughnutGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, doughnutRate, { script: doughnutRateLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'DoughnutRateGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, doughnutRate, { script: doughnutRateRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'DoughnutRateGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, doughnutScore, { script: doughnutScoreLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'DoughnutScoreGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, doughnutScore, { script: doughnutScoreRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'DoughnutScoreGraphData') }))
    ];
}
function getLineSnippets() {
    const lineLocalScript = `
                {
                    "rowDescriptor": ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    "header": ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
                    "data": [
                        [120, 220, 150, 320, 820],
                        [132, 182, 232, 332, 932],
                        [101, 191, 201, 301, 901],
                        [134, 234, 154, 334, 934],
                        [90, 290, 190, 390, 1290],
                        [230, 330, 330, 330, 1330],
                        [210, 310, 410, 320, 1320]
                    ],
                    "type": "LineGraphData"
                }
            `;
    const lineRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                        [120, 220, 150, 320, 820],
                        [132, 182, 232, 332, 932],
                        [101, 191, 201, 301, 901],
                        [134, 234, 154, 334, 934],
                        [90, 290, 190, 390, 1290],
                        [230, 330, 330, 330, 1330],
                        [210, 310, 410, 320, 1320]
                    ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.rowDescriptor = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                data.header = ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'];
                data.type = 'LineGraphData';
                return data;
            `;
    const lineByRowLocalScript = `
                {
                    "rowDescriptor": ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
                    "header": ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    "data": [
                        [120, 132, 101, 134, 90, 230, 210],
                        [220, 182, 191, 234, 290, 330, 310],
                        [150, 232, 201, 154, 190, 330, 410],
                        [320, 332, 301, 334, 390, 330, 320],
                        [820, 932, 901, 934, 1290, 1330, 1320]
                    ],
                    "type": "LineGraphDataByRow"
                }
            `;
    const lineByRowRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                        [120, 132, 101, 134, 90, 230, 210],
                        [220, 182, 191, 234, 290, 330, 310],
                        [150, 232, 201, 154, 190, 330, 410],
                        [320, 332, 301, 334, 390, 330, 320],
                        [820, 932, 901, 934, 1290, 1330, 1320]
                    ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.rowDescriptor = ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'];
                data.header = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                data.type = 'LineGraphDataByRow';
                return data;
            `;
    const line = {
        name: 'LineGraphData',
        desc: '折线图'
    };
    const lineByRow = {
        name: 'LineGraphDataByRow',
        desc: '折线图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, line, { script: lineLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'LineGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, line, { script: lineRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'LineGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, lineByRow, { script: lineByRowLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'LineGraphDataByRow') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, lineByRow, { script: lineByRowRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'LineGraphDataByRow') }))
    ];
}
function getBarSnippets() {
    const barLocalScript = `
                {
                    "rowDescriptor": ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    "header": ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
                    "data": [
                        [120, 220, 150, 320, 820],
                        [132, 182, 232, 332, 932],
                        [101, 191, 201, 301, 901],
                        [134, 234, 154, 334, 934],
                        [90, 290, 190, 390, 1290],
                        [230, 330, 330, 330, 1330],
                        [210, 310, 410, 320, 1320]
                    ],
                    "type": "BarGraphData"
                }
            `;
    const barRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                        [120, 220, 150, 320, 820],
                        [132, 182, 232, 332, 932],
                        [101, 191, 201, 301, 901],
                        [134, 234, 154, 334, 934],
                        [90, 290, 190, 390, 1290],
                        [230, 330, 330, 330, 1330],
                        [210, 310, 410, 320, 1320]
                    ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.rowDescriptor = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                data.header = ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'];
                data.type = 'BarGraphData';
                return data;
            `;
    const barByRowLocalScript = `
                {
                    "rowDescriptor": ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
                    "header": ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    "data": [
                        [120, 132, 101, 134, 90, 230, 210],
                        [220, 182, 191, 234, 290, 330, 310],
                        [150, 232, 201, 154, 190, 330, 410],
                        [320, 332, 301, 334, 390, 330, 320],
                        [820, 932, 901, 934, 1290, 1330, 1320]
                    ],
                    "type": "BarGraphDataByRow"
                }
            `;
    const barByRowRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                        [120, 132, 101, 134, 90, 230, 210],
                        [220, 182, 191, 234, 290, 330, 310],
                        [150, 232, 201, 154, 190, 330, 410],
                        [320, 332, 301, 334, 390, 330, 320],
                        [820, 932, 901, 934, 1290, 1330, 1320]
                    ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.rowDescriptor = ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'];
                data.header = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                data.type = 'BarGraphDataByRow';
                return data;
            `;
    const bar = {
        name: 'BarGraphData',
        desc: '柱状图'
    };
    const barByRow = {
        name: 'BarGraphDataByRow',
        desc: '柱状图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, bar, { script: barLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'BarGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, bar, { script: barRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'BarGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, barByRow, { script: barByRowLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'BarGraphDataByRow') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, barByRow, { script: barByRowRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'BarGraphDataByRow') })),
    ];
}
function getStripSnippets() {
    const stripLocalScript = `
        {
            "header": ["搜狐视频", "乐视视频", "土豆视频", "奇异PPS视频", "优酷视频", "腾讯视频"],
            "data": [
                [80000, 80000, 80000, 80000, 80000, 80000],
                [1800, 6895, 7738, 23486, 28686, 75860]
            ],
            "type": "StripGraphData"
        }
    `;
    const stripRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                    [80000, 80000, 80000, 80000, 80000, 80000],
                    [1800, 6895, 7738, 23486, 28686, 75860]
                ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.header = ["搜狐视频", "乐视视频", "土豆视频", "奇异PPS视频", "优酷视频", "腾讯视频"];
                data.type = 'StripGraphData';
                return data;
            `;
    const stripSequenceLocalScript = `
        {
            "header": ["网页打开总时延", "网页首包总时延", "GET时延", "TCP至GET时延", "TCP无线建链时延", "TCP有线建链时延", "DNS至TCP时延", "DNS时延"],
            "data": [
                [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000],
                [0, 0, 500, 360, 300, 150, 60, 8],
                [1688, 778, 200, 160, 117, 167, 138, 70]
            ],
            "type": "StripSequenceGraphData"
        }
    `;
    const stripSequenceRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                    [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000],
                    [0, 0, 500, 360, 300, 150, 60, 8],
                    [1688, 778, 200, 160, 117, 167, 138, 70]
                ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.header = ["网页打开总时延", "网页首包总时延", "GET时延", "TCP至GET时延", "TCP无线建链时延", "TCP有线建链时延", "DNS至TCP时延", "DNS时延"];
                data.type = 'StripSequenceGraphData';
                return data;
            `;
    const stripColorLocalScript = `
        {
            "header": ["保定", "石家庄", "唐山", "秦皇岛", "邢台", "承德"],
            "data": [
                [30, 66, 71, 88, 93, 98]
            ],
            "type": "StripColorGraphData"
        }
    `;
    const stripColorRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                    [30, 66, 71, 88, 93, 98]
                ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.header = ["保定", "石家庄", "唐山", "秦皇岛", "邢台", "承德"];
                data.type = 'StripColorGraphData';
                return data;
            `;
    const strip = {
        name: 'StripGraphData',
        desc: '条形图'
    };
    const stripSequence = {
        name: 'StripSequenceGraphData',
        desc: '条形时序图'
    };
    const stripColor = {
        name: 'StripColorGraphData',
        desc: '条形色值图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, strip, { script: stripLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'StripGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, strip, { script: stripRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'StripGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, stripSequence, { script: stripSequenceLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'StripSequenceGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, stripSequence, { script: stripSequenceRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'StripSequenceGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, stripColor, { script: stripColorLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'StripColorGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, stripColor, { script: stripColorRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'StripColorGraphData') }))
    ];
}
function getStackedAreaSnippets() {
    const stackedAreaLocalScript = `
        {
            "header": ["2016.04.24","2016.04.25","2016.04.26","2016.05.27","2016.04.28","2016.04.29","2016.04.30","2016.05.01","2016.05.02","2016.05.03","2016.05.04","2016.05.05","2016.05.06","2016.05.07","2016.05.08","2016.05.09","2016.05.10","2016.05.11","2016.05.12","2016.05.13","2016.05.14","2016.05.15","2016.05.16","2016.05.17","2016.05.18","2016.05.19","2016.05.20","2016.05.21","2016.05.22","2016.05.23","2016.05.24"],
            "data": [
                [0.83,"" ,"" ,"" ,"" , 0.68, "" ,"" ,"" ,"", 0.74, "" ,"" ,"" ,"", 1.16, "" ,"" ,"" ,"", 1.48,"" ,"" ,"" ,"", 1.36, "" ,"" ,"" ,"",0.86]
            ],
            "type": "StackedAreaGraphData"
        }
    `;
    const stackedAreaRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                    [0.83,"" ,"" ,"" ,"" , 0.68, "" ,"" ,"" ,"", 0.74, "" ,"" ,"" ,"", 1.16, "" ,"" ,"" ,"", 1.48,"" ,"" ,"" ,"", 1.36, "" ,"" ,"" ,"",0.86]
                ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.header = ["2016.04.24","2016.04.25","2016.04.26","2016.05.27","2016.04.28","2016.04.29","2016.04.30","2016.05.01","2016.05.02","2016.05.03","2016.05.04","2016.05.05","2016.05.06","2016.05.07","2016.05.08","2016.05.09","2016.05.10","2016.05.11","2016.05.12","2016.05.13","2016.05.14","2016.05.15","2016.05.16","2016.05.17","2016.05.18","2016.05.19","2016.05.20","2016.05.21","2016.05.22","2016.05.23","2016.05.24"];
                data.type = 'StackedAreaGraphData';
                return data;
            `;
    const stackedArea = {
        name: 'StackedAreaGraphData',
        desc: '堆叠区域图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, stackedArea, { script: stackedAreaLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'StackedAreaGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, stackedArea, { script: stackedAreaRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'StackedAreaGraphData') }))
    ];
}
function getGaugeSnippets() {
    const gaugeLocalScript = `
                {
                    "rowDescriptor": ['完成率'],
                    "data": [
                        [35]
                    ],
                    "type": "GaugeGraphData"
                }
            `;
    const gaugeRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                        [35]
                    ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.rowDescriptor = ['完成率'];
                data.type = 'GaugeGraphData';
                return data;
            `;
    const gauge = {
        name: 'GaugeGraphData',
        desc: '仪表盘'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, gauge, { script: gaugeLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'GaugeGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, gauge, { script: gaugeRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'GaugeGraphData') }))
    ];
}
function getScatterSnippets() {
    const scatterLocalScript = `
        {
            "data": [
                [10.0, 8.04], [8.0, 6.95], [13.0, 7.58], [9.0, 8.81], [11.0, 8.33], [14.0, 9.96], [6.0, 7.24], [4.0, 4.26], [12.0, 10.84], [7.0, 4.82], [5.0, 5.68]
            ],
            "type": "ScatterGraphData"
        }
    `;
    const scatterRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                    [10.0, 8.04], [8.0, 6.95], [13.0, 7.58], [9.0, 8.81], [11.0, 8.33], [14.0, 9.96], [6.0, 7.24], [4.0, 4.26], [12.0, 10.84], [7.0, 4.82], [5.0, 5.68]
                ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.type = 'ScatterGraphData';
                return data;
            `;
    const scatter = {
        name: 'ScatterGraphData',
        desc: '散点图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, scatter, { script: scatterLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'ScatterGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, scatter, { script: scatterRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'ScatterGraphData') }))
    ];
}
function getRadarSnippets() {
    const radarLocalScript = `
        {
            "rowDescriptor": ['预算分配（Allocated Budget）', '实际开销（Actual Spending）'],
            "header": ["销售（sales）", "管理（Administration）", "信息技术（Information Techology）", "客服（Customer Support）", "研发（Development）", "市场（Marketing）"],
            "data": [
                [4300, 10000, 28000, 35000, 50000, 19000],
                [5000, 14000, 28000, 31000, 42000, 21000],
                [6500, 16000, 30000, 38000, 52000, 25000]
            ],
            "type": "RadarGraphData"
        }
    `;
    const radarRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                    [4300, 10000, 28000, 35000, 50000, 19000],
                    [5000, 14000, 28000, 31000, 42000, 21000],
                    [6500, 16000, 30000, 38000, 52000, 25000]
                ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.rowDescriptor = ['预算分配（Allocated Budget）', '实际开销（Actual Spending）'];
                data.header = ["销售（sales）", "管理（Administration）", "信息技术（Information Techology）", "客服（Customer Support）", "研发（Development）", "市场（Marketing）"];
                data.type = 'RadarGraphData';
                return data;
            `;
    const radar = {
        name: 'RadarGraphData',
        desc: '雷达图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, radar, { script: radarLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'RadarGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, radar, { script: radarRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'RadarGraphData') }))
    ];
}
function getKLineSnippets() {
    const kLineLocalScript = `
        {
            "rowDescriptor": ["语音感知", "数据感知", "业务体验", "网页浏览", "即时通讯", "社交媒体", "视频", "下载", "其他", "网络接入"],
            "header": ["2016.04.24", "2016.04.25", "2016.04.26", "2016.05.27", "2016.04.28", "2016.04.29", "2016.04.30", "2016.05.01", "2016.05.02", "2016.05.03", "2016.05.04", "2016.05.05", "2016.05.06", "2016.05.07"
                , "2016.05.08", "2016.05.09", "2016.05.10", "2016.05.11", "2016.05.12", "2016.05.13", "2016.05.14", "2016.05.15", "2016.05.16", "2016.05.17", "2016.05.18", "2016.05.19",
                "2016.05.20", "2016.05.21", "2016.05.22", "2016.05.23", "2016.05.24"],
            "data": [
                [20, 32, 10, 13, 9, 30, 10, 20, 32, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 58],
                [20, 12, 11, 24, 20, 30, 30, 20, 32, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 24],
                [10, 32, 21, 14, 90, 30, 40, 20, 32, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 85],
                [10, 32, 21, 14, 90, 30, 40, 20, 32, 10, 13, 9, 30, 80, 32, 10, 13, 66, 5, 10, 13, 9, 30, 50, 32, 10, 13, 9, 30, 10, 85],
                [80, 92, 50, 60, 90, 30, 30, 20, 32, 10, 13, 9, 30, 10, 92, 9, 34, 10, 30, 32, 13, 9, 30, 10, 92, 80, 34, 10, 30, 32, 74],
                [80, 92, 91, 41, 10, 10, 20, 20, 92, 50, 34, 10, 30, 32, 92, 8, 34, 10, 30, 32, 13, 9, 30, 10, 92, 62, 34, 10, 30, 32, 48],
                [20, 92, 35, 34, 10, 30, 32, 20, 92, 33, 34, 10, 30, 32, 92, 8, 34, 10, 30, 32, 13, 9, 30, 10, 92, 42, 34, 10, 30, 32, 87],
                [80, 62, 91, 50, 90, 30, 30, 20, 92, 38, 34, 10, 30, 32, 92, 6, 34, 10, 30, 32, 13, 9, 30, 10, 92, 58, 34, 10, 30, 32, 58],
                [80, 32, 44, 93, 20, 50, 20, 20, 92, 24, 34, 10, 30, 32, 92, 25, 34, 10, 30, 32, 13, 9, 30, 10, 92, 24, 34, 10, 30, 32, 12],
                [80, 32, 29, 34, 50, 10, 20, 20, 92, 42, 34, 10, 30, 32, 92, 29, 34, 10, 30, 32, 13, 9, 30, 10, 92, 38, 34, 10, 30, 32, 97]
            ],
            "type": "KLineGraphData"
        }
    `;
    const kLineRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                    [20, 32, 10, 13, 9, 30, 10, 20, 32, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 58],
                    [20, 12, 11, 24, 20, 30, 30, 20, 32, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 24],
                    [10, 32, 21, 14, 90, 30, 40, 20, 32, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 13, 9, 30, 10, 32, 10, 13, 9, 30, 10, 85],
                    [10, 32, 21, 14, 90, 30, 40, 20, 32, 10, 13, 9, 30, 80, 32, 10, 13, 66, 5, 10, 13, 9, 30, 50, 32, 10, 13, 9, 30, 10, 85],
                    [80, 92, 50, 60, 90, 30, 30, 20, 32, 10, 13, 9, 30, 10, 92, 9, 34, 10, 30, 32, 13, 9, 30, 10, 92, 80, 34, 10, 30, 32, 74],
                    [80, 92, 91, 41, 10, 10, 20, 20, 92, 50, 34, 10, 30, 32, 92, 8, 34, 10, 30, 32, 13, 9, 30, 10, 92, 62, 34, 10, 30, 32, 48],
                    [20, 92, 35, 34, 10, 30, 32, 20, 92, 33, 34, 10, 30, 32, 92, 8, 34, 10, 30, 32, 13, 9, 30, 10, 92, 42, 34, 10, 30, 32, 87],
                    [80, 62, 91, 50, 90, 30, 30, 20, 92, 38, 34, 10, 30, 32, 92, 6, 34, 10, 30, 32, 13, 9, 30, 10, 92, 58, 34, 10, 30, 32, 58],
                    [80, 32, 44, 93, 20, 50, 20, 20, 92, 24, 34, 10, 30, 32, 92, 25, 34, 10, 30, 32, 13, 9, 30, 10, 92, 24, 34, 10, 30, 32, 12],
                    [80, 32, 29, 34, 50, 10, 20, 20, 92, 42, 34, 10, 30, 32, 92, 29, 34, 10, 30, 32, 13, 9, 30, 10, 92, 38, 34, 10, 30, 32, 97]
                ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.rowDescriptor = ["语音感知", "数据感知", "业务体验", "网页浏览", "即时通讯", "社交媒体", "视频", "下载", "其他", "网络接入"];
                data.header = ["2016.04.24", "2016.04.25", "2016.04.26", "2016.05.27", "2016.04.28", "2016.04.29", "2016.04.30", "2016.05.01", "2016.05.02", "2016.05.03", "2016.05.04", "2016.05.05", "2016.05.06", "2016.05.07"
                    , "2016.05.08", "2016.05.09", "2016.05.10", "2016.05.11", "2016.05.12", "2016.05.13", "2016.05.14", "2016.05.15", "2016.05.16", "2016.05.17", "2016.05.18", "2016.05.19",
                    "2016.05.20", "2016.05.21", "2016.05.22", "2016.05.23", "2016.05.24"];
                data.type = 'KLineGraphData';
                return data;
            `;
    const kLine = {
        name: 'KLineGraphData',
        desc: 'K线图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, kLine, { script: kLineLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'KLineGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, kLine, { script: kLineRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'KLineGraphData') }))
    ];
}
function getBoxPlotSnippets() {
    const boxPlotLocalScript = `
        {
            "data": [
                [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
                [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
                [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
                [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
                [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
            ],
            "type": "BoxPlotGraphData"
        }
    `;
    const boxPlotRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                    [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
                    [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
                    [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
                    [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
                    [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
                ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.type = 'BoxPlotGraphData';
                return data;
            `;
    const boxPlot = {
        name: 'BoxPlotGraphData',
        desc: '箱线图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, boxPlot, { script: boxPlotLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'BoxPlotGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, boxPlot, { script: boxPlotRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'BoxPlotGraphData') }))
    ];
}
function getHeatSnippets() {
    const heatLocalScript = `
        {
            "data": [
                [0, 0, 5], [1, 0, 1], [2, 0, "-"], [3, 0, "-"], [4, 0, "-"], [5, 0, "-"], [6, 0, "-"], [7, 0, "-"], [8, 0, "-"], [9, 0, "-"], [10, 0, "-"], [11, 0, 2], [12, 0, 4], [13, 0, 1], [14, 0, 1], [15, 0, 3], [16, 0, 4], [17, 0, 6], [18, 0, 4], [19, 0, 4], [20, 0, 3], [21, 0, 3], [22, 0, 2], [23, 0, 5], [0, 1, 7], [1, 1, "-"], [2, 1, "-"], [3, 1, "-"], [4, 1, "-"], [5, 1, "-"], [6, 1, "-"], [7, 1, "-"], [8, 1, "-"], [9, 1, "-"], [10, 1, 5], [11, 1, 2], [12, 1, 2], [13, 1, 6], [14, 1, 9], [15, 1, 11], [16, 1, 6], [17, 1, 7], [18, 1, 8], [19, 1, 12], [20, 1, 5], [21, 1, 5], [22, 1, 7], [23, 1, 2], [0, 2, 1], [1, 2, 1], [2, 2, "-"], [3, 2, "-"], [4, 2, "-"], [5, 2, "-"], [6, 2, "-"], [7, 2, "-"], [8, 2, "-"], [9, 2, "-"], [10, 2, 3], [11, 2, 2], [12, 2, 1], [13, 2, 9], [14, 2, 8], [15, 2, 10], [16, 2, 6], [17, 2, 5], [18, 2, 5], [19, 2, 5], [20, 2, 7], [21, 2, 4], [22, 2, 2], [23, 2, 4], [0, 3, 7], [1, 3, 3], [2, 3, "-"], [3, 3, "-"], [4, 3, "-"], [5, 3, "-"], [6, 3, "-"], [7, 3, "-"], [8, 3, 1], [9, 3, "-"], [10, 3, 5], [11, 3, 4], [12, 3, 7], [13, 3, 14], [14, 3, 13], [15, 3, 12], [16, 3, 9], [17, 3, 5], [18, 3, 5], [19, 3, 10], [20, 3, 6], [21, 3, 4], [22, 3, 4], [23, 3, 1], [0, 4, 1], [1, 4, 3], [2, 4, "-"], [3, 4, "-"], [4, 4, "-"], [5, 4, 1], [6, 4, "-"], [7, 4, "-"], [8, 4, "-"], [9, 4, 2], [10, 4, 4], [11, 4, 4], [12, 4, 2], [13, 4, 4], [14, 4, 4], [15, 4, 14], [16, 4, 12], [17, 4, 1], [18, 4, 8], [19, 4, 5], [20, 4, 3], [21, 4, 7], [22, 4, 3], [23, 4, "-"], [0, 5, 2], [1, 5, 1], [2, 5, "-"], [3, 5, 3], [4, 5, "-"], [5, 5, "-"], [6, 5, "-"], [7, 5, "-"], [8, 5, 2], [9, 5, "-"], [10, 5, 4], [11, 5, 1], [12, 5, 5], [13, 5, 10], [14, 5, 5], [15, 5, 7], [16, 5, 11], [17, 5, 6], [18, 5, "-"], [19, 5, 5], [20, 5, 3], [21, 5, 4], [22, 5, 2], [23, 5, "-"], [0, 6, 1], [1, 6, "-"], [2, 6, "-"], [3, 6, "-"], [4, 6, "-"], [5, 6, "-"], [6, 6, "-"], [7, 6, "-"], [8, 6, "-"], [9, 6, "-"], [10, 6, 1], [11, 6, "-"], [12, 6, 2], [13, 6, 1], [14, 6, 3], [15, 6, 4], [16, 6, "-"], [17, 6, "-"], [18, 6, "-"], [19, 6, "-"], [20, 6, 1], [21, 6, 2], [22, 6, 2], [23, 6, 6],
                ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'],
                ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday']
            ],
            "type": "HeatGraphData"
        }
    `;
    const heatRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                    [0, 0, 5], [1, 0, 1], [2, 0, "-"], [3, 0, "-"], [4, 0, "-"], [5, 0, "-"], [6, 0, "-"], [7, 0, "-"], [8, 0, "-"], [9, 0, "-"], [10, 0, "-"], [11, 0, 2], [12, 0, 4], [13, 0, 1], [14, 0, 1], [15, 0, 3], [16, 0, 4], [17, 0, 6], [18, 0, 4], [19, 0, 4], [20, 0, 3], [21, 0, 3], [22, 0, 2], [23, 0, 5], [0, 1, 7], [1, 1, "-"], [2, 1, "-"], [3, 1, "-"], [4, 1, "-"], [5, 1, "-"], [6, 1, "-"], [7, 1, "-"], [8, 1, "-"], [9, 1, "-"], [10, 1, 5], [11, 1, 2], [12, 1, 2], [13, 1, 6], [14, 1, 9], [15, 1, 11], [16, 1, 6], [17, 1, 7], [18, 1, 8], [19, 1, 12], [20, 1, 5], [21, 1, 5], [22, 1, 7], [23, 1, 2], [0, 2, 1], [1, 2, 1], [2, 2, "-"], [3, 2, "-"], [4, 2, "-"], [5, 2, "-"], [6, 2, "-"], [7, 2, "-"], [8, 2, "-"], [9, 2, "-"], [10, 2, 3], [11, 2, 2], [12, 2, 1], [13, 2, 9], [14, 2, 8], [15, 2, 10], [16, 2, 6], [17, 2, 5], [18, 2, 5], [19, 2, 5], [20, 2, 7], [21, 2, 4], [22, 2, 2], [23, 2, 4], [0, 3, 7], [1, 3, 3], [2, 3, "-"], [3, 3, "-"], [4, 3, "-"], [5, 3, "-"], [6, 3, "-"], [7, 3, "-"], [8, 3, 1], [9, 3, "-"], [10, 3, 5], [11, 3, 4], [12, 3, 7], [13, 3, 14], [14, 3, 13], [15, 3, 12], [16, 3, 9], [17, 3, 5], [18, 3, 5], [19, 3, 10], [20, 3, 6], [21, 3, 4], [22, 3, 4], [23, 3, 1], [0, 4, 1], [1, 4, 3], [2, 4, "-"], [3, 4, "-"], [4, 4, "-"], [5, 4, 1], [6, 4, "-"], [7, 4, "-"], [8, 4, "-"], [9, 4, 2], [10, 4, 4], [11, 4, 4], [12, 4, 2], [13, 4, 4], [14, 4, 4], [15, 4, 14], [16, 4, 12], [17, 4, 1], [18, 4, 8], [19, 4, 5], [20, 4, 3], [21, 4, 7], [22, 4, 3], [23, 4, "-"], [0, 5, 2], [1, 5, 1], [2, 5, "-"], [3, 5, 3], [4, 5, "-"], [5, 5, "-"], [6, 5, "-"], [7, 5, "-"], [8, 5, 2], [9, 5, "-"], [10, 5, 4], [11, 5, 1], [12, 5, 5], [13, 5, 10], [14, 5, 5], [15, 5, 7], [16, 5, 11], [17, 5, 6], [18, 5, "-"], [19, 5, 5], [20, 5, 3], [21, 5, 4], [22, 5, 2], [23, 5, "-"], [0, 6, 1], [1, 6, "-"], [2, 6, "-"], [3, 6, "-"], [4, 6, "-"], [5, 6, "-"], [6, 6, "-"], [7, 6, "-"], [8, 6, "-"], [9, 6, "-"], [10, 6, 1], [11, 6, "-"], [12, 6, 2], [13, 6, 1], [14, 6, 3], [15, 6, 4], [16, 6, "-"], [17, 6, "-"], [18, 6, "-"], [19, 6, "-"], [20, 6, 1], [21, 6, 2], [22, 6, 2], [23, 6, 6],
                    ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'],
                    ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday']
                ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.type = 'HeatGraphData';
                return data;
            `;
    const heat = {
        name: 'HeatGraphData',
        desc: '热力图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, heat, { script: heatLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'HeatGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, heat, { script: heatRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'HeatGraphData') }))
    ];
}
function getRelationalSnippets() {
    const relationalLocalScript = `
        {
            "data": [
                [872, 1190, 2192, 1513, 662, 4344, 6429],
                ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                [
                    {source:0,target:1},
                    {source:1,target:2},
                    {source:2,target:3},
                    {source:3,target:4},
                    {source:4,target:5},
                    {source:5,target:6}
                ]
            ],
            "type": "RelationalGraphData"
        }
    `;
    const relationalRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                    [872, 1190, 2192, 1513, 662, 4344, 6429],
                    ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                    [
                        {source:0,target:1},
                        {source:1,target:2},
                        {source:2,target:3},
                        {source:3,target:4},
                        {source:4,target:5},
                        {source:5,target:6}
                    ]
                ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.type = 'RelationalGraphData';
                return data;
            `;
    const relational = {
        name: 'RelationalGraphData',
        desc: '关系图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, relational, { script: relationalLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'RelationalGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, relational, { script: relationalRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'RelationalGraphData') }))
    ];
}
function getFunnelPlotSnippets() {
    const funnelPlotLocalScript = `
        {
            "rowDescriptor": ['访问', '咨询', '订单', '点击', '展现'],
            "data": [
                [60],
                [40],
                [20],
                [80],
                [100]
            ],
            "type": "FunnelPlotGraphData"
        }
    `;
    const funnelPlotRemoteScript = `
                // 下面这行代码仅仅是为了你可以立即看到效果，实际使用时，请删除。
                var data = {data: [
                    [60],
                    [40],
                    [20],
                    [80],
                    [100]
                ]};

                // 实际数据往往来自于数据库，因此请放开下面这行注释
                // var data = Data.fetch('select a,b,c from abc');

                data.rowDescriptor = ['访问', '咨询', '订单', '点击', '展现'];
                data.type = 'FunnelPlotGraphData';
                return data;
            `;
    const funnelPlot = {
        name: 'FunnelPlotGraphData',
        desc: '漏斗图'
    };
    return [
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, funnelPlot, { script: funnelPlotLocalScript, filter: (sourceType, dataType) => sourceType == 'initial' && (dataType == 'Graph Data' || dataType == 'FunnelPlotGraphData') })),
        new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"](Object.assign({}, funnelPlot, { script: funnelPlotRemoteScript, filter: (sourceType, dataType) => sourceType != 'initial' && (dataType == 'Graph Data' || dataType == 'FunnelPlotGraphData') }))
    ];
}


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__jigsaw_input__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeJigsawAutoCompleteInput extends __WEBPACK_IMPORTED_MODULE_0__jigsaw_input__["a" /* AwadeJigsawInput */] {
    constructor() {
        super();
        this.selector = 'jigsaw-auto-complete-input';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawAutoCompleteInput';
        this.inputs = [
            new DataInput(),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'value', type: "string", default: ''
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'clearable', type: "boolean", default: 'true'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: 'true'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'disabled', type: 'boolean', default: 'false'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'placeholder', type: 'string', default: ''
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'maxDropDownHeight', type: 'string', default: ''
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'focus'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'blur'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'valueChange'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawAutoCompleteInput.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            return ` [width]="'100%'" `;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawAutoCompleteInput;

AwadeJigsawAutoCompleteInput.layout = {
    left: 0,
    top: 0,
    width: 19,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};
class DataInput extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"] {
    constructor() {
        super();
        this.property = 'data';
        this.type = ["string[]", "DropDownValue[]"];
        this.required = true;
        this.selectedType = 'string[]';
        this.default = '["选项1","选项2","选项3"]';
        this.snippets.push(new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredSnippet"]({
            name: '不带分组的输入选项',
            desc: '可选择数组中的一项作为输入框的内容',
            script: `
                    ['隐藏/显示元素', '滚动页面', '发送事件到事件总线', '更新变量', '等待弹出关闭', '自定义代码块']
                `,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredSnippet"]({
            name: '带分组的输入选项',
            desc: '可选择某个分组中的一个选项作为输入框的内容',
            script: `
                    [{
                        category: '事件与数据',
                        items: ['发送事件到事件总线', '更新变量']
                    }, {
                        category: '动画',
                        items: ['隐藏/显示元素', '滚动页面']
                    }, {
                        category: '弹出',
                        items: ['对话框', '提醒', '警示', '等待弹出关闭']
                    }, {
                        category: '高级',
                        items: ['自定义代码块']
                    }];
                `,
            filter: sourceType => sourceType == 'initial'
        }));
    }
    ;
}
/* unused harmony export DataInput */



/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeJigsawList extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-list';
        this.className = 'JigsawList';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__["a" /* GeneralAjaxInput */]({
                property: 'data', type: 'any[]', required: true,
                default: '["选项1","选项2","选项3"]'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '{{$item}}'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'selectedItems', type: 'any[]'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'trackItemBy', type: ["string", "string[]"]
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'labelField', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'multipleSelect', type: "boolean"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'selectedItemsChange'
            })];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawList.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    getAttributeHtml(svd) {
        let htmlStr = '';
        const attributes = [];
        svd.inputs && svd.inputs.forEach(input => {
            // data属性用来配置数据，但是不作用于jigsaw-list元素上
            if (input.property.toLowerCase() != 'data') {
                attributes.push(input.toAttribute(svd));
            }
        });
        svd.outputs && svd.outputs.forEach(output => attributes.push(output.toAttribute(svd)));
        svd.events && svd.events.forEach(event => attributes.push(event.toAttribute(svd)));
        const tagName = this.getTagName(svd);
        if (svd.agentId) {
            htmlStr = `<${tagName} ${attributes.join(' ')} #${svd.id} agent="${svd.agentId}" class="${svd.id}_class" [perfectScrollbar]="{wheelSpeed: 0.5, wheelPropagation: true, minScrollbarLength: 20}"`;
        }
        else {
            htmlStr = `<${tagName} ${attributes.join(' ')} #${svd.id} class="${svd.id}_class" [perfectScrollbar]="{wheelSpeed: 0.5, wheelPropagation: true, minScrollbarLength: 20}"`;
        }
        return htmlStr;
    }
    htmlCoder(svd) {
        let htmlStr = this.getAttributeHtml(svd);
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        htmlStr += ` ${membersDefine.ngStyle} >`;
        let innerHtmlInput;
        svd.inputs && svd.inputs.forEach(input => {
            if (input.property.toLowerCase() == 'innerhtml') {
                innerHtmlInput = input;
            }
        });
        if (!!innerHtmlInput) {
            let valueStr;
            if (innerHtmlInput.value && __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"].isInitialDataValid(innerHtmlInput.value.initial)) {
                valueStr = innerHtmlInput.value.initial;
            }
            valueStr = valueStr || innerHtmlInput.default || '';
            htmlStr += `
                <j-list-option *ngFor="let $item of ${svd.id}_data" [value]="$item">
                    ${valueStr}
                </j-list-option>
            `;
        }
        htmlStr += `</${this.getTagName(svd)}>`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawList;

AwadeJigsawList.layout = {
    left: 0,
    top: 0,
    width: 38,
    height: 12,
    scaleDirection: 'none'
};


/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeJigsawListLite extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-list-lite';
        this.className = 'JigsawListLite';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__["a" /* GeneralAjaxInput */]({
                property: 'data', type: 'GroupOptionValue[]', required: true,
                default: '["选项1","选项2","选项3"]'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'selectedItems', type: 'any[]'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'trackItemBy', type: ["string", "string[]"]
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'labelField', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'multipleSelect', type: "boolean"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'searchable', type: "boolean"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'optionCount', type: "number"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'selectedItemsChange'
            })];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [width]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawListLite.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawListLite;

AwadeJigsawListLite.layout = {
    left: 0,
    top: 0,
    width: 7,
    height: 12,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawNumericInput extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-numeric-input';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawNumericInput';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'value', type: "number"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'min', type: "number"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'max', type: "number"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'step', type: "number", default: 1
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'placeholder', type: 'string', default: ''
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'disabled', type: 'boolean', default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'size', type: '"small" | "default" | "large" as size', default: '"default"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'blurOnClear', type: 'boolean', default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'focus'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'blur'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'valueChange'
            }),
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawNumericInput.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            return ` [width]="'100%'" `;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawNumericInput;

AwadeJigsawNumericInput.layout = {
    left: 0,
    top: 0,
    width: 15,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__jigsaw_table__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeJigsawPagination extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-pagination';
        this.className = 'JigsawPagination';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new PaginationDataInput(),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'pageSizeOptions', type: "any", default: '[10, 20, 50]'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'searchable', type: "boolean", default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'showQuickJumper', type: "boolean", default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'mode', type: '"complex"|"simple" as Mode', default: '"complex"'
            }),
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'currentChange'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'pageSizeChange'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'search'
            }),
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawPagination.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawPagination;

AwadeJigsawPagination.layout = {
    left: 0,
    top: 0,
    width: 14,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};
class PaginationDataInput extends __WEBPACK_IMPORTED_MODULE_0__jigsaw_table__["b" /* DataInput */] {
    constructor() {
        super(...arguments);
        this.type = ['LocalPageableTableData', 'PageableTableData'];
        this.selectedType = 'LocalPageableTableData';
    }
}
/* unused harmony export PaginationDataInput */



/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeJigsawRadiosLite extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-radios-lite';
        this.className = 'JigsawRadiosLite';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'value', type: "any"
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'trackItemBy', type: "string", default: 'id'
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'labelField', type: "string", default: 'label'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__util_general_ajax_input__["a" /* GeneralAjaxInput */]({
                property: 'data', type: "ArrayCollection", required: true,
                default: `["选项1","选项2","选项3"]`
            }),
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({
                property: 'valueChange'
            })];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        return '';
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawRadiosLite.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawRadiosLite;

AwadeJigsawRadiosLite.layout = {
    left: 0,
    top: 0,
    width: 24,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawRangeTime extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-range-time';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawRangeTime';
        this.importModule = [
            { module: 'TimeGr', from: '@rdkmaster/jigsaw' },
            { module: 'TimeService', from: '@rdkmaster/jigsaw' }
        ];
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'gr', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'beginDate', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'endDate', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'limitEnd', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'limitStart', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'refreshInterval', type: 'number'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'weekStart', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'grItems', type: 'any[]'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'recommendedBegin', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'recommendedEnd', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'recommendedLabel', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'grChange'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'change'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beginDateChange'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'endDateChange'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            return ` [style.width]="'520px'" `;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawRangeTime.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawRangeTime;

AwadeJigsawRangeTime.layout = {
    left: 0,
    top: 0,
    width: 65,
    height: 29,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawSlider extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-slider';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawSlider';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'value', type: "number", default: 40, required: true
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'min', type: "number"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'max', type: "number"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'step', type: "number", default: 1
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'vertical', type: 'boolean', default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'disabled', type: 'boolean', default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'marks',
                type: "new InputInstance({value: number, label: string, style?: any})[] as SliderMark[]"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'valueChange'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow'],
            //增加如下样式，解决在不居中情况下滑块只能显示一半的问题
            defaultStyle: 'padding:8px; '
        });
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            let verticalInput = svd.inputs.find(input => input.property == 'vertical');
            let verticalCss = verticalInput.value && verticalInput.value.initial ? verticalInput.value.initial : false;
            if (!verticalCss) {
                return 'width: 100%;';
            }
            else {
                return 'height: 100%;';
            }
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawSlider.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawSlider;

AwadeJigsawSlider.layout = {
    left: 0,
    top: 0,
    width: 30,
    height: 3,
    scaleDirection: 'horizontal',
    justify_content: 'center',
    align_items: 'center'
};


/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawSwitch extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-switch';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawSwitch';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'onLabel', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'offLabel', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'size', type: 'small|default|large as size', default: 'default'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'checked', type: 'boolean', default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'disabled', type: 'boolean', default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'checkedChange'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawSwitch.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        return '';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawSwitch;

AwadeJigsawSwitch.layout = {
    left: 0,
    top: 0,
    width: 6,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawTime extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-time';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawTime';
        this.importModule = [
            { module: 'TimeGr', from: '@rdkmaster/jigsaw' },
            { module: 'TimeService', from: '@rdkmaster/jigsaw' }
        ];
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'gr', type: "'second'|'minute'|'hour'|'date'|'week'|'month' as Gr", default: '"second"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'date', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'limitEnd', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'limitStart', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'refreshInterval', type: 'number'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'weekStart', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'grItems', type: 'any[]'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'recommendedBegin', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'recommendedEnd', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'recommendedLabel', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'grChange'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'dateChange'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            return ` width="256" `;
        }
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawTime.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawTime;

AwadeJigsawTime.layout = {
    left: 0,
    top: 0,
    width: 32,
    height: 27,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawTreeExt extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-tree-ext';
        this.className = 'JigsawTreeExt';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'data',
                type: 'TreeData',
                required: true,
                selectedType: 'TreeData',
                default: `
                [{
                    label: '父节点',
                    open: true,
                    nodes: [
                        {label: '子节点1',typeId:11},
                        {label: '子节点2',typeId:12},
                    ]
                }]`,
                coder: function (metadata, rawValue, env) {
                    const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
                    let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
                    const codes = {
                        member: memberDefineCode,
                        ctor: ''
                    };
                    if (this.bindTo && `${metadata.id}_${this.property}` != this.findInputIdWithFirstDefinedBinding(env.svdTree, this.bindTo)) {
                        return codes;
                    }
                    if (!__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData) && !__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData))
                        return codes;
                    codes.import = [{ module: this.selectedType, from: `${metadata.importFrom}` }];
                    codes.ctor += `
                        ${memberReference} = new TreeData();
                    `;
                    if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData)) {
                        const [localParameterName, localParameterDefine] = this.getLocalParameterCode(metadata, initialData);
                        codes.ctor += `
                            ${localParameterDefine}
                            ${memberReference}.fromObject(${localParameterName});
                        `;
                    }
                    if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData)) {
                        let options = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].generateRequestOptions(remoteData);
                        const subscribers = `
                            ${memberReference}.onAjaxComplete(() => {
                                    this.loadingService.dispose();
                            });
                            ${memberReference}.onAjaxError((err) => {
                                this.loadingService.dispose();
                                this.eventBus.emit('${metadata.id}_${this.property}_loaded', err);
                            });
                            ${memberReference}.onAjaxSuccess((data) => {
                                this.loadingService.dispose();
                                this.eventBus.emit('${metadata.id}_${this.property}_loaded', data);
                            });
                            this._subscribers.push(this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, $event => {
                                this.loadingService.show();
                                ${remoteData.dataReviser ? memberReference + '.dataReviser = ' + remoteData.dataReviser : ''}
                                ${memberReference}.fromAjax({
                                    url: '${remoteData.url}',
                                    method: '${remoteData.method}',${options}
                                });
                            }));
                        `;
                        codes.ctor += `
                            ${memberReference}.http = http;
                            ${subscribers}
                        `;
                    }
                    return codes;
                }
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'setting', type: 'ZTreeSettingSetting',
                selectedType: 'ZTreeSettingSetting',
                default: `
                 {
                    edit: {
                        enable: true,
                        showRemoveBtn: false,
                        showRenameBtn: false
                    },
                    data: {
                        key: {
                            children: 'nodes',
                            name: 'label'
                        }
                    }
                }
                `
            }),
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeAsync'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeCheck'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeClick'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeCollapse'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeDblClick'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeDrag'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeDragOpen'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeDrop'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeEditName'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeExpand'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeMouseDown'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeMouseUp'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeRemove'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeRename'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'beforeRightClick'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onAsyncError'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onAsyncSuccess'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onCheck'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onClick'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onCollapse'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onDblClick'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onDrag'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onDragMove'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onDrop'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onExpand'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onMouseDown'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onMouseUp'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onNodeCreated'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onRemove'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onRename'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'onRightClick'
            }),
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawTreeExt.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        return '';
    }
    htmlCoder(svd) {
        let htmlStr = this.getAttributeHtml(svd);
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        htmlStr += ` ${membersDefine.ngStyle} ></${svd.selector}>`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawTreeExt;

AwadeJigsawTreeExt.layout = {
    left: 0,
    top: 0,
    width: 17,
    height: 8,
    scaleDirection: 'none'
};


/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJxRangeTimeSelect extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["BaseJX"] {
    constructor() {
        super();
        this.selector = 'jx-range-time-select';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawComboSelect';
        this.inputs = [
            new ValueInput(),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'openTrigger',
                type: '"click"|"mouseenter"|"mouseleave"|"none" as DropDownTrigger',
                default: '"mouseenter"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'closeTrigger',
                type: '"click"|"mouseenter"|"mouseleave"|"none" as DropDownTrigger',
                default: '"mouseleave"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'clearable', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'autoClose', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'autoWidth', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'open', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'disabled', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'placeholder', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'maxWidth', type: 'number'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'valueChange'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'select'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'remove'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'openChange'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJxRangeTimeSelect.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    getChildArea(svd, inst, el) {
        return { left: 0, top: 0, bottom: 99999, right: 99999, width: 99999, height: 99999 };
    }
    beforeCreate(svd) {
        if (!svd.children || !svd.children.length) {
            svd.children = [];
            let rangeTimeSvd = svd.createSVD('jigsaw-range-time');
            rangeTimeSvd.operations = [
                {
                    ignores: ['uid-operation-delete', 'uid-operation-new']
                }
            ];
            svd.children.push(rangeTimeSvd);
            let openChange = svd.outputs.find(i => i.property == 'openChange');
            if (openChange) {
                Object.assign(openChange, {
                    property: "openChange",
                    desc: "组件特有事件",
                    label: "openChange 组件特有事件",
                    value: []
                });
                let tempEvent = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["ExecutiveFunction"]();
                tempEvent.deserialize({
                    extra: {
                        desc: "openChange",
                        data: `this.${svd.id}_interactive($event);`
                    }
                });
                openChange.value.push(tempEvent);
            }
            svd.save();
        }
    }
    onActivate(svd, inst) {
        if (inst) {
            inst.openTrigger = 'none';
            inst.closeTrigger = 'none';
            inst.open = true;
        }
    }
    onSelect(svd, inst, selectedSVD, selectedInst) {
        if (!inst || inst.open == false) {
            return;
        }
        let isMyChild = (meta) => {
            if (meta === selectedSVD) {
                return true;
            }
            let found = false;
            if (meta.children) {
                meta.children.forEach(m => found = found || isMyChild(m));
            }
            return found;
        };
        if (isMyChild(svd)) {
            // 激活的是自己的子级，不能关闭下拉
            return;
        }
        let openTriggerInput = svd.inputs.find(input => input.property == 'openTrigger');
        inst.openTrigger = openTriggerInput.value && openTriggerInput.value.initial ? openTriggerInput.value.initial.replace(/"/g, '') : openTriggerInput.default.replace(/"/g, '');
        let closeTriggerInput = svd.inputs.find(input => input.property == 'closeTrigger');
        inst.closeTrigger = closeTriggerInput.value && closeTriggerInput.value.initial ? closeTriggerInput.value.initial.replace(/"/g, '') : closeTriggerInput.default.replace(/"/g, '');
        inst.open = false;
    }
    beforeComponentUpdate(svd, inst) {
        if (inst) {
            inst.open = false;
        }
    }
    beforeRemove(svd, inst) {
        if (inst) {
            inst.open = false;
        }
    }
    getTagName() {
        return 'jigsaw-combo-select';
    }
    htmlCoder(svd) {
        let children = [];
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        if (svd.children && svd.children.length > 0) {
            svd.children.forEach(cm => {
                const cmHtmlCoder = cm.htmlCoder(cm);
                children.push(`<ng-template>${cmHtmlCoder.htmlStr}</ng-template>`);
                cmHtmlCoder.member ? membersDefine.members.push(cmHtmlCoder.member) : '';
            });
        }
        let htmlStr = this.getAttributeHtml(svd);
        htmlStr += ` ${membersDefine.ngStyle} >${children.join('\n')}</jigsaw-combo-select>`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
    methodCoder(svd) {
        if (!svd || !svd.children || !svd.children.length)
            return '';
        const rangeTimeSvd = svd.children[0];
        return `
                ${svd.id}_interactive($event) {
                    if(!$event) {
                        if(this._internalVariable['_remove_${svd.id}_dateChange']) {
                            this._internalVariable['_remove_${svd.id}_dateChange'].unsubscribe();
                            this._internalVariable['_remove_${svd.id}_dateChange'] = null;
                        }
                        return;
                    }
                    setTimeout(() => {
                        if(!this.${rangeTimeSvd.id} || !this.${svd.id}) return;
                        if(this.${svd.id}.value && this.${svd.id}.value.length == 2) {
                            setTimeout(() => {
                                this.${rangeTimeSvd.id}.beginDate = this.${svd.id}.value[0].label;
                                this.${rangeTimeSvd.id}.endDate = this.${svd.id}.value[1].label;
                            })
                        }else if(this.${rangeTimeSvd.id}.beginDate && this.${rangeTimeSvd.id}.endDate) {
                            this.${svd.id}.value = [{label: this.${rangeTimeSvd.id}.beginDate}, {label: this.${rangeTimeSvd.id}.endDate}];
                        } else {
                            this.${svd.id}.value = [];
                        }
                        if(this._internalVariable['_remove_${svd.id}_dateChange']) {
                            this._internalVariable['_remove_${svd.id}_dateChange'].unsubscribe();
                            this._internalVariable['_remove_${svd.id}_dateChange'] = null;
                        }
                        this._internalVariable['_remove_${svd.id}_dateChange'] = this.${rangeTimeSvd.id}.change.debounceTime(300).subscribe(() => {
                                this.${svd.id}.value = [{label: this.${rangeTimeSvd.id}.beginDate}, {label: this.${rangeTimeSvd.id}.endDate}];
                        })
                    })

                }

            `;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJxRangeTimeSelect;

AwadeJxRangeTimeSelect.layout = {
    left: 0,
    top: 0,
    width: 31,
    height: 4,
    scaleDirection: 'none'
};
class ValueInput extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"] {
    constructor() {
        super();
        this.property = 'value';
        this.type = 'ArrayCollection';
        this.default = '[{label:\'now-7d\'},{label:\'now\'}]';
        this.required = true;
        this.snippets.push(new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '指定某时间',
            desc: '手动输入时间的字符串',
            script: `[{label:'2018-09-16'},{label:'2018-09-17'}]`,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '今天',
            desc: '默认时间为今天-今天',
            script: `[{label:'now'},{label:'now'}]`,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '昨天-明天',
            desc: '默认时间为昨天-明天',
            script: `[{label:'now-1d'},{label:'now+1d'}]`,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '前天-后天',
            desc: '默认时间为前天-后天',
            script: `[{label:'now-2d'},{label:'now+2d'}]`,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '今天-下周',
            desc: '默认时间今天-下周',
            script: `[{label:'now'},{label:'now+1w'}]`,
            filter: sourceType => sourceType == 'initial'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '今天-下月',
            desc: '默认时间今天-下月',
            script: `[{label:'now'},{label:'now+1M'}]`,
            filter: sourceType => sourceType == 'initial'
        }));
    }
    ;
    coder(metadata, rawValue, env) {
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (rawValue && rawValue.initial) {
            let temp = eval(rawValue.initial);
            temp instanceof Array && temp.forEach((item, index) => {
                if (item && item.label && item.label.indexOf('now') >= 0) {
                    temp[index] = `{label:TimeService.getFormatDate('${item.label}', TimeGr.date)}`;
                }
                else {
                    temp[index] = `{label: '${item.label}'}`;
                }
            });
            rawValue.initial = `[${temp.join(',')}]`;
        }
        this.dataCoder(metadata, rawValue, env, codes, memberReference);
        return codes;
    }
    ;
}
/* unused harmony export ValueInput */



/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJxTimeSelect extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["BaseJX"] {
    constructor() {
        super();
        this.selector = 'jx-time-select';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawComboSelect';
        this.inputs = [
            new ValueInput(),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'openTrigger',
                type: '"click"|"mouseenter"|"mouseleave"|"none" as DropDownTrigger',
                default: '"mouseenter"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'closeTrigger',
                type: '"click"|"mouseenter"|"mouseleave"|"none" as DropDownTrigger',
                default: '"mouseleave"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'clearable', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'autoClose', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'autoWidth', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'open', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'disabled', type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'placeholder', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'maxWidth', type: 'number'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'valid', type: 'boolean', default: true
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'valueChange'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'select'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'remove'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'openChange'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJxTimeSelect.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    getChildArea(svd, inst, el) {
        return { left: 0, top: 0, bottom: 99999, right: 99999, width: 99999, height: 99999 };
    }
    beforeCreate(svd) {
        if (!svd.children || !svd.children.length) {
            svd.children = [];
            let timeSvd = svd.createSVD('jigsaw-time');
            timeSvd.operations = [
                {
                    ignores: ['uid-operation-delete', 'uid-operation-new']
                }
            ];
            svd.children.push(timeSvd);
            let openChange = svd.outputs.find(i => i.property == 'openChange');
            if (openChange) {
                Object.assign(openChange, {
                    property: "openChange",
                    desc: "组件特有事件",
                    label: "openChange 组件特有事件",
                    value: []
                });
                let tempEvent = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["ExecutiveFunction"]();
                tempEvent.deserialize({
                    extra: {
                        desc: "openChange",
                        data: `this.${svd.id}_interactive($event);`
                    }
                });
                openChange.value.push(tempEvent);
            }
            svd.save();
        }
    }
    onActivate(svd, inst) {
        if (inst) {
            inst.openTrigger = 'none';
            inst.closeTrigger = 'none';
            inst.open = true;
        }
    }
    onSelect(svd, inst, selectedSVD, selectedInst) {
        if (!inst || inst.open == false) {
            return;
        }
        let isMyChild = (meta) => {
            if (meta === selectedSVD) {
                return true;
            }
            let found = false;
            if (meta.children) {
                meta.children.forEach(m => found = found || isMyChild(m));
            }
            return found;
        };
        if (isMyChild(svd)) {
            // 激活的是自己的子级，不能关闭下拉
            return;
        }
        let openTriggerInput = svd.inputs.find(input => input.property == 'openTrigger');
        inst.openTrigger = openTriggerInput.value && openTriggerInput.value.local ? openTriggerInput.value.local.replace(/"/g, '') : openTriggerInput.default.replace(/"/g, '');
        let closeTriggerInput = svd.inputs.find(input => input.property == 'closeTrigger');
        inst.closeTrigger = closeTriggerInput.value && closeTriggerInput.value.local ? closeTriggerInput.value.local.replace(/"/g, '') : closeTriggerInput.default.replace(/"/g, '');
        inst.open = false;
    }
    beforeComponentUpdate(svd, inst) {
        if (inst) {
            inst.open = false;
        }
    }
    beforeRemove(svd, inst) {
        if (inst) {
            inst.open = false;
        }
    }
    getTagName() {
        return 'jigsaw-combo-select';
    }
    htmlCoder(svd) {
        let children = [];
        let membersDefine = {
            ngStyle: this.getNgStyle(svd),
            members: []
        };
        if (svd.children && svd.children.length > 0) {
            svd.children.forEach(cm => {
                const cmHtmlCoder = cm.htmlCoder(cm);
                children.push(`<ng-template>${cmHtmlCoder.htmlStr}</ng-template>`);
                cmHtmlCoder.member ? membersDefine.members.push(cmHtmlCoder.member) : '';
            });
        }
        let htmlStr = this.getAttributeHtml(svd);
        htmlStr += ` ${membersDefine.ngStyle} >${children.join('\n')}</jigsaw-combo-select>`;
        return {
            htmlStr: htmlStr,
            member: membersDefine.members.join('\n')
        };
    }
    methodCoder(svd) {
        if (!svd || !svd.children || !svd.children.length)
            return '';
        const timeSvd = svd.children[0];
        return `
            ${svd.id}_interactive($event) {
                if(!$event) {
                    if(this._internalVariable['_remove_${svd.id}_dateChange']) {
                        this._internalVariable['_remove_${svd.id}_dateChange'].unsubscribe();
                        this._internalVariable['_remove_${svd.id}_dateChange'] = null;
                    }
                    return;
                }
                setTimeout(() => {
                    if(!this.${timeSvd.id} || !this.${svd.id}) return;
                    if(this.${svd.id}.value && this.${svd.id}.value.length == 1) {
                        this.${timeSvd.id}.date = this.${svd.id}.value[0].label;
                    }else if(this.${timeSvd.id}.date) {
                        this.${svd.id}.value = [{label: this.${timeSvd.id}.date}];
                    } else {
                        this.${svd.id}.value = [];
                    }
                    if(this._internalVariable['_remove_${svd.id}_dateChange']) {
                        this._internalVariable['_remove_${svd.id}_dateChange'].unsubscribe();
                        this._internalVariable['_remove_${svd.id}_dateChange'] = null;
                    }
                    this._internalVariable['_remove_${svd.id}_dateChange'] = this.${timeSvd.id}.dateChange.subscribe(event => {
                        this.${svd.id}.value = [{label: this.${timeSvd.id}.date}];
                    })
                })
            }
         `;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJxTimeSelect;

AwadeJxTimeSelect.layout = {
    left: 0,
    top: 0,
    width: 30,
    height: 4,
    scaleDirection: 'none'
};
class ValueInput extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"] {
    constructor() {
        super();
        this.property = 'value';
        this.type = 'ArrayCollection';
        this.default = '[{label:\'now\'}]';
        this.required = true;
        this.snippets.push(new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '指定某时间',
            desc: '手动输入时间的字符串',
            script: `[{label:'2018-09-17'}]`,
            filter: sourceType => sourceType == 'local'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '今天',
            desc: '默认时间为今天',
            script: `[{label:'now'}]`,
            filter: sourceType => sourceType == 'local'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '明天',
            desc: '默认时间为明天',
            script: `[{label:'now+1d'}]`,
            filter: sourceType => sourceType == 'local'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '后天',
            desc: '默认时间为后天',
            script: `[{label:'now+2d'}]`,
            filter: sourceType => sourceType == 'local'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '下周',
            desc: '默认时间往后推一周',
            script: `[{label:'now+1w'}]`,
            filter: sourceType => sourceType == 'local'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '下月',
            desc: '默认时间往后推一月',
            script: `[{label:'now+1M'}]`,
            filter: sourceType => sourceType == 'local'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '昨天',
            desc: '默认时间为明天',
            script: `[{label:'now-1d'}]`,
            filter: sourceType => sourceType == 'local'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '前天',
            desc: '默认时间为前天',
            script: `[{label:'now-2d'}]`,
            filter: sourceType => sourceType == 'local'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '上周',
            desc: '默认时间往前推一周',
            script: `[{label:'now-1w'}]`,
            filter: sourceType => sourceType == 'local'
        }), new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '上月',
            desc: '默认时间往前推一月',
            script: `[{label:'now-1M'}]`,
            filter: sourceType => sourceType == 'local'
        }));
    }
    ;
    coder(metadata, rawValue, env) {
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (rawValue && rawValue.initial) {
            let temp = eval(rawValue.initial);
            if (temp instanceof Array && temp[0] && temp[0].label && temp[0].label.indexOf('now') >= 0) {
                rawValue.initial = `[{label:TimeService.getFormatDate('${temp[0].label}', TimeGr.date)}]`;
            }
        }
        this.dataCoder(metadata, rawValue, env, codes, memberReference);
        return codes;
    }
    ;
}
/* unused harmony export ValueInput */



/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawIcon extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-icon';
        this.className = 'JigsawIcon';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'isLinkButton', type: "boolean", default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'icon', type: 'AwadeIcon', required: true, default: '"iconfont iconfont-e91d"',
                _transformedTypes: [{ model: 'AwadeIcon' }]
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'iconSize', type: 'number', default: 16
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'iconColor', type: 'AwadeColor'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'text', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'textSize', type: 'number', default: 14
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'textColor', type: 'AwadeColor'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'iconPosition', type: '"left" | "top" as IconPosition', default: '"left"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'href', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'target', type: 'string', default: '_blank'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'title', type: 'string'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawIcon.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        return '';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawIcon;

AwadeJigsawIcon.layout = {
    left: 0,
    top: 0,
    width: 2,
    height: 3,
    scaleDirection: 'none',
    justify_content: 'center',
    align_items: 'center'
};


/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawTag extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-tag';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawTag';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'color', type: 'AwadeColor', default: ''
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'closable', type: "boolean", default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'showBorder', type: "boolean", default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'innerHTML', type: 'string', required: true, default: '标签文本'
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'close'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'select'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawTag.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        return '';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawTag;

AwadeJigsawTag.layout = {
    left: 0,
    top: 0,
    width: 9,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawLoading extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-font-loading';
        this.className = 'JigsawFontLoading';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'color', type: 'AwadeColor', default: "\"#41addc\"", required: true
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow', 'color']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawLoading.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        return '';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawLoading;

AwadeJigsawLoading.layout = {
    left: 0,
    top: 0,
    width: 5,
    height: 5,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawTransfer extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-transfer';
        this.className = 'JigsawTransfer';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new DataInput(),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'selectedItems',
                type: ['ArrayCollection'],
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'trackItemBy', type: ["string", "string[]"]
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'labelField', type: "string", default: "'label'"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'subLabelField', type: "string"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'searchable', type: 'boolean'
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'selectedItemsChange'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawTransfer.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawTransfer;

AwadeJigsawTransfer.layout = {
    left: 0,
    top: 0,
    width: 50,
    height: 25,
    scaleDirection: 'none'
};
class DataInput extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"] {
    constructor() {
        super();
        this.property = 'data';
        this.type = ['ArrayCollection', 'LocalPageableArray', 'PageableArray'];
        this.required = true;
        this.selectedType = 'ArrayCollection';
        this.default = `
               [
                    {label: "item1"},
                    {label: "item2"},
                    {label: "item3"},
                    {label: "item4"},
                    {label: "item5"},
                    {label: "item6"}
               ]
    `;
        this.snippets.push(new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredSnippet"]({
            name: '默认数据',
            desc: '默认数据',
            script: `
                    [
                        {label: "item1"},
                        {label: "item2"},
                        {label: "item3"},
                        {label: "item4"},
                        {label: "item5"},
                        {label: "item6"}
                   ]
                `,
            filter: sourceType => sourceType == 'initial'
        }));
    }
    ;
    coder(metadata, rawValue, env) {
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (this.bindTo && `${metadata.id}_${this.property}` != this.findInputIdWithFirstDefinedBinding(env.svdTree, this.bindTo)) {
            return codes;
        }
        if (!__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData) && !__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData))
            return codes;
        codes.import = [{ module: this.selectedType, from: `${metadata.importFrom}` }];
        codes.ctor += `
            ${memberReference}=new ${this.selectedType}${this.selectedType == 'PageableArray' ? `(http, '${rawValue.url}')` : '()'};
        `;
        if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isInitialDataValid(initialData) && this.selectedType != 'PageableArray') {
            const [localParameterName, localParameterDefine] = this.getLocalParameterCode(metadata, initialData);
            codes.ctor += `
                ${localParameterDefine}
                ${memberReference}.fromArray(${localParameterName})
            `;
        }
        if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRemoteDataValid(remoteData)) {
            let options = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].generateRequestOptions(remoteData);
            const subscribers = `
                ${memberReference}.onAjaxComplete(() => {
                    this.loadingService.dispose();
                });
                ${memberReference}.onAjaxError(() => {
                    this.loadingService.dispose();
                });
                ${memberReference}.onAjaxSuccess((data) => {
                    this.loadingService.dispose();
                    this.eventBus.emit('${metadata.id}_${this.property}_loaded', data);
                });
                this._subscribers.push(this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, $event => {
                    this.loadingService.show();
                    ${remoteData.dataReviser ? memberReference + '.dataReviser = ' + remoteData.dataReviser : ''}
                    ${memberReference}.fromAjax({
                        url: '${remoteData.url}',
                        method: '${remoteData.method}',${options}
                    });
                }));
            `;
            codes.ctor += `
                ${memberReference}.http = http;
                ${subscribers}
            `;
        }
        return codes;
    }
}
/* unused harmony export DataInput */



/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawUpload extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-upload';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawUpload';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'targetUrl', type: 'string', default: ''
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'fileType', type: "string", default: ''
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'multiple', type: "boolean", default: true
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'progress'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'update'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'remove'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'complete'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'start'
            })
        ];
    }
    sizeCoder(svd, type) {
        return '';
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawUpload.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawUpload;

AwadeJigsawUpload.layout = {
    left: 0,
    top: 0,
    width: 50,
    height: 50,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class RouterOutlet extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super(...arguments);
        this.selector = 'router-outlet';
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, RouterOutlet.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    htmlCoder(svd, env) {
        let ngStyle = '';
        ngStyle += ` [style.width]="'100%'" `;
        ngStyle += ` [style.height]="'100%'" `;
        const tagName = this.getTagName(svd);
        let htmlStr = `<div class="${svd.id}_class" ${ngStyle}><${tagName}></${tagName}></div>`;
        return {
            htmlStr: htmlStr,
            member: `
                public _routerInfo = {color: 'lightcyan'}; // 路由模块信息
            `
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RouterOutlet;

RouterOutlet.layout = {
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    scaleDirection: 'both'
};


/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawBreadcrumb extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-breadcrumb';
        this.className = 'JigsawBreadcrumb';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'separator', type: 'string'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'generatorContext', type: 'any'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'theme', type: "'light'|'dark'|'inner' as theme"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'routesConfig',
                type: 'BreadcrumbRouteConfig[]',
                required: true,
                selectedType: 'BreadcrumbRouteConfig[]',
                coder: function (metadata, rawValue, env) {
                    const [memberReference, memberDefineCode] = this.getMemberCode(metadata, this.selectedType);
                    const codes = {
                        import: [
                            { module: 'BreadcrumbRouteConfig', from: `${metadata.importFrom}` },
                            { module: 'BreadcrumbNode', from: `${metadata.importFrom}` },
                            { module: 'BreadcrumbGenerator', from: `${metadata.importFrom}` }
                        ],
                        member: memberDefineCode,
                        ctor: ''
                    };
                    return this.dataCoder(metadata, rawValue, env, codes, memberReference);
                }
            }),
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['width', 'height', 'margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        return '';
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawBreadcrumb.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawBreadcrumb;

AwadeJigsawBreadcrumb.layout = {
    left: 0,
    top: 0,
    width: 30,
    height: 7,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_layout__ = __webpack_require__(2);

class AwadeComboLayout extends __WEBPACK_IMPORTED_MODULE_0__awade_layout__["a" /* AwadeLayout */] {
    constructor() {
        super(...arguments);
        this.selector = 'awade-combo-layout';
        this.tagName = 'awade-layout';
    }
    sizeCoder(svd, type) {
        return '';
    }
    getLabel() {
        return '';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeComboLayout;



/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_layout__ = __webpack_require__(2);

class AwadeDrawerLayout extends __WEBPACK_IMPORTED_MODULE_0__awade_layout__["a" /* AwadeLayout */] {
    constructor() {
        super(...arguments);
        this.selector = 'awade-drawer-layout';
        this.tagName = 'awade-layout';
        this.operations = [
            {
                ignores: ['uid-operation-delete', 'uid-operation-new']
            }
        ];
    }
    sizeCoder(svd, type) {
        return '';
    }
    getLabel() {
        return '';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeDrawerLayout;



/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawTextarea extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-textarea';
        this.className = 'JigsawTextarea';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'value', type: "string", default: ''
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'clearable', type: "boolean", default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'disabled', type: "boolean", default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'valid', type: "boolean", default: true
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'placeholder', type: 'string', default: ''
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'focus'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'blur'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'valueChange'
            })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawTextarea.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawTextarea;

AwadeJigsawTextarea.layout = {
    left: 0,
    top: 0,
    width: 40,
    height: 20,
    scaleDirection: 'none'
};


/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_div_base__ = __webpack_require__(9);

class AwadePlaceholder extends __WEBPACK_IMPORTED_MODULE_0__common_div_base__["a" /* AwadeDivBase */] {
    constructor() {
        super(...arguments);
        this.selector = 'awade-placeholder';
        this.tagName = 'div';
    }
    getFacadeCss(svd, env) {
        let facadeCssStr = '';
        facadeCssStr += super.getFacadeCss(svd, env);
        if (!svd.styles.backgroundColorCheck && env.target == 'dev') {
            facadeCssStr += "background:#41addc;opacity:0.2";
        }
        return facadeCssStr;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadePlaceholder;



/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeGroup extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'awade-group';
        this.tagName = 'div';
        this.acceptDroppedNode = true;
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'font', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    beforeCreate(svd) {
        if (svd.children == undefined) {
            svd.children = [];
            let layout = svd.createSVD('awade-group-layout');
            svd.children.push(layout);
            svd.save();
        }
    }
    ;
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeGroup.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeGroup;

AwadeGroup.layout = {
    left: 0,
    top: 0,
    width: 20,
    height: 10,
    scaleDirection: 'horizontal'
};


/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_layout__ = __webpack_require__(2);

class AwadeGroupLayout extends __WEBPACK_IMPORTED_MODULE_0__awade_layout__["a" /* AwadeLayout */] {
    constructor() {
        super(...arguments);
        this.selector = 'awade-group-layout';
        this.tagName = 'awade-layout';
    }
    getLabel() {
        return '';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeGroupLayout;



/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__jigsaw_tabs__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeViewStack extends __WEBPACK_IMPORTED_MODULE_0__jigsaw_tabs__["a" /* AwadeJigsawTabs */] {
    constructor() {
        super();
        this.selector = 'jx-view-stack';
        this.tagName = 'jigsaw-tabs';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawTab';
        this.operations = [
            {
                icon: 'iconfont iconfont-e48d', label: '添加一个视图', tooltip: '添加一个视图', context: true, type: 'add'
            },
            {
                icon: 'iconfont iconfont-e48b', label: '将视图移到最前面', tooltip: '将视图移到最前面', context: true, type: 'move'
            },
            {
                icon: 'iconfont iconfont-e489', label: '删除当前视图', tooltip: '删除当前视图', context: true, type: 'remove'
            },
        ];
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
                property: 'selectedIndex', type: 'number'
            }),
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["OutputInstance"]({ property: 'selectedIndexChange' })
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["StructuredStyle"]({
            allows: ['opacity', 'visibility']
        });
    }
    initLayout(svd, title, selector) {
        return super.initLayout(svd, 'View', 'awade-view-stack-layout');
    }
    onSelect(svd, inst, selectedSVD, selectedInst) {
        if (!svd || !selectedSVD || selectedSVD.selector != "awade-view-stack-layout") {
            return;
        }
        this.setIndex(svd, inst, selectedSVD);
    }
    htmlCoder(svd, env) {
        let headlessInput = new __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"]({
            property: 'headless', type: 'boolean', value: { initial: true }
        });
        svd.inputs.push(headlessInput);
        return super.htmlCoder(svd, env);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeViewStack;



/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_tabs_layout__ = __webpack_require__(10);

class AwadeViewStackLayout extends __WEBPACK_IMPORTED_MODULE_0__awade_tabs_layout__["a" /* AwadeTabsLayout */] {
    constructor() {
        super();
        this.selector = 'awade-view-stack-layout';
        this.tagName = 'awade-layout';
        this.operations = [
            {
                icon: 'iconfont iconfont-e48d', label: '添加一个视图', tooltip: '添加一个视图', context: true, type: 'add'
            },
            {
                icon: 'iconfont iconfont-e48b', label: '将视图移到最前面', tooltip: '将视图移到最前面', context: true, type: 'move'
            },
            {
                ignores: ['uid-operation-new']
            }
        ];
    }
    initLayout(svd, title, selector) {
        return __WEBPACK_IMPORTED_MODULE_0__awade_tabs_layout__["a" /* AwadeTabsLayout */].initLayout(svd, 'View', this.selector);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeViewStackLayout;



/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_div_base__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_basics__);


class AwadeNgIf extends __WEBPACK_IMPORTED_MODULE_0__common_div_base__["a" /* AwadeDivBase */] {
    constructor() {
        super();
        this.selector = 'ngx-if';
        this.tagName = 'div';
        this.acceptDroppedNode = true;
        this.inputs = [
            new NgIfInput()
        ];
    }
    beforeCreate(svd) {
        if (svd.children == undefined) {
            svd.children = [];
            let layout = svd.createSVD('awade-group-layout');
            svd.children.push(layout);
            svd.save();
        }
    }
    ;
    /**
     *
     * @param svd
     * @param membersDefine
     * @param {string} ngif 设置在父级div上时，ngif需要根据变量值来计算得出，
     * @returns {any}
     */
    getMetaStyle(svd, env, membersDefine, flex) {
        if (!svd.inputs) {
            return;
        }
        let ngIf = '';
        if (svd.inputs && svd.inputs[0].property.toLowerCase() == 'condition') {
            let input = svd.inputs[0];
            if (input.bindTo) {
                if (env.target == 'dev') {
                    ngIf += `  [style.visibility]="!!${input.bindTo} ? 'visible' : 'hidden'" `;
                }
                else {
                    ngIf += `  *ngIf="!!${input.bindTo}" `;
                }
            }
            else {
                if (env.target == 'dev') {
                    ngIf += ` [style.visibility]="${svd.id}_ngIf" `;
                }
                else {
                    ngIf += ` *ngIf="${svd.id}_ngIf" `;
                }
            }
            membersDefine.ngStyle = membersDefine.ngStyle + ngIf;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeNgIf;

class NgIfInput extends __WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"] {
    constructor() {
        super(...arguments);
        this.property = 'condition';
        this.type = 'string';
        this.default = true;
        this.required = true;
    }
    toAttribute(metaData) {
        return '';
    }
    coder(metadata, rawValue, env) {
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata, env);
        let codes = {
            member: memberDefineCode,
            ctor: ''
        };
        return codes;
    }
    getMemberCode(metaData, env, memberType) {
        const memberName = this.getMemberName(metaData);
        const match = memberName.match(/\bthis\./g);
        const memberReference = match ? memberName : `this.${memberName}`;
        memberType = 'string';
        let memberDefineCode;
        if (this.bindTo) {
            memberDefineCode = this.doBindTo(this.bindTo, memberName, memberType);
        }
        else {
            memberDefineCode = this.doValue(metaData, memberReference, memberDefineCode, env);
        }
        return [memberReference, memberDefineCode];
    }
    doBindTo(bindTo, memberName, memberType) {
        let bindToDefineCode;
        if (bindTo.match(/\bthis\./g)) {
            bindToDefineCode = '';
        }
        else {
            bindToDefineCode = `public ${memberName}: ${memberType};`;
        }
        return bindToDefineCode;
    }
    doValue(metaData, memberReference, memberDefineCode, env) {
        let input = metaData.inputs[0];
        let valueDefineCode;
        if (__WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"].isRawRemoteDataValid(input.value.remote)) {
            console.error(`显示隐藏容器${metaData.id}的condition属性暂不支持远程数据，请重新设置本地属性`);
            return '';
        }
        if (!input.bindTo && !__WEBPACK_IMPORTED_MODULE_1__awade_basics__["InputInstance"].isInitialDataValid(input.value.initial)) {
            console.error(`显示隐藏容器${metaData.id}的condition属性输入错误，请重新输入`);
            return '';
        }
        if (env.target == 'dev') {
            valueDefineCode =
                `
                private _${metaData.id}_ngIf;
                get ${metaData.id}_ngIf(){
                    try {
                        return !!(${input.value.initial}) ? 'visible' : 'hidden';
                    } catch (e) {
                        console.error('get ${metaData.id}_ngIf error: ', e.message);
                    }
                }
                set ${metaData.id}_ngIf(value: any) {
                    try {
                        this._${metaData.id}_ngIf = !!value ? 'visible' : 'hidden';
                    } catch (e) {
                        console.error('get ${metaData.id}_css_visibility error: ', e.message);
                    }
                }
                `;
        }
        else {
            valueDefineCode =
                `   
                private _${metaData.id}_ngIf;
                get ${metaData.id}_ngIf(){
                    try {
                        return !!(${input.value.initial});
                    } catch (e) {
                        console.error('get ${metaData.id}_ngIf error: ', e.message);
                    }
                }
                set ${metaData.id}_ngIf(value: any) {
                    try {
                        this._${metaData.id}_ngIf = !!value;
                    } catch (e) {
                        console.error('set ${metaData.id}__ngIf error: ', e.message);
                    }
                }
                `;
        }
        return valueDefineCode;
    }
}
/* unused harmony export NgIfInput */



/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeJigsawRate extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'jigsaw-rate';
        this.importFrom = '@rdkmaster/jigsaw';
        this.className = 'JigsawRateComponent';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'icon', type: 'AwadeIcon', required: true, default: '"iconfont iconfont-e91d"',
                _transformedTypes: [{ model: 'AwadeIcon' }]
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'max', type: "number", default: 5
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'allowHalf', type: "boolean", default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'value', type: 'number', default: 0
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'disabled', type: 'boolean', default: false
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'valueChange'
            }),
        ];
        this.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]({
            allows: ['margin', 'opacity', 'visibility', 'background', 'border', 'shadow']
        });
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeJigsawRate.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            return ` [width]="'100%'" `;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeJigsawRate;

AwadeJigsawRate.layout = {
    left: 0,
    top: 0,
    width: 15,
    height: 4,
    scaleDirection: 'none',
    align_items: 'center'
};


/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeFloatDirective extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["DirectiveBase"] {
    constructor() {
        super();
        this.selector = 'jigsaw-float';
        this.desc = '为宿主组件增加下拉视图功能';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'jigsawFloatTarget', type: 'AwadePopupable', default: '', required: true,
                coder(metaData, rawValue, env) {
                    const [memberReference, memberDefineCode] = this.getMemberCode(metaData);
                    const codes = {
                        ctor: '',
                        member: memberDefineCode,
                        import: [{ module: `${this.value.initial}`, from: `./${this.value.initial}` }]
                    };
                    return this.dataCoder(metaData, rawValue, env, codes, memberReference);
                }
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'jigsawFloatOptions',
                type: 'PopupOptions'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'jigsawFloatPosition',
                type: '"bottomLeft" | "bottomRight" | "topLeft" | "topRight" |"leftTop" | "leftBottom" | "rightTop" | "rightBottom" as FloatPosition',
                default: '"bottomLeft"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'jigsawFloatOpen', type: 'boolean', default: false
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'jigsawFloatOpenTrigger',
                type: '"click" | "mouseenter" | "none" as FloatOpenTrigger',
                default: '"mouseenter"'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'jigsawFloatCloseTrigger',
                type: '"click" | "mouseleave" | "none" as FloatCloseTrigger',
                default: '"mouseleave"'
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'jigsawFloatOpenChange'
            })
        ];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeFloatDirective;



/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeUploadDirective extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["DirectiveBase"] {
    constructor() {
        super();
        this.selector = 'j-upload';
        this.desc = '为宿主组件提供点击上传功能';
        this.className = 'JigsawUploadDirective';
        this.importFrom = '@rdkmaster/jigsaw';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'uploadTargetUrl',
                type: 'string',
                default: '/rdk/service/common/upload'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'uploadFileType',
                type: 'string',
                default: '.png,.jpg'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'uploadMultiple',
                type: 'boolean'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'uploadOptionCount',
                type: 'number'
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'uploadProgress'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'uploadRemove'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'uploadComplete'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'uploadStart'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'uploadUpdate'
            })
        ];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeUploadDirective;



/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_popupable_component__ = __webpack_require__(17);

class AwadeRepeatComponent extends __WEBPACK_IMPORTED_MODULE_0__awade_popupable_component__["a" /* AwadePopupableComponent */] {
    constructor() {
        super();
        this.selector = 'awade-repeat-component';
        this.tagName = 'div';
        this.extend = 'extends RepeatViewBase';
        this.importModule = [
            { module: 'RepeatViewBase', from: '@awade/uid-sdk' }
        ];
        this.superSection = 'super();';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeRepeatComponent;



/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

class AwadeRepeat extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'awade-repeat';
        this.tagName = 'awade-repeat';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'data', type: "any"
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'iterateWith', type: "AwadeRepeatable",
                coder(metaData, rawValue, env) {
                    const [memberReference, memberDefineCode] = this.getMemberCode(metaData);
                    const codes = {
                        ctor: '',
                        member: memberDefineCode,
                        import: [{ module: `${this.value.initial}`, from: `./${this.value.initial}` }]
                    };
                    return this.dataCoder(metaData, rawValue, env, codes, memberReference);
                }
            })
        ];
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeRepeat.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    sizeCoder(svd, type) {
        if (type == 'css') {
            return '';
        }
        else {
            let ngStyle = '';
            ngStyle += ` [style.width]="'100%'" `;
            ngStyle += ` [style.height]="'100%'" `;
            return ngStyle;
        }
    }
    //组件外面加上视图复制容器所需要的样式
    getMetaStyle(svd, env, membersDefine, flex) {
        super.getMetaStyle(svd, env, membersDefine, flex);
        if (!svd.inputs) {
            return;
        }
        membersDefine.metaStyle = 'overflow: auto;display: flex;flex-direction: row;flex-wrap: wrap;';
        membersDefine.ngStyle = membersDefine.ngStyle + ` [perfectScrollbar]="{wheelSpeed: 0.5, wheelPropagation: true}" `;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeRepeat;

AwadeRepeat.layout = {
    left: 0,
    top: 0,
    width: 80,
    height: 60,
    scaleDirection: 'horizontal'
};


/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = translate;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_uid_sdk__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__awade_uid_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__awade_uid_sdk__);
/**
 type SVDCollection = {component: string, svd: any};
 type MetadataCollection = {selector: string, metadata: any};
 type TranslatedCode = {component: string, code: string}

 svds: SVDCollection
 metadata: MetadataCollection
 */


function translate(rawSVDCollection, env, i18n, routers, sharedData) {
    const components = [];
    let services = [];
    // 用于多组件时，在根模块里配置国际化词条
    const i18nCode = createI18nChanges(i18n);
    // 当前所有模块, 表格的自定义渲染器那边用到了
    env.components = [];
    rawSVDCollection && rawSVDCollection.forEach((rawSVD) => {
        env.components.push(rawSVD.component);
    });
    rawSVDCollection && rawSVDCollection.forEach((rawSVD) => {
        env.componentName = rawSVD.component;
        let metaSVD = eval('(' + rawSVD.svd + ')');
        const mi = new env.metadata[metaSVD.selector]();
        mi._awadeComponents = env.metadata;
        mi.deserialize(metaSVD);
        env.svdTree = mi;
        preSvdCollection(mi);
        components.push({ component: rawSVD.component, code: toTypescript(mi, rawSVD.component, env, sharedData) });
        makeService(mi, rawSVD.component, env.templates, services, sharedData);
    });
    services.push({ service: 'i18n', code: generateI18nServer(i18n) });
    services.push(...Object(__WEBPACK_IMPORTED_MODULE_1__awade_uid_sdk__["invokeHooks"])('compile', env.user, env.project, rawSVDCollection));
    // 生成路由配置代码
    const routersCode = getRouterCode(routers);
    services = postMakeService(services, env.templates);
    return { components, services, i18nCode, routersCode };
}
// 对svd进行预处理
function preSvdCollection(svd) {
    function getSVD(id, targetSVD) {
        if (id == targetSVD.id) {
            return targetSVD;
        }
        else if (targetSVD.children) {
            for (let item of targetSVD.children) {
                let temp = getSVD(id, item);
                if (temp) {
                    return temp;
                }
            }
        }
        return false;
    }
    function preWalkInputsOutputs(metadata, rootSvd) {
        let allOutputs = [].concat(metadata.outputs, metadata.events, metadata.lifecycleHooks, metadata.triggers);
        allOutputs.forEach((output) => {
            // 事件中设置了显示隐藏某个组件，需要将其标记出来，以便后端在生成代码的时候，加上[style.visibility]和[style.display]属性
            if (!__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isDefined(output) || !__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isDefined(output.value)) {
                return;
            }
            output.value.forEach((value) => {
                if (value.type == __WEBPACK_IMPORTED_MODULE_0__awade_basics__["BaseAction"].TOGGLE_VISIBILITY) {
                    let target = getSVD(value.extra.id, rootSvd);
                    if (!target) {
                        console.error('找不到id为 ' + value.extra.id + ' 的控件');
                        return;
                    }
                    if (!__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isDefined(target.styles)) {
                        target.styles = new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredStyle"]();
                    }
                    if (value.extra.occupy.type == 'visibility' && !__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkVariable(target.styles.visibility)) {
                        target.styles.visibility = `${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["BaseAction"].TOGGLE_VISIBILITY}_${target.id}_${target.styles.visibility}`;
                    }
                    if (value.extra.occupy.type == 'display' && !__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].checkVariable(target.styles.display)) {
                        target.styles.display = `${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["BaseAction"].TOGGLE_VISIBILITY}_${target.id}_${target.styles.display}`;
                    }
                }
            });
        });
        metadata.children && metadata.children.forEach(child => preWalkInputsOutputs(child, rootSvd));
    }
    preWalkInputsOutputs(svd, svd);
}
// 获取路由配置代码
function getRouterCode(routers) {
    // 获取路由配置的模块import
    function getRouterImport(imports, router) {
        if (imports.findIndex(impt => impt.module == router.component) == -1 && router.component != 'AppComponent') {
            imports.push({ module: router.component, from: `app/generated/${router.component}` });
        }
        if (router.children && router.children.length > 0) {
            router.children.forEach((child) => {
                getRouterImport(imports, child);
            });
        }
    }
    function getCode(router, usedGuards) {
        let path = router.param ? `${router.path}/:${router.param}` : `${router.path}`;
        let code = `
            {
                path: "${path}",
                component: ${router.component},
                resolve: {appQueryParamsService: AppQueryParamsService},
        `;
        // 路由守卫
        if (router.canActivate) {
            code += `canActivate: [${router.canActivate}],`;
            if (usedGuards.findIndex(guard => guard.name == router.canActivate) == -1) {
                const guard = getGuard(routers.guards, router.canActivate);
                if (guard) {
                    usedGuards.push(guard);
                }
            }
        }
        if (router.canDeactivate) {
            code += `canDeactivate: [${router.canDeactivate}],`;
            if (usedGuards.findIndex(guard => guard.name == router.canDeactivate) == -1) {
                const guard = getGuard(routers.guards, router.canDeactivate);
                if (guard) {
                    usedGuards.push(guard);
                }
            }
        }
        if (router.children && router.children.length > 0) {
            let codes = [];
            router.children.forEach((child) => {
                codes.push(getCode(child, usedGuards));
            });
            code += `
                children: [
                    ${codes.join(', ')}
            ]`;
        }
        code += '\n}';
        return code;
    }
    function getGuard(guards, activate) {
        for (let i = 0; i < guards.length; i++) {
            if (guards[i].name == activate) {
                return guards[i];
            }
        }
        return null;
    }
    const tempRouters = routers.routers;
    let imports = [];
    let codes = [];
    let usedGuards = [];
    if (tempRouters && tempRouters.length > 0) {
        tempRouters.forEach((router) => {
            getRouterImport(imports, router);
            codes.push(getCode(router, usedGuards));
        });
    }
    else {
        codes.push(`{path: '', component: AppComponent, resolve: {appQueryParamsService: AppQueryParamsService}}`);
    }
    codes.push(`{path: '**', component: AppComponent, resolve: {appQueryParamsService: AppQueryParamsService}}`);
    // 处理路由守卫信息
    if (usedGuards.length > 0) {
        imports.push({ module: 'Router', from: '@angular/router' });
        imports.push({ module: 'ActivatedRouteSnapshot', from: '@angular/router' });
        imports.push({ module: 'RouterStateSnapshot', from: '@angular/router' });
        imports.push({ module: 'Injectable', from: '@angular/core' });
        imports.push({ module: 'HttpClient', from: '@angular/common/http' });
        imports.push({ module: 'Observable', from: 'rxjs/Observable' });
        imports.push({ module: 'DataBus', from: '@awade/uid-sdk' });
        imports.push({ module: 'EventBus', from: '@awade/uid-sdk' });
        usedGuards.forEach((guard) => {
            if (guard.type == 'entry' && imports.findIndex(impt => impt.module == 'CanActivate') == -1) {
                imports.push({ module: 'CanActivate', from: '@angular/router' });
            }
            if (guard.type == 'exit' && imports.findIndex(impt => impt.module == 'CanDeactivate') == -1) {
                imports.push({ module: 'CanDeactivate', from: '@angular/router' });
            }
        });
    }
    return {
        import: `${mergeImport(imports).join('\n')}`,
        code: `[
            ${codes.join(', ')}
        ]`,
        usedGuards: usedGuards
    };
}
function generateI18nServer(i18n) {
    if (!i18n || !i18n.data)
        return `
        (function() {
            return {
                "en_US": {},
                "zh_CN": {}
            }
        })();
    `;
    let serverI18n = `
    (function() {
        return {
    `;
    let serverI18nZh = '"zh_CN": {\n';
    let serverI18nEn = '"en_US": {\n';
    i18n.data.forEach(row => {
        if (!row[3])
            return;
        const prop = row[0].replace(/(['"])/g, '\\$1');
        const zhName = row[1].replace(/(['"])/g, '\\$1');
        const enName = row[2].replace(/(['"])/g, '\\$1');
        serverI18nZh += `'${prop}': '${zhName}',\n`;
        serverI18nEn += `'${prop}': '${enName}',\n`;
    });
    serverI18nZh += '}';
    serverI18nEn += '}';
    serverI18n += `
        ${serverI18nZh},
        ${serverI18nEn}
        }
    })();
    `;
    return serverI18n;
}
function getI18nSetter(i18n) {
    if (!i18n || !i18n.data)
        return '';
    let i18nZhSetter = `translateService.setTranslation('zh', { \n`;
    let i18nEnSetter = `translateService.setTranslation('en', { \n`;
    i18n.data.forEach(row => {
        if (!row[3])
            return;
        const prop = row[0].replace(/(['"])/g, '\\$1');
        const zhName = row[1].replace(/(['"])/g, '\\$1');
        const enName = row[2].replace(/(['"])/g, '\\$1');
        i18nZhSetter += `    '${prop}': '${zhName}', \n`;
        i18nEnSetter += `    '${prop}': '${enName}', \n`;
    });
    i18nZhSetter += `}, true); \n`;
    i18nEnSetter += `}, true); \n`;
    return i18nZhSetter + i18nEnSetter;
}
function createI18nChanges(i18n) {
    let i18nChanges = getI18nSetter(i18n) + `
        this.http.get('/rdk/service/app/common/locale').subscribe((lang: any) => {
            TranslateHelper.changeLanguage(this.translateService, lang.result.split('_')[0]);
        });

        this.dataBus.i18n = {};

    `;
    if (!i18n || !i18n.data)
        return i18nChanges;
    const i18nPropSetters = i18n.data.filter(row => (row[3])).map(row => {
        const prop = row[0].replace(/(['"])/g, '\\$1');
        return `this.dataBus.i18n['${prop}'] = this.translateService.instant('${prop}');`;
    }).join('\n');
    i18nChanges += `
        ${i18nPropSetters}
        TranslateHelper.languageChangEvent.subscribe((langInfo: {oldLang: string, curLang: string}) => {
            ${i18nPropSetters}
        })
    `;
    return i18nChanges;
}
function createMethods(svd, tsCode) {
    if (svd.methodCoder)
        tsCode.method.push(svd.methodCoder(svd));
    if (svd.children && svd.children.length) {
        svd.children.forEach(item => {
            createMethods(item, tsCode);
        });
    }
    if (svd.directives && svd.directives.length) {
        svd.directives.forEach(item => {
            createMethods(item, tsCode);
        });
    }
}
function toTypescript(svd, component, env, sharedData) {
    const tsCode = {
        extend: '',
        import: [],
        inject: [],
        super: '',
        ctor: [],
        member: [],
        method: [],
        viewChild: [],
        onInit: [],
        afterViewInit: [],
        onDestroy: []
    };
    let html = '';
    let css = '';
    if (svd.htmlCoder) {
        const htmlCoder = svd.htmlCoder(svd, env);
        if (htmlCoder) {
            html = htmlCoder.htmlStr;
            tsCode.member.push(htmlCoder.member);
            tsCode.afterViewInit.push(htmlCoder.afterViewInit);
        }
    }
    if (svd.cssCoder) {
        css = svd.cssCoder(svd, env);
    }
    tsCode.import.push({ module: 'Component', from: '@angular/core' });
    tsCode.import.push({ module: 'ViewChild', from: '@angular/core' });
    tsCode.import.push({ module: 'HttpClient', from: '@angular/common/http' });
    tsCode.import.push({ module: 'ElementRef', from: '@angular/core' });
    tsCode.import.push({ module: 'NgZone', from: '@angular/core' });
    tsCode.import.push({ module: 'EventBus', from: '@awade/uid-sdk' });
    tsCode.import.push({ module: 'DataBus', from: '@awade/uid-sdk' });
    tsCode.import.push({ module: 'LogService', from: '@awade/uid-sdk' });
    tsCode.import.push({ module: 'LoadingService', from: '@awade/uid-sdk' });
    tsCode.import.push({ module: 'TranslateService', from: '@ngx-translate/core' });
    // 路由模块，增加参数获取的代码
    if (svd.config && svd.config.moduleType == "common") {
        tsCode.member.push('public routerParamValue;');
        tsCode.import.push({ module: 'ActivatedRoute', from: '@angular/router' });
        tsCode.import.push({ module: 'Params', from: '@angular/router' });
        tsCode.inject.push('private route: ActivatedRoute');
        tsCode.import.push({ module: 'Router', from: '@angular/router' });
        tsCode.inject.push('private router: Router');
        tsCode.import.push({ module: 'Location', from: '@angular/common' });
        tsCode.inject.push('private location: Location');
        tsCode.onInit.push(`
            this.route.params.subscribe((params: Params) => {
                this.routerParamValue = params[this.paramName];
            });
        `);
        if (svd.config.routeParam) {
            tsCode.member.push(`public paramName = '${svd.config.routeParam}';`);
        }
        else {
            tsCode.member.push('public paramName;');
        }
    }
    walkInputsOutputs(svd, tsCode, env, component, sharedData);
    createMethods(svd, tsCode);
    let typescriptCode = `
        ${mergeImport(tsCode.import).join('\n')}

        const console = LogService;

        @Component({
             template: \`
                ${html}
             \`,
             styles:[\`
                ${css}
             \`]
        })
        export class ${component} ${tsCode.extend} {
            // 存放所有订阅事件
            private _subscribers: any[] = [];

            constructor(${mergeInject(tsCode.inject).join(', \n')}) {
                ${tsCode.super}

                ${tsCode.ctor.join('\n//---------------------\n')}
            }

            public get i18n() {
                return this.dataBus.i18n;
            }

            private _internalVariable: any = {};

            ${tsCode.viewChild.join('\n')}

            ${tsCode.member.join('\n')}

            ${tsCode.method.join('\n\n')}

            ngOnInit() {
                this.eventBus.emit('${component}_onInit');
                ${tsCode.onInit.join('\n')}
            }

            ngAfterViewInit() {
                this.eventBus.emit('${component}_afterViewInit');
                ${tsCode.afterViewInit.join('\n')}
            }

            ngOnDestroy() {
                ${tsCode.onDestroy.join('\n')}

                this._subscribers.forEach(subscriber => {
                    subscriber.unsubscribe();
                });
            }
        }

    `;
    if (env.target == 'dev') {
        typescriptCode = typescriptCode.replace(/\b(awade-assets\/.+)/g, `/rdk/app/ui-designer/pub/${env.user}/${env.project}/web/src/$1`);
    }
    return typescriptCode;
}
function mergeImport(imports) {
    let temp = [], outImports = [];
    imports.forEach((itemImport) => {
        let repeatItem, repeatTempItem;
        temp.forEach((tempItemImport) => {
            if (tempItemImport.from == itemImport.from) {
                repeatItem = itemImport;
                repeatTempItem = tempItemImport;
            }
        });
        if (repeatItem && repeatTempItem) {
            repeatTempItem.modules.push(repeatItem.module);
        }
        else {
            temp.push({ from: itemImport.from, modules: [itemImport.module] });
        }
    });
    temp.forEach((tempItemImport) => {
        outImports.push(`import { ${tempItemImport.modules.join(',')}} from '${tempItemImport.from}';`);
    });
    return outImports;
}
function mergeInject(injects) {
    // 固定注入的服务
    injects.push('private http: HttpClient');
    injects.push('private zone: NgZone');
    injects.push('public eventBus: EventBus');
    injects.push('public dataBus: DataBus');
    injects.push('public translateService: TranslateService');
    injects.push('public loadingService: LoadingService');
    injects = injects.filter((item, index, arr) => arr.indexOf(item) === index);
    return injects;
}
function walkInputsOutputs(metadata, tsCode, env, component, sharedData) {
    function append(partialCode, tsCode) {
        if (!partialCode) {
            return;
        }
        if (partialCode.hasOwnProperty('import') && partialCode.import) {
            partialCode.import.forEach((pImportItem) => {
                let repeat = false;
                tsCode.import.forEach((item) => {
                    if (item.module == pImportItem.module && item.from == pImportItem.from) {
                        repeat = true;
                    }
                });
                if (!repeat) {
                    tsCode.import.push(pImportItem);
                }
            });
        }
        if (partialCode.hasOwnProperty('inject') && partialCode.inject) {
            partialCode.inject.forEach((pInjectItem) => {
                let repeat = false;
                tsCode.inject.forEach((item) => {
                    if (item == pInjectItem) {
                        repeat = true;
                    }
                });
                if (!repeat) {
                    tsCode.inject.push(pInjectItem);
                }
            });
        }
        if (partialCode.hasOwnProperty('ctor') && partialCode.ctor) {
            tsCode.ctor.push(partialCode.ctor);
        }
        if (partialCode.hasOwnProperty('member') && partialCode.member) {
            const regExp = /^\s*public\s+(\w+):\s+\w+;\s*$/;
            const partialCodeMatch = partialCode.member.match(regExp);
            let sameMember;
            if (partialCodeMatch && partialCodeMatch[1]) {
                sameMember = tsCode.member.find(m => {
                    const match = m.match(regExp);
                    return match && match[1] == partialCodeMatch[1];
                });
            }
            if (!sameMember) {
                tsCode.member.push(partialCode.member);
            }
        }
        if (partialCode.hasOwnProperty('method')) {
            tsCode.method.push(partialCode.method);
        }
        if (partialCode.hasOwnProperty('onInit')) {
            tsCode.onInit.push(partialCode.onInit);
        }
        if (partialCode.hasOwnProperty('afterViewInit')) {
            tsCode.afterViewInit.push(partialCode.afterViewInit);
        }
        if (partialCode.hasOwnProperty('onDestroy')) {
            tsCode.onDestroy.push(partialCode.onDestroy);
        }
        if (partialCode.hasOwnProperty('extend')) {
            tsCode.extend = partialCode.extend;
        }
        if (partialCode.hasOwnProperty('super')) {
            tsCode.super = partialCode.super;
        }
    }
    function generateParams(rawValue) {
        rawValue.forEach((value) => {
            if (!(value instanceof __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteDataEvent"]) || !value.extra.remoteData.mock ||
                !value.extra.remoteData.mock.enabled) {
                return;
            }
            let params = {};
            let script = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].getSharedData(value.extra.remoteData.mock.script, sharedData);
            __WEBPACK_IMPORTED_MODULE_0__awade_basics__["paramProcessor"].generateParams(script, params);
            let paramStr = value.extra.remoteData.params || '';
            if (Object.keys(params).length > 0) {
                paramStr = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].mergeJsonStr(JSON.stringify(params), paramStr);
            }
            value.extra.remoteData.params = paramStr.replace(/"((this)((\.\w+)+))"/g, '$1')
                .replace(/"((\$event)((\.\w+)*))"/g, '$1');
        });
    }
    let repeat = false;
    tsCode.import.forEach((item) => {
        if (item.module == metadata.className && item.from == metadata.importFrom) {
            repeat = true;
        }
    });
    if (!repeat) {
        if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isDefined(metadata.className)) {
            tsCode.import.push({ module: metadata.className, from: metadata.importFrom });
        }
    }
    if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isDefined(metadata.extend)) {
        tsCode.extend = metadata.extend;
    }
    if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isDefined(metadata.superSection)) {
        tsCode.super = metadata.superSection;
    }
    if (!!metadata.importModule) {
        metadata.importModule.forEach((module) => {
            repeat = false;
            tsCode.import.forEach((item) => {
                if (item.module == module.module && item.from == module.from) {
                    repeat = true;
                }
            });
            if (!repeat) {
                tsCode.import.push({ module: module.module, from: module.from });
            }
        });
    }
    metadata.inputs && metadata.inputs.forEach((input) => {
        if (!input.hasOwnProperty('value') && !input.required)
            return;
        if (input.required && !input.hasOwnProperty('value')) {
            input.value = { initial: input.default };
        }
        input.selectedType = input.selectedType ? input.selectedType :
            (input.type instanceof Array ? input.type[0] : input.type);
        // 保持metadata不变
        const rawValue = input.value;
        let translatedValue = {};
        const [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        // 0 也是合法值
        if (initialData !== null && initialData !== undefined && initialData !== '') {
            // 生成本地数据
            translatedValue.initial = initialData;
            // 本地数据字符串格式转换
            if (input.selectedType == 'string' && typeof initialData === 'string' && !initialData.match(/\bthis\.\w+/g)) {
                translatedValue.initial = `'${initialData}'`;
            }
        }
        if (remoteData && Object.keys(remoteData).length != 0) {
            // 生成远程数据: 需要根据 remoteData.type 实例化具体的对象，并将对应的配置参数给这个对象
            let remoteDataClass;
            if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].global && __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].global.awade && __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].global.awade.services instanceof Array) {
                // 获取远程数据类型的类实例
                const service = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].global.awade.services.find(service => service.name == remoteData.type);
                if (service) {
                    remoteDataClass = service.remoteData;
                }
            }
            const remoteDataInstance = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteData"].of(remoteData, remoteDataClass);
            // 生成代码
            if (remoteDataInstance) {
                translatedValue.remote = remoteDataInstance.convert({
                    property: input.property,
                    metaId: metadata.id,
                    component: component,
                    appName: env.appName,
                    selectedType: input.selectedType,
                    bindTo: input.bindTo,
                    sharedData: sharedData
                });
            }
        }
        let code = input.coder.call(input, metadata, translatedValue, env);
        append(code, tsCode);
    });
    let debounceStr = '';
    metadata.outputs && metadata.outputs.forEach(output => {
        if (!output.hasOwnProperty('value'))
            return;
        let rawValue = output.value;
        generateParams(rawValue);
        const code = output.coder.call(output, metadata, rawValue);
        if (output.debounce && output.debounce > 0 && __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isDefined(output.value)) {
            tsCode.viewChild.push(`
            private _subscriber_${metadata.id}_${output.property};
        `);
            debounceStr += `
            this._subscriber_${metadata.id}_${output.property} && this._subscriber_${metadata.id}_${output.property}.unsubscribe();
            this._subscriber_${metadata.id}_${output.property} = this.${metadata.id}.${output.property}.debounceTime(${output.debounce}).subscribe(this.${metadata.id}_${output.property}.bind(this));
        `;
            if (!__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isDefined(code.onDestroy)) {
                code.onDestroy = [];
            }
            code.onDestroy.push(`this._subscriber_${metadata.id}_${output.property} && this._subscriber_${metadata.id}_${output.property}.unsubscribe();`);
        }
        append(code, tsCode);
    });
    // 考虑到事件缓冲 viewChild 要放到带有事件缓冲的 output后面
    let className = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isDefined(metadata.className) ? metadata.className : 'ElementRef';
    tsCode.viewChild.push(`
        private _${metadata.id} :  ${className};
        @ViewChild('${metadata.id}')
        get ${metadata.id}():  ${className} {
            return this._${metadata.id};
        }
        set ${metadata.id}(value: ${className}) {
            if (!value || value === this._${metadata.id}) {
                return;
            }
            this._${metadata.id} = value;
            ${debounceStr}
        }
    `);
    metadata.events && metadata.events.forEach(eventItem => {
        let rawValue = eventItem.value;
        generateParams(rawValue);
        const code = eventItem.coder.call(eventItem, metadata, rawValue, env);
        append(code, tsCode);
    });
    metadata.lifecycleHooks && metadata.lifecycleHooks.forEach(lifecycleHook => {
        let rawValue = lifecycleHook.value;
        generateParams(rawValue);
        const code = lifecycleHook.coder.call(lifecycleHook, metadata, rawValue, env);
        append(code, tsCode);
    });
    metadata.children && metadata.children.forEach(child => walkInputsOutputs(child, tsCode, env, component, sharedData));
    metadata.directives && metadata.directives.forEach(child => walkInputsOutputs(child, tsCode, env, component, sharedData));
    metadata.triggers && metadata.triggers.forEach(trigger => {
        let rawValue = trigger.value;
        generateParams(rawValue);
        const code = trigger.coder.call(trigger, metadata, rawValue, env);
        append(code, tsCode);
    });
}
function makeService(metadata, component, serviceTemplates, services, sharedData) {
    metadata.inputs && metadata.inputs.forEach(input => {
        if (!input || !input.value || !__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].isRawRemoteDataValid(input.value.remote)) {
            return;
        }
        const remoteValue = input.value.remote;
        if (remoteValue.type != __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteData"].SQL && remoteValue.type != __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteData"].DYNAMIC && remoteValue.type != __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteData"].RESTFUL) {
            // 这里只处理sql和dynamic类型，其他自定义类型由插件自行处理
            return;
        }
        if (remoteValue.script && metadata.className == 'JigsawGraph' && input.property == 'data' && input.selectedType == 'EChart Options') {
            remoteValue.script = remoteValue.script.replace(/(['"]?formatter['"]?\s*:\s*)((function\s*\([\s\S]*?\)\s*{[\s\S]*?}\/\*function end\*\/)|(function\s*\([\s\S]*?\)\s*{[^}]*?}))/g, function (found, property, functionBody) {
                return `${property}` + `"${functionBody.replace(/\/\*function end\*\//g, '').replace(/"/g, '\\"').replace(/\r?\n/g, '" +\n"')}"`;
            });
        }
        let fixedScript = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["paramProcessor"].translateParamName(remoteValue.script, 'req.$1');
        if (remoteValue.type == __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteData"].SQL) {
            fixedScript = fixedScript.replace(/"/g, '\\"').replace(/\r?\n/g, '" +\n"');
            const dataSource = (remoteValue.dataSource && remoteValue.dataSource.value) ? remoteValue.dataSource.value : 'default';
            fixedScript = `var sql = "${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["paramProcessor"].generateSqlScript(fixedScript)}";
                var data = Data.fetchWithDataSource("${dataSource}", sql);;
                data.header = I18n.format(data.field);
                return data;`;
        }
        let mockScript = '';
        if (remoteValue.mock && remoteValue.mock.enabled && remoteValue.mock.script) {
            let script = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].getSharedData(remoteValue.mock.script, sharedData);
            mockScript = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["paramProcessor"].translateParamName(script, 'req.$1');
        }
        let entireScript = fixedScript;
        if (remoteValue.type == __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteData"].DYNAMIC || remoteValue.type == __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteData"].SQL) {
            entireScript = mockScript ? mockScript : fixedScript;
            services.push({
                service: `${component}-${metadata.id}-${input.property}`,
                code: entireScript,
                type: remoteValue.type
            });
        }
        else if (mockScript && remoteValue.type == __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteData"].RESTFUL) {
            services.push({
                service: remoteValue.url,
                code: mockScript,
                method: remoteValue.method,
                params: remoteValue.params,
                type: remoteValue.type
            });
        }
    });
    metadata.triggers && metadata.triggers.forEach(trigger => {
        getRestService(trigger, sharedData, services);
    });
    metadata.events && metadata.events.forEach(eventItem => {
        getRestService(eventItem, sharedData, services);
    });
    metadata.outputs && metadata.outputs.forEach(output => {
        getRestService(output, sharedData, services);
    });
    metadata.lifecycleHooks && metadata.lifecycleHooks.forEach(lifecycleHook => {
        getRestService(lifecycleHook, sharedData, services);
    });
    metadata.children && metadata.children.forEach(child => makeService(child, component, serviceTemplates, services, sharedData));
}
function getRestService(output, sharedData, services) {
    if (!output.hasOwnProperty('value'))
        return;
    let rawValue = output.value;
    rawValue.forEach((val) => {
        if (val.type == 'remote-data' && val.extra.remoteData.mock && val.extra.remoteData.mock.enabled) {
            const remoteData = val.extra.remoteData;
            let code = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].getSharedData(remoteData.mock.script, sharedData);
            code = __WEBPACK_IMPORTED_MODULE_0__awade_basics__["paramProcessor"].translateParamName(code, 'req.$1');
            services.push({
                service: remoteData.url,
                code: code,
                method: remoteData.method,
                params: remoteData.params,
                type: val.type
            });
        }
    });
}
function postMakeService(services, templates) {
    const groupBy = (arr, fn) => arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
        acc[val] = (acc[val] || []).concat(arr[i]);
        return acc;
    }, {});
    // 合并url之后的services
    const groupServices = groupBy(services, 'service');
    const postServices = Object.keys(groupServices).map((serviceName) => {
        const serviceGroupArr = groupServices[serviceName];
        if (serviceGroupArr.length === 1) {
            let service = serviceGroupArr[0];
            if (service.type == __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteData"].SQL || service.type == __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteData"].DYNAMIC) {
                service.code = templates.dynamicOrSql.replace('/*/ will-be-replaced-by-service-code /*/', service.code);
            }
            else if (service.type == __WEBPACK_IMPORTED_MODULE_0__awade_basics__["RemoteData"].RESTFUL || service.type == 'remote-data') {
                service = replaceRestTemplate(serviceGroupArr, templates.rest);
            }
            return service;
        }
        else if (serviceGroupArr.length > 1) {
            return replaceRestTemplate(serviceGroupArr, templates.rest);
        }
    });
    return postServices;
}
function replaceRestTemplate(services, template) {
    let script = template;
    services.forEach((service) => {
        if (service.method.toLowerCase() == 'get') {
            script = script.replace('/*/ will-be-replaced-by-get-service-code /*/', service.code);
        }
        else if (service.method.toLowerCase() == 'post') {
            script = script.replace('/*/ will-be-replaced-by-post-service-code /*/', service.code);
        }
        else if (service.method.toLowerCase() == 'put') {
            script = script.replace('/*/ will-be-replaced-by-put-service-code /*/', service.code);
        }
        else if (service.method.toLowerCase() == 'delete') {
            script = script.replace('/*/ will-be-replaced-by-delete-service-code /*/', service.code);
        }
    });
    return { service: services[0].service, code: script, type: 'restful' };
}


/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__plugins_eweb_web_src_lib_components_ewebgis_eweb_gis_metadata__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__plugins_eweb_web_src_lib_hook_hooks__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__plugins_pluto_web_src_lib_components_pluto_pluto_remote_data__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__plugins_pluto_web_src_lib_components_pluto_pluto_action__ = __webpack_require__(25);




const allPluginInfo = [
    {
        name: "eweb",
        metadatas: [
            {
                selector: "eweb-gis",
                class: __WEBPACK_IMPORTED_MODULE_0__plugins_eweb_web_src_lib_components_ewebgis_eweb_gis_metadata__["a" /* AwadeEwebGis */]
            },
        ],
        hooks: [__WEBPACK_IMPORTED_MODULE_1__plugins_eweb_web_src_lib_hook_hooks__["a" /* compilationHook */]],
    },
];
/* harmony export (immutable) */ __webpack_exports__["a"] = allPluginInfo;

const allServices = [
    {
        label: "Pluto",
        name: "Pluto",
        remoteData: __WEBPACK_IMPORTED_MODULE_2__plugins_pluto_web_src_lib_components_pluto_pluto_remote_data__["a" /* PlutoRemoteData */],
    },
];
/* unused harmony export allServices */

const allActions = [
    {
        name: "Pluto",
        action: __WEBPACK_IMPORTED_MODULE_3__plugins_pluto_web_src_lib_components_pluto_pluto_action__["a" /* PlutoAction */],
    },
];
/* unused harmony export allActions */

global.awade = { plugins: allPluginInfo, services: allServices, actions: allActions };


/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_basics__);

if (__WEBPACK_IMPORTED_MODULE_0__awade_basics__["util"].isInBrowser && window['awade'] && window['awade'].plugins) {
    window['awade'].plugins.push({
        init: (categories, metadata) => {
            if (!(categories instanceof Array) || !metadata)
                return;
            // 添加category
            const category = categories.find(c => c.category == '数据呈现 DataDisplay');
            const components = category.components;
            components.unshift({
                selector: 'eweb-gis',
                label: 'eWeb GIS',
                desc: '基础 WebGIS 组件，对 WebGIS 提供极简包装，支持最多4个GIS同框对比',
                // icon在awade的访问路径，固定格式assets/icon/plugin-<name>/<icon-file>
                icon: 'assets/icon/plugin-eweb/ewebgis.svg'
            });
            // 隐藏某个组件，这边相当于用插件替换原有组件
            components.find(c => c.selector == 'uid-basic-gis').hidden = true;
            // 添加metadata
            metadata["eweb-gis"] = AwadeEwebGis;
        },
        initContext: null
    });
}
class AwadeEwebGis extends __WEBPACK_IMPORTED_MODULE_0__awade_basics__["StructuredViewDescriptor"] {
    constructor() {
        super();
        this.selector = 'eweb-gis';
        this.tagName = 'eweb-gis';
        this.label = 'eWeb Gis';
        this.inputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'width', type: 'string', default: '100%'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'height', type: 'string', default: '100%'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'initMap', type: 'eWeb Function',
                coder: this.initMapCoder
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'loadProjCells', type: 'eWeb Function',
                coder: this.loadProjCellsCoder
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'renderCells', type: 'eWeb Function',
                coder: this.renderCellsCoder
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'loadGrids', type: 'eWeb Function',
                coder: this.loadGridsCoder
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'loadArea', type: 'eWeb Function',
                coder: this.loadAreaCoder
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'cellToGrid', type: 'eWeb Function',
                coder: this.cellToGridCoder
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'gridToCell', type: 'eWeb Function',
                coder: this.gridToCellCoder
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'cellHightGrid', type: 'eWeb Function',
                coder: this.cellHightGridCoder
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'switchOnCellHeatMap', type: 'eWeb Function',
                coder: this.switchOnCellHeatMapCoder
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'switchOnSiteHeatMap', type: 'eWeb Function',
                coder: this.switchOnSiteHeatMapCoder
            }),
            // 设置小区弹窗显示的内容
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"]({
                property: 'cellWindowShow', type: 'eWeb Function',
                coder: this.cellWindowShowCoder
            })
        ];
        this.outputs = [
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'ready'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'InitMap'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'CellInfoWindowShowing'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'GridInfoWindowShowing'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'PAInfoWindowShowing'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'NewCallInfoWindowShowing'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'CallInfoWindowShowing'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'cellToGridInfoWindowShowing'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'gridToCellInfoWindowShowing'
            }),
            new __WEBPACK_IMPORTED_MODULE_0__awade_basics__["OutputInstance"]({
                property: 'cellHightGridInfoWindowShowing'
            })
        ];
    }
    get layout() {
        if (!this._layout) {
            this._layout = {};
            Object.assign(this._layout, AwadeEwebGis.layout);
        }
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
    }
    initMapCoder(metadata, rawValue, env) {
        console.log('************initMapCoder*******************');
        console.log(metadata, rawValue); // 服务端可看到
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (remoteData && remoteData.url && remoteData.triggers && remoteData.triggers.length) {
            const subscribers = `
                this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, data => {
                    let initMapFuncPara = Object.assign({
                        moduleName: '${metadata.id}initMap',
                        funcName: '${env.user}',
                        secondFuncName: '${env.project}',
                        id:'${metadata.id}',
                        component:'${remoteData.url}',
                        property:'initMap'
                    }, ${remoteData.params});
                    (this.${metadata.id} as any).initMapFunc(initMapFuncPara);
                });
            `;
            codes.ctor += `
                ${subscribers}
            `;
        }
        return codes;
    }
    loadProjCellsCoder(metadata, rawValue, env) {
        console.log('************eweb meta*******************');
        console.log(metadata, rawValue); //服务端可看到
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        let callback = `() => {
            (this.${metadata.id} as any).renderCellsFunc((this.${metadata.id} as any).renderPara);
            (this.${metadata.id} as any).loadGridsFunc((this.${metadata.id} as any).gridsPara);
        }`;
        if (remoteData && remoteData.url && remoteData.triggers && remoteData.triggers.length) {
            const subscribers = `
                this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, data => {
                    let loadProjCellsFuncPara = Object.assign({
                        moduleName: '${metadata.id}loadProjCells',
                        funcName: '${env.user}',
                        secondFuncName: '${env.project}',
                        id:'${metadata.id}',
                        component:'${remoteData.url}',
                        property:'loadProjCells'
                    }, ${remoteData.params});
                    (this.${metadata.id} as any).loadProjCellsFunc(loadProjCellsFuncPara, ${callback});
                });
            `;
            codes.ctor += `
                ${subscribers}
            `;
        }
        return codes;
    }
    renderCellsCoder(metadata, rawValue, env) {
        console.log('************eweb meta*******************');
        console.log(metadata, rawValue); //服务端可看到
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (remoteData && remoteData.url && remoteData.triggers && remoteData.triggers.length) {
            const subscribers = `
                this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, data => {
                    let renderCellsFuncPara = Object.assign({
                        moduleName: '${metadata.id}renderCells',
                        funcName: '${env.user}',
                        secondFuncName: '${env.project}',
                        id:'${metadata.id}',
                        component:'${remoteData.url}',
                        property:'renderCells'
                    }, ${remoteData.params});
                    (this.${metadata.id} as any).renderCellsFunc(renderCellsFuncPara);
                });
            `;
            codes.ctor += `
                ${subscribers}
            `;
        }
        return codes;
    }
    loadGridsCoder(metadata, rawValue, env) {
        console.log('************eweb meta*******************');
        console.log(metadata, rawValue); //服务端可看到
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (remoteData && remoteData.url && remoteData.triggers && remoteData.triggers.length) {
            const subscribers = `
                this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, data => {
                    let loadGridsFuncPara = Object.assign({
                        moduleName: '${metadata.id}loadGrids',
                        funcName: '${env.user}',
                        secondFuncName: '${env.project}',
                        id:'${metadata.id}',
                        component:'${remoteData.url}',
                        property:'loadGrids'
                    }, ${remoteData.params});
                    (this.${metadata.id} as any).loadGridsFunc(loadGridsFuncPara);
                });
            `;
            codes.ctor += `
                ${subscribers}
            `;
        }
        return codes;
    }
    loadAreaCoder(metadata, rawValue, env) {
        console.log('************eweb meta*******************');
        console.log(metadata, rawValue); //服务端可看到
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (remoteData && remoteData.url && remoteData.triggers && remoteData.triggers.length) {
            const subscribers = `
                this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, data => {
                    let loadAreaFuncPara = Object.assign({
                        moduleName: '${metadata.id}loadArea',
                        funcName: '${env.user}',
                        secondFuncName: '${env.project}',
                        id:'${metadata.id}',
                        component:'${remoteData.url}',
                        property:'loadArea'
                    }, ${remoteData.params});
                    (this.${metadata.id} as any).loadAreaFunc(loadAreaFuncPara);
                });
            `;
            codes.ctor += `
                ${subscribers}
            `;
        }
        return codes;
    }
    cellToGridCoder(metadata, rawValue, env) {
        console.log('************eweb meta*******************');
        console.log(metadata, rawValue); //服务端可看到
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (remoteData && remoteData.url && remoteData.triggers && remoteData.triggers.length) {
            const subscribers = `
                this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, data => {
                    let cellToGridFuncPara = Object.assign({
                        moduleName: '${metadata.id}cellToGrid',
                        funcName: '${env.user}',
                        secondFuncName: '${env.project}',
                        id:'${metadata.id}',
                        component:'${remoteData.url}',
                        property:'cellToGrid'
                    }, ${remoteData.params});
                    (this.${metadata.id} as any).cellToGridFunc(cellToGridFuncPara);
                });
            `;
            codes.ctor += `
                ${subscribers}
            `;
        }
        return codes;
    }
    gridToCellCoder(metadata, rawValue, env) {
        console.log('************eweb meta*******************');
        console.log(metadata, rawValue); //服务端可看到
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (remoteData && remoteData.url && remoteData.triggers && remoteData.triggers.length) {
            const subscribers = `
                this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)},data =>{
                    let gridToCellFuncPara = Object.assign({
                        moduleName: '${metadata.id}gridToCell',
                        funcName: '${env.user}',
                        secondFuncName: '${env.project}',
                        id:'${metadata.id}',
                        component:'${remoteData.url}',
                        property:'gridToCell'
                    }, ${remoteData.params});
                    (this.${metadata.id} as any).gridToCellFunc(gridToCellFuncPara);
                });
            `;
            codes.ctor += `
                ${subscribers}
            `;
        }
        return codes;
    }
    cellHightGridCoder(metadata, rawValue, env) {
        console.log('************eweb meta*******************');
        console.log(metadata, rawValue); //服务端可看到
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (remoteData && remoteData.url && remoteData.triggers && remoteData.triggers.length) {
            const subscribers = `
                this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)},data =>{
                    let cellHightGridFuncPara = Object.assign({
                        moduleName: '${metadata.id}cellHightGrid',
                        funcName: '${env.user}',
                        secondFuncName: '${env.project}',
                        id:'${metadata.id}',
                        component:'${remoteData.url}',
                        property:'cellHightGrid'
                    }, ${remoteData.params});
                    (this.${metadata.id} as any).cellHightGridFunc(cellHightGridFuncPara);
                });
            `;
            codes.ctor += `
                ${subscribers}
            `;
        }
        return codes;
    }
    switchOnCellHeatMapCoder(metadata, rawValue, env) {
        console.log('************eweb meta*******************');
        console.log(metadata, rawValue); //服务端可看到
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (remoteData && remoteData.url && remoteData.triggers && remoteData.triggers.length) {
            const subscribers = `
            this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, data => {
                let switchOnCellHeatMapFuncPara = Object.assign({
                    moduleName: '${metadata.id}switchOnCellHeatMap',
                    funcName: '${env.user}',
                    secondFuncName: '${env.project}',
                    id:'${metadata.id}',
                    component:'${remoteData.url}',
                    property:'switchOnCellHeatMap'
                }, ${remoteData.params});
                (this.${metadata.id} as any).switchOnCellHeatMapFunc(switchOnCellHeatMapFuncPara);
            });
        `;
            codes.ctor += `
            ${subscribers}
        `;
        }
        return codes;
    }
    switchOnSiteHeatMapCoder(metadata, rawValue, env) {
        console.log('************eweb meta*******************');
        console.log(metadata, rawValue); //服务端可看到
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (remoteData && remoteData.url && remoteData.triggers && remoteData.triggers.length) {
            const subscribers = `
            this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, data => {
                let switchOnSiteHeatMapFuncPara = Object.assign({
                    moduleName: '${metadata.id}switchOnSiteHeatMap',
                    funcName: '${env.user}',
                    secondFuncName: '${env.project}',
                    id:'${metadata.id}',
                    component:'${remoteData.url}',
                    property:'switchOnSiteHeatMap'
                }, ${remoteData.params});
                (this.${metadata.id} as any).switchOnSiteHeatMapFunc(switchOnSiteHeatMapFuncPara);
            });
        `;
            codes.ctor += `
            ${subscribers}
        `;
        }
        return codes;
    }
    cellWindowShowCoder(metadata, rawValue, env) {
        console.log('************eweb meta*******************');
        console.log(metadata, rawValue); //服务端可看到
        const [memberReference, memberDefineCode] = this.getMemberCode(metadata);
        let [initialData, remoteData] = [rawValue.initial, rawValue.remote];
        const codes = {
            member: memberDefineCode,
            ctor: ''
        };
        if (remoteData && remoteData.url && remoteData.triggers && remoteData.triggers.length) {
            const subscribers = `
            this.eventBus.subscribe(${__WEBPACK_IMPORTED_MODULE_0__awade_basics__["InputInstance"].fixLifeHooksName(remoteData.triggers, env.componentName)}, data => {
                let cellWindowShowFuncPara = Object.assign({
                    moduleName: '${metadata.id}cellWindowShow',
                    funcName: '${env.user}',
                    secondFuncName: '${env.project}',
                    id:'${metadata.id}',
                    component:'${remoteData.url}',
                    property:'cellWindowShow'
                }, ${remoteData.params});
                (this.${metadata.id} as any).cellWindowShowFunc(cellWindowShowFuncPara);
            });
        `;
            codes.ctor += `
            ${subscribers}
        `;
        }
        return codes;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AwadeEwebGis;

AwadeEwebGis.layout = {
    left: 0,
    top: 0,
    width: 30,
    height: 30,
    scaleDirection: 'both'
};


/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = compilationHook;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_uid_sdk__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__awade_uid_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__awade_uid_sdk__);

Object(__WEBPACK_IMPORTED_MODULE_0__awade_uid_sdk__["registerHook"])('eweb', 'compile', compilationHook);
function compilationHook(user, project, svdList) {
    let svds = [];
    let componentName = undefined;
    svdList.forEach(function (svdInfo) {
        if (!svdInfo) {
            return;
        }
        if (!svdInfo.svd || !svdInfo.component) {
            console.info("No svd content or this is not a svd file!");
            return;
        }
        // 特别注意：这些代码是打印在服务端控制台上，不是浏览器F12控制台上！！！
        //console.info("component name:", svdInfo.component);
        //console.info("svd data:", svdInfo.svd);
        componentName = svdInfo.component;
        let svd = JSON.parse(svdInfo.svd);
        walk(user, project, svd);
    });
    let data = {
        user: user,
        project: project,
        svds: svds,
        componentName: componentName
    };
    return toServiceSource(data);
    function walk(user, project, svd) {
        // 只关注eweb的组件，其他组件不关心
        let simplifiedSvd = {
            id: svd.id, selector: svd.selector, inputs: []
        };
        svd.inputs && svd.inputs.forEach(function (input) {
            if (!input.hasOwnProperty('value')) {
                return;
            }
            if (!input.value || !input.value.remote || input.value.remote.type !== 'eweb') {
                return;
            }
            simplifiedSvd.inputs.push({
                property: input.property,
                value: input.value
            });
        });
        if (simplifiedSvd.inputs.length > 0) {
            svds.push(simplifiedSvd);
        }
        svd.children && svd.children.forEach(function (childSVD) {
            walk(user, project, childSVD);
        });
    }
    function toServiceSource(data) {
        let result = [];
        let svds = data.svds;
        let userName = data.user;
        let project = data.project;
        let component = data.componentName;
        svds.forEach(function (info) {
            let inputs = info.inputs;
            let id = info.id;
            inputs.forEach(function (input) {
                let moduleConfig = input.value && input.value.remote ? input.value.remote.script : '';
                console.info("svd value script:", moduleConfig);
                let property = input.property;
                let service = component + "-" + id + "-" + property;
                let code;
                if (property.toLowerCase() == "initmap") {
                    code = initMap(moduleConfig);
                }
                else if (property.toLowerCase() == "cellwindowshow") {
                    code = cellWindowShow(moduleConfig);
                }
                else if (property.toLowerCase() == "loadprojcells" || property.toLowerCase() == "rendercells") {
                    code = createCsv(moduleConfig);
                }
                else if (property.toLowerCase() == "switchoncellheatmap" || property.toLowerCase() == "switchonsiteheatmap") {
                    code = createHeatMapCsv(moduleConfig);
                }
                else {
                    code = genResult(moduleConfig);
                }
                result.push({ service, code });
            });
        });
        return result;
    }
    // function fixSql(sql) {
    //     sql = paramProcessor.translateParamName(sql, 'req.$1');
    //     console.info("plugin.translateParamName:" + sql);
    //     sql = sql.replace(/"/g, '\\"').replace(/\r?\n/g, '" +\n"');
    //     console.info("fixsql replace sql:" + sql);
    //     // sql = plugin.generateSqlScript(sql);
    //     // console.info("plugin.generateSqlScript：" + sql);
    //     let reg = /\breq\.\$event\w*\b/g;
    //     let matchList = sql.match(reg).toString().split(",");
    //     if (matchList.length > 0) {
    //         matchList.forEach(function (value) {
    //             sql = sql.replace(/\./g, '\\.').replace(value, 'req.' + value);
    //             console.info('replaceing sql:', sql)
    //         })
    //     }
    //     console.info("plugin.generateSqlScript：" + sql);
    //     return sql.replace(/\\\./g, ".");
    // }
    function initMap(moduleConfig) {
        let content = "(function() {  \n  return { \n  get: function(req) { \n var para = req; ";
        content = content + " \n var moduleConfig=" + moduleConfig + ";";
        content = content + " \n return {moduleConfig:moduleConfig,\n para:para" + "}";
        content = content + " \n }\n}\n})(); \n ";
        return content;
    }
    function cellWindowShow(moduleConfig) {
        let content = "(function() {  \n  return { \n  get: function(req) { \n var para = req; ";
        content = content + " \n var moduleConfig=" + moduleConfig + ";";
        content = content + " \n return {moduleConfig:moduleConfig,\n para:para" + "}";
        content = content + " \n }\n}\n})(); \n ";
        return content;
    }
    function createCsv(moduleConfig) {
        let content = "(function() {   \n return {  \n get: function(req) { ";
        content = content + " \n var moduleConfig=" + moduleConfig + ";";
        content = content + " \n var sql = genSql(moduleConfig.sql,req);";
        content = content + " \n var data = Data.fetch(sql,1000000); \n var path = '/home/netnumen/ems/ums-server/procs/ppus/webgis.ppu/webgis-web.pmu/webgis.ear/webgis.war/data/celldata/lte/'; ";
        content = content + " \n var now = new Date();";
        content = content + " \n var year = now.getFullYear(); ";
        content = content + " \n var month = now.getMonth() + 1;  ";
        content = content + " \n var day = now.getDate();  ";
        content = content + " \n if(month >= 10) { \n    month=month ";
        content = content + " \n }else{ \n         month = '0' + month          \n }";
        content = content + " \n var nowDate = year+''+month+''+day+(new Date()).getTime();";
        content = content + " \n var fileName= moduleConfig.enFileName+nowDate+'.csv'; \n  var title = moduleConfig.enFileHeader; ";
        content = content + " \n var savaCsvFile = File.saveAsCSV(path + fileName, data, [], {  quoteChar: String.fromCharCode(0) }); ";
        content = content + " \n delete moduleConfig['sql']; ";
        content = content + " \n return {moduleConfig: moduleConfig, \n para:req, \n data:\n{\n file:path+fileName,\n data:[[data.data.length]] \n}" + "\n}";
        content = content + " \n function genSql(sql,para){";
        content = content + " \n var reg = /\\\$\\\{[^\\\}]+\\\}/g;";
        content = content + " \n var sqlScript = sql;";
        content = content + " \n var needReplace = sql.match(reg);";
        content = content + " \n if(needReplace == null){ return sqlScript;}";
        content = content + " \n needReplace = needReplace.toString().split(','); \n needReplace.forEach(function (label){";
        content = content + " \n sqlScript = sqlScript.replace(label,para[label.slice(2,label.length-1)])";
        content = content + " \n })";
        content = content + " \n return sqlScript;";
        content = content + " \n }";
        content = content + " \n }\n}\n})(); \n ";
        return content;
    }
    function createHeatMapCsv(moduleConfig) {
        let content = "(function() {   \n return {  \n get: function(req) { ";
        content = content + " \n var moduleConfig=" + moduleConfig + ";";
        content = content + " \n var sql = genSql(moduleConfig.sql,req);";
        content = content + " \n var projSql = genSql(moduleConfig.projSql,req);";
        content = content + " \n var projData = Data.fetch(projSql,1000000);";
        content = content + " \n var data = Data.fetch(sql,1000000); \n var path = '/home/netnumen/ems/ums-server/procs/ppus/webgis.ppu/webgis-web.pmu/webgis.ear/webgis.war/data/celldata/lte/'; ";
        content = content + " \n var now = new Date();";
        content = content + " \n var year = now.getFullYear(); ";
        content = content + " \n var month = now.getMonth() + 1;  ";
        content = content + " \n var day = now.getDate();  ";
        content = content + " \n if(month >= 10) { \n    month=month ";
        content = content + " \n }else{ \n         month = '0' + month          \n }";
        content = content + " \n var nowDate = year+''+month+''+day+(new Date()).getTime();";
        content = content + " \n var fileName= moduleConfig.enFileName+nowDate+'.csv'; \n  var title = moduleConfig.enFileHeader; ";
        content = content + " \n var projFileName= moduleConfig.projFileName+nowDate+'.csv'; \n  var title = moduleConfig.projFileHeader; ";
        content = content + " \n var savaProjCsvFile = File.saveAsCSV(path + projFileName, data, [], {  quoteChar: String.fromCharCode(0) }); ";
        content = content + " \n var savaCsvFile = File.saveAsCSV(path + fileName, data, [], {  quoteChar: String.fromCharCode(0) }); ";
        content = content + " \n delete moduleConfig['sql']; ";
        content = content + " \n delete moduleConfig['projSql']; ";
        content = content + " \n return {moduleConfig: moduleConfig, \n para:req, \n data:\n{\n file:path+fileName, \n projFile:path+projFileName,\n data:[[data.data.length]] \n}" + "\n}";
        content = content + " \n function genSql(sql,para){";
        content = content + " \n var reg = /\\\$\\\{[^\\\}]+\\\}/g;";
        content = content + " \n var sqlScript = sql;";
        content = content + " \n var needReplace = sql.match(reg);";
        content = content + " \n if(needReplace == null){ return sqlScript;}";
        content = content + " \n needReplace = needReplace.toString().split(','); \n needReplace.forEach(function (label){";
        content = content + " \n sqlScript = sqlScript.replace(label,para[label.slice(2,label.length-1)])";
        content = content + " \n })";
        content = content + " \n return sqlScript;";
        content = content + " \n }";
        content = content + " \n }\n}\n})(); \n ";
        return content;
    }
    function genResult(moduleConfig) {
        let content = "(function() {   \n return {  \n get: function(req) { ";
        content = content + " \n var moduleConfig=" + moduleConfig + ";";
        content = content + " \n var sql = genSql(moduleConfig.sql,req);";
        content = content + " \n var data = Data.fetch(sql,1000000);";
        content = content + " \n delete moduleConfig['sql']; \n delete moduleConfig['db'];";
        content = content + " \n return {moduleConfig: moduleConfig, \n para:req, \n  data:data.data" + "\n}";
        content = content + " \n function genSql(sql,para){";
        content = content + " \n var reg = /\\\$\\\{[^\\\}]+\\\}/g;";
        content = content + " \n var sqlScript = sql;";
        content = content + " \n var needReplace = sql.match(reg);";
        content = content + " \n if(needReplace == null){ return sqlScript;}";
        content = content + " \n needReplace = needReplace.toString().split(','); \n needReplace.forEach(function (label){";
        content = content + " \n sqlScript = sqlScript.replace(label,para[label.slice(2,label.length-1)])";
        content = content + " \n })";
        content = content + " \n return sqlScript;";
        content = content + " \n }";
        content = content + " \n }\n}\n})(); \n ";
        return content;
    }
}


/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PlutoParamRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__angular_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_forkJoin__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_forkJoin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_observable_forkJoin__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__awade_uid_sdk__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__awade_uid_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__awade_uid_sdk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__awade_basics__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pluto_remote_data__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_Observable__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pluto_action__ = __webpack_require__(25);









let PlutoParamRenderer = PlutoParamRenderer_1 = class PlutoParamRenderer extends __WEBPACK_IMPORTED_MODULE_4__awade_uid_sdk__["ServiceConfigBase"] {
    constructor(_http, _popupService, _renderer) {
        super();
        this._http = _http;
        this._popupService = _popupService;
        this._renderer = _renderer;
        this._navigationUrl = "/vReport/reportview/navigation";
        this._$operators = [
            [{ label: '包含', id: 6 }, { label: '不包含', id: 7 }],
            [{ label: '等于', id: 0 }, { label: '不等于', id: 1 }, { label: '大于等于', id: 2 },
                { label: '大于', id: 3 }, { label: '小于等于', id: 4 }, { label: '小于', id: 5 }]
        ];
        this._$scrollbar = { suppressScrollX: true, wheelSpeed: 0.5, wheelPropagation: true, minScrollbarLength: 20 };
        this._$open = false;
        this._$dataTypes = [
            { label: "报表数据", index: 0 },
            { label: "维度数据", index: 1 }
        ];
        this._$treeSetting = {
            data: {
                key: {
                    name: 'name',
                    url: "awadeUrl" // 修改为不存在的url，阻止跳转
                    // isParent: 'mid'
                },
                simpleData: {
                    enable: true,
                    idKey: "oid",
                    pIdKey: "pid"
                }
            },
            async: {
                enable: true,
                type: 'get',
                url: (treeId, node) => {
                    return `${this._navigationUrl}?pid=${node ? node.oid : 0}&userId=${node && node.userId > -1 ? node.userId : 0}`;
                },
                dataFilter: (treeId, parentNode, responseData) => {
                    if (responseData && responseData.data) {
                        responseData.data.forEach(d => {
                            d.isParent = d.mid == '0';
                        });
                        return responseData.data;
                    }
                    return [];
                }
            },
            view: {
                dblClickExpand: false
            },
            callback: {
                onClick: (e, treeId, treeNode) => {
                    this._plutoNodeChange(treeNode);
                }
            }
        };
        // 选中报表的参数列表
        this._$conditions = [];
        this._$timeGrs = [{
                category: '时间粒度',
                items: ['15分钟', '小时', '天']
            }, {
                category: '变量及页面控件',
                items: []
            }];
        this._$columnDefines = [
            {
                target: 0,
                visible: false
            },
            {
                target: 2,
                visible: false
            }
        ];
        this._$additionalColumns = [
            {
                pos: 0,
                width: '15px',
                header: {
                    renderer: __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["TableHeadCheckboxRenderer"],
                },
                cell: {
                    renderer: __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["TableCellCheckboxRenderer"],
                }
            }
        ];
        this._dataReviserStatus = false; //默认表示dataReviser视图关闭
        this._$pluto = new __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["TreeData"]();
        this._$pluto.http = _http;
        this._http.get(this._navigationUrl, {
            params: {
                pid: '0',
                userId: '0'
            }
        }).subscribe((data) => {
            if (data && data.data) {
                data.data.forEach(d => {
                    d.isParent = d.mid == '0';
                });
                this._$pluto.fromObject(data.data);
            }
        });
    }
    ngOnInit() {
        // 对输入属性的使用个，要放在OnInit中，constructor中还未被初始化
        this._$controlList = this.initData.controlList ? this.initData.controlList : [];
        if (__WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["CommonUtils"].isUndefined(this.propertyValue.additional)) {
            this.propertyValue.additional = {
                pluto: { url: '' },
                params: [],
                dataType: this._$dataTypes[0],
                dataReviser: [PlutoParamRenderer_1.dataReviserPluto, PlutoParamRenderer_1.dataReviserDim]
            };
        }
        this._$timeGrs[1].items = this._$controlList;
        this.granularity = this.propertyValue.additional.granularity ? this.propertyValue.additional.granularity : '';
        this._init();
    }
    _$showAddFieldsDialog(fieldsConfigDialog) {
        this._initFieldsTableData().subscribe(queryList => {
            if (queryList) {
                const field = ["name", "des", "extra"];
                const header = ["字段", "字段名称", "extra"];
                this._$dimTableData = new __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["TableData"](queryList.dim, field, header);
                this._$kpiTableData = new __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["TableData"](queryList.kpi, field, header);
                this._fieldsConfigDialogInfo = this._popupService.popup(fieldsConfigDialog, {
                    modal: true,
                    showEffect: __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["PopupEffect"].bubbleIn,
                    hideEffect: __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["PopupEffect"].bubbleOut
                });
            }
        });
    }
    _$fieldsComplete(message) {
        if (message == 'confirm') {
            // 配置完成
            if (!this._setSelectedRows())
                return;
        }
        if (this._fieldsConfigDialogInfo) {
            this._fieldsConfigDialogInfo.dispose();
            this._fieldsConfigDialogInfo = null;
        }
    }
    _initFieldsTableData() {
        if (this._queryList) {
            return __WEBPACK_IMPORTED_MODULE_7_rxjs_Observable__["Observable"].of(this._queryList);
        }
        if (!this.propertyValue.additional.pluto.name) {
            __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["JigsawNotification"].show('请先选择报表，再选择查询字段！', { timeout: 2000 });
            return __WEBPACK_IMPORTED_MODULE_7_rxjs_Observable__["Observable"].of(null);
        }
        const match = this.propertyValue.additional.pluto.url.match(/(.*)\/web\//);
        if (__WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["CommonUtils"].isUndefined(match) || match.length != 2) {
            return __WEBPACK_IMPORTED_MODULE_7_rxjs_Observable__["Observable"].of(null);
        }
        const queryListUrl = `/rdk/service/app/vreport/web/${match[1]}/server/query_list`;
        return this._http.get(queryListUrl, { params: { app: 'vreport' } });
    }
    _setSelectedRows() {
        const selectedDims = this._$dimAdditionalData.data.reduce((selectedRows, item, index) => {
            if (item[0]) {
                selectedRows.push(this._$dimAdditionalData.originData.data[index][0]);
            }
            return selectedRows;
        }, []);
        const selectedKpis = this._$kpiAdditionalData.data.reduce((selectedRows, item, index) => {
            if (item[0]) {
                selectedRows.push(this._$kpiAdditionalData.originData.data[index][0]);
            }
            return selectedRows;
        }, []);
        if (selectedDims.length + selectedKpis.length > 50) {
            __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["JigsawNotification"].show('最多选择50个，请重新选择！', { timeout: 2000 });
            return false;
        }
        if ((selectedDims.length > 0 && selectedKpis.length == 0) || (selectedDims.length == 0 && selectedKpis.length > 0)) {
            __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["JigsawNotification"].show('查询字段必须同时包含维度和指标！', { timeout: 2000 });
            return false;
        }
        this.propertyValue.additional.selectedFields = selectedDims.concat(selectedKpis);
        return true;
    }
    // 报表改变
    _plutoNodeChange(treeNode) {
        this._selectedNode = treeNode;
        if (treeNode.isParent) {
            this.treeExt.ztree.expandNode(treeNode);
            return;
        }
        // 叶子节点触发改变
        this.propertyValue.additional.pluto.name = treeNode.name;
        this.propertyValue.additional.pluto.url = treeNode.url;
        this.propertyValue.additional.params = [];
        this._$open = false;
        this._init();
    }
    _init() {
        // 获取参数列表和操作符列表
        if (__WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["CommonUtils"].isUndefined(this.propertyValue.additional.pluto.url)) {
            return;
        }
        // url = "rpt_home/custom_190105152441081_277294/web/report.html";
        const match = this.propertyValue.additional.pluto.url.match(/(.*)\/web\//);
        if (__WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["CommonUtils"].isUndefined(match) || match.length != 2) {
            return;
        }
        const metadataUrl = `/rdk/app/vreport/web/${match[1]}/server/metadata.js`;
        const queryListUrl = `/rdk/service/app/vreport/web/${match[1]}/server/query_list`;
        Object(__WEBPACK_IMPORTED_MODULE_3_rxjs_observable_forkJoin__["forkJoin"])(this._http.get(metadataUrl, { responseType: "text" }), this._http.get(queryListUrl, { params: { app: 'vreport' } })).subscribe((results) => {
            const [metadata, queryList] = results;
            try {
                this._metadata = eval(metadata.replace(/\s*var\s*\w*\s*=\s*require\(\S*\);/g, ''));
                this._queryList = queryList;
                this._$conditions = this._metadata.FILTER_GROUP.filters[0].fields.map(field => {
                    if (queryList.hasOwnProperty('dim')) {
                        const dim = Object.getOwnPropertyDescriptor(queryList, 'dim').value.find(dim => dim[0] == field.id);
                        if (dim) {
                            field.label = dim[1];
                        }
                    }
                    if (queryList.hasOwnProperty('kpi')) {
                        const dim = Object.getOwnPropertyDescriptor(queryList, 'kpi').value.find(dim => dim[0] == field.id);
                        if (dim) {
                            field.label = dim[1];
                        }
                    }
                    return field;
                }).filter(item => __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["CommonUtils"].isDefined(item.label) && item.label != '');
            }
            catch (e) {
                console.error('init metadata content error! detail: ', e);
            }
        });
    }
    _$paramChange(param) {
        const dim = this._metadata.DIM[param.id];
        let currentParam = this.propertyValue.additional.params.find(p => (p.id == param.id) || (p.id && p.id.id == param.id));
        if (__WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["CommonUtils"].isUndefined(currentParam))
            return;
        const field = this._metadata.FILTER_GROUP.filters[0].fields.find(field => field.id == param.id);
        currentParam.defaultValue = field.defaultValue;
        if (__WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["CommonUtils"].isDefined(dim) && (__WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["CommonUtils"].isDefined(dim.translate.table) && dim.translate.table != '')) {
            currentParam.operators = 0;
            currentParam.operator = this._$operators[0][field.operator];
        }
        else {
            currentParam.operators = 1;
            currentParam.operator = this._$operators[1][field.operator];
        }
    }
    // 添加一个参数
    _$handleAddParam() {
        if (!this.propertyValue.additional.pluto.name) {
            __WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["JigsawNotification"].show('请先选择报表，再增加参数！', { timeout: 2000 });
            return;
        }
        this.propertyValue.additional.params.push({
            id: '',
            operator: '',
            defaultValue: ''
        });
    }
    // 删除一个参数
    _$deleteParam(index) {
        this.propertyValue.additional.params.splice(index, 1);
    }
    //点击数据加工按钮显示dataReviser配置视图
    _$showDataReviserModal(el) {
        this._dataReviserStatus = !this._dataReviserStatus;
        let offsetHeight = 450;
        if (this._$selectedIndex == 0) {
            offsetHeight = this._plutoConfigModal.nativeElement.offsetHeight;
        }
        if (this._$selectedIndex == 1) {
            offsetHeight = this._dimConfigModal.nativeElement.offsetHeight;
        }
        let parentHeight = (offsetHeight - 1) + 'px';
        if (this._dataReviserStatus) {
            this._renderer.setStyle(el, 'height', parentHeight);
        }
        else {
            this._renderer.setStyle(el, 'height', '0px');
        }
    }
    /****************************getters and setters start**************************************/
    get pluto() {
        if (this.propertyValue.additional && this.propertyValue.additional.pluto) {
            return this.propertyValue.additional.pluto.name;
        }
        return '';
    }
    getParams() {
        return this.propertyValue.additional ? this.propertyValue.additional.params : [];
    }
    get dataType() {
        if (__WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["CommonUtils"].isUndefined(this.propertyValue.additional)) {
            this.propertyValue.additional.dataType = this._$dataTypes[0];
        }
        this._$selectedIndex = this.propertyValue.additional.dataType.index;
        return this.propertyValue.additional.dataType;
    }
    set dataType(value) {
        this.propertyValue.additional.dataType = value[0];
        this._$selectedIndex = this.propertyValue.additional.dataType.index;
    }
    get fields() {
        return this.propertyValue.additional ? this.propertyValue.additional.fields : '';
    }
    set fields(value) {
        this.propertyValue.additional.fields = value;
    }
    get id() {
        return this.propertyValue.additional ? this.propertyValue.additional.id : '';
    }
    set id(value) {
        this.propertyValue.additional.id = value;
    }
    get linkFieldValue() {
        return this.propertyValue.additional ? this.propertyValue.additional.linkFieldValue : '';
    }
    set linkFieldValue(value) {
        this.propertyValue.additional.linkFieldValue = value;
    }
    get granularity() {
        return this.propertyValue.additional ? this.propertyValue.additional.granularity : '';
    }
    set granularity(value) {
        this.propertyValue.additional.granularity = value;
    }
    get rangeTime() {
        return this.propertyValue.additional ? this.propertyValue.additional.rangeTime : '';
    }
    set rangeTime(value) {
        this.propertyValue.additional.rangeTime = value;
    }
    get topN() {
        if (this.propertyValue.additional && this.propertyValue.additional.topN) {
            return this.propertyValue.additional.topN;
        }
        this.topN = '';
        return this.propertyValue.additional.topN;
    }
    set topN(value) {
        this.propertyValue.additional.topN = value;
    }
    get dataReviser() {
        if (__WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["CommonUtils"].isUndefined(this.propertyValue.additional.dataReviser)) {
            this.propertyValue.additional.dataReviser = [PlutoParamRenderer_1.dataReviserPluto, PlutoParamRenderer_1.dataReviserDim];
        }
        return this.propertyValue.additional.dataReviser[this._$selectedIndex];
    }
    set dataReviser(value) {
        this.propertyValue.additional.dataReviser[this._$selectedIndex] = value;
    }
};
PlutoParamRenderer.dataReviserPluto = `
result => {
    // 在这里处理返回的数据
    if(result) {
        if (result.result) {
            return JSON.parse(result.result);
        }
      	return result;
    }
    return {data: [], field: [], header: []};
}`;
PlutoParamRenderer.dataReviserDim = `
result => {
    // 把你的处理逻辑放在这里
    if(result && result.data) {
        const temp = result.data.map(item => {
            return {label: item[1], id: item[0]};
        }).filter(item => item.label != "unknown");
        return temp;
    }
    return [];
}`;
__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_2__rdkmaster_jigsaw__["JigsawTreeExt"])
], PlutoParamRenderer.prototype, "treeExt", void 0);
__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["ViewChild"])('plutoConfigModal')
], PlutoParamRenderer.prototype, "_plutoConfigModal", void 0);
__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["ViewChild"])('dimConfigModal')
], PlutoParamRenderer.prototype, "_dimConfigModal", void 0);
PlutoParamRenderer = PlutoParamRenderer_1 = __WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'pluto-service',
        // template&style只能采用inline方式开发
        template: `
        <div class="data-type">
            <jigsaw-button-bar [data]="_$dataTypes" (selectedItemsChange)="_$selectedIndex = $event[0].index" [(selectedItems)]="dataType"></jigsaw-button-bar>

            <jigsaw-button (click)="_$showDataReviserModal(dataReviserModal)">数据加工</jigsaw-button>

            <div *ngIf="_$selectedIndex == 0" class="pluto-select">
                <label>选择报表</label>
                <j-combo-select [(value)]="pluto" width="300" [autoClose]="true" [(open)]="_$open">
                    <ng-template>
                        <div class="pluto-tree" [perfectScrollbar]="_$scrollbar">
                            <jigsaw-tree-ext [(data)]="_$pluto" [(setting)]="_$treeSetting"></jigsaw-tree-ext>
                        </div>
                    </ng-template>
                </j-combo-select>

                <jigsaw-button style="margin-left: 10px;" (click)="_$showAddFieldsDialog(fieldsConfigDialog)">选择查询字段</jigsaw-button>
                <jigsaw-button style="margin-left: 10px;" (click)="_$handleAddParam()">新增参数</jigsaw-button>
            </div>
        </div>

        <div *ngIf="_$selectedIndex == 0" #plutoConfigModal style="height: calc(90vh - 430px);">
            <div class="pluto-times">

                <label>时间粒度</label>
                <jigsaw-auto-complete-input width="220" [(value)]="granularity" [data]="_$timeGrs"></jigsaw-auto-complete-input>

                <label style="margin-left: 10px;">时间</label>
                <jigsaw-auto-complete-input width="220" [(value)]="rangeTime" [data]="_$controlList"></jigsaw-auto-complete-input>

                <label style="margin-left: 10px;">TopN</label>
                <jigsaw-auto-complete-input width="220" [(value)]="topN" [data]="_$controlList"></jigsaw-auto-complete-input>

            </div>

            <div class="pluto-param">
                <div class="bottom-border">
                    <label style="width: 25%">参数</label>
                    <label style="width: 15%">操作符</label>
                    <label style="width: 40%">值</label>
                </div>

                <div class="param-box" [perfectScrollbar]="_$scrollbar">
                    <div class="param" *ngFor="let param of getParams(); let i = index;">
                        <jigsaw-select width="25%" [(value)]="param.id" placeholder="选择参数" [data]="_$conditions" trackItemBy="id"
                                       (valueChange)="_$paramChange(param.id)"></jigsaw-select>
                        <jigsaw-select width="15%" [(value)]="param.operator" placeholder="选择操作符" [data]="_$operators[param.operators]"
                                       trackItemBy="id"></jigsaw-select>
                        <jigsaw-auto-complete-input width="30%" [(value)]="param.defaultValue" [data]="_$controlList"></jigsaw-auto-complete-input>
                        <a (click)="_$deleteParam(i)"><i class="fa fa-trash-o"></i></a>
                    </div>
                </div>
            </div>
        </div>

        <div *ngIf="_$selectedIndex == 1" #dimConfigModal style="height: calc(90vh - 430px);">
            <div class="box">
                <label>关联参数</label><span>维度数据的关联字段(比如查询市的时候，可以通过这个参数指定某个省)</span>
                <jigsaw-auto-complete-input width="100%" [(value)]="linkFieldValue" [data]="_$controlList"></jigsaw-auto-complete-input>
            </div>
            <div class="box">
                <label>ID</label>
                <jigsaw-input width="100%" [(value)]="id" placeholder="维度id"></jigsaw-input>
            </div>
            <div class="box">
                <label>字段</label>
                <jigsaw-input width="100%" [(value)]="fields" placeholder="维度字段"></jigsaw-input>
            </div>
        </div>

        <ng-template #fieldsConfigDialog>
            <jigsaw-dialog class="select-fields" width="800" (close)="_$fieldsComplete()" caption="选择查询字段">
                <div class="fields-body" jigsaw-body>
                    <div style="margin-right: 5px;">
                        <label>维度列表</label>
                        <jigsaw-table #tableComponent maxHeight="350" trackRowBy="name"
                                      [data]="_$dimTableData" [columnDefines]="_$columnDefines"
                                      [additionalColumnDefines]="_$additionalColumns"
                                      [(additionalData)]="_$dimAdditionalData"></jigsaw-table>
                    </div>
                    <div style="margin-left: 5px;">
                        <label>指标列表</label>
                        <jigsaw-table #tableComponent maxHeight="350" trackRowBy="name"
                                      [data]="_$kpiTableData" [columnDefines]="_$columnDefines"
                                      [additionalColumnDefines]="_$additionalColumns"
                                      [(additionalData)]="_$kpiAdditionalData"></jigsaw-table>
                    </div>
                </div>
                <div class="fields-btn" jigsaw-button-bar>
                    <jigsaw-button (click)="_$fieldsComplete()">取消</jigsaw-button>
                    <jigsaw-button colorType="primary" (click)="_$fieldsComplete('confirm')">完成</jigsaw-button>
                </div>
            </jigsaw-dialog>
        </ng-template>

        <div class="data-reviser-box" #dataReviserModal>
            <div class="content-code">
                <uid-code #stubCodeMirror language="js" [(code)]="dataReviser" width="100%" height="100%"></uid-code>
            </div>
        </div>
    `,
        styles: [`
        .data-type {
            margin-bottom: 10px;
        }

        .pluto-select {
            margin-bottom: 10px;
            padding-left: 20px;
            display: inline-block;
        }

        .pluto-tree {
            background-color: white;
            max-height: calc(90vh - 435px)
        }

        .pluto-times {
            margin-bottom: 10px;
        }

        .pluto-param .param-box {
            overflow: auto;
            max-height: calc(90vh - 500px);
        }
        .pluto-param .param-box .param {
            width: 100%;
            margin-top: 5px;
        }
        .pluto-param .param-box .param a {
            color: #333;
            font-size: 18px;
        }

        .bottom-border {
            border-bottom: 1px solid #dcdcdc;
        }

        .box {
            margin-bottom: 10px;
        }
        .box span{
            font-size: 12px;
            margin: 0 10px;
            color: #999;
        }

        .select-fields .fields-body {
            padding: 10px;
            display: flex;
        }
        .select-fields .fields-btn {
            width: 100%;
            border-top: 1px solid #dcdcdc;
        }

        .data-reviser-box {
            position: absolute;
            top: 225px;
            left: 0;
            width: 100%;
            height: 0px;
            background-color: #fff;
            color: #999;
            overflow: hidden;
            transition: height 1s;
            z-index: 5;
        }
        .data-reviser-box .content-code{
            padding: 0px 18px;
            height: 100%;
        }
    `]
    })
], PlutoParamRenderer);

if (__WEBPACK_IMPORTED_MODULE_5__awade_basics__["util"].isInBrowser && window['awade'] && window['awade'].services) {
    window['awade'].services.push({
        label: 'Pluto',
        name: 'Pluto',
        remoteData: __WEBPACK_IMPORTED_MODULE_6__pluto_remote_data__["a" /* PlutoRemoteData */],
        renderer: PlutoParamRenderer
    });
}
if (__WEBPACK_IMPORTED_MODULE_5__awade_basics__["util"].isInBrowser && window['awade'] && window['awade'].actions) {
    window['awade'].actions.push({
        name: 'Pluto',
        category: '事件与数据',
        action: __WEBPACK_IMPORTED_MODULE_8__pluto_action__["a" /* PlutoAction */],
        renderer: PlutoParamRenderer
    });
}
var PlutoParamRenderer_1;


/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports = require("@angular/core");

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ForkJoinObservable_1 = __webpack_require__(98);
exports.forkJoin = ForkJoinObservable_1.ForkJoinObservable.create;
//# sourceMappingURL=forkJoin.js.map

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__(8);
var EmptyObservable_1 = __webpack_require__(105);
var isArray_1 = __webpack_require__(19);
var subscribeToResult_1 = __webpack_require__(106);
var OuterSubscriber_1 = __webpack_require__(111);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ForkJoinObservable = (function (_super) {
    __extends(ForkJoinObservable, _super);
    function ForkJoinObservable(sources, resultSelector) {
        _super.call(this);
        this.sources = sources;
        this.resultSelector = resultSelector;
    }
    /* tslint:enable:max-line-length */
    /**
     * Joins last values emitted by passed Observables.
     *
     * <span class="informal">Wait for Observables to complete and then combine last values they emitted.</span>
     *
     * <img src="./img/forkJoin.png" width="100%">
     *
     * `forkJoin` is an operator that takes any number of Observables which can be passed either as an array
     * or directly as arguments. If no input Observables are provided, resulting stream will complete
     * immediately.
     *
     * `forkJoin` will wait for all passed Observables to complete and then it will emit an array with last
     * values from corresponding Observables. So if you pass `n` Observables to the operator, resulting
     * array will have `n` values, where first value is the last thing emitted by the first Observable,
     * second value is the last thing emitted by the second Observable and so on. That means `forkJoin` will
     * not emit more than once and it will complete after that. If you need to emit combined values not only
     * at the end of lifecycle of passed Observables, but also throughout it, try out {@link combineLatest}
     * or {@link zip} instead.
     *
     * In order for resulting array to have the same length as the number of input Observables, whenever any of
     * that Observables completes without emitting any value, `forkJoin` will complete at that moment as well
     * and it will not emit anything either, even if it already has some last values from other Observables.
     * Conversely, if there is an Observable that never completes, `forkJoin` will never complete as well,
     * unless at any point some other Observable completes without emitting value, which brings us back to
     * the previous case. Overall, in order for `forkJoin` to emit a value, all Observables passed as arguments
     * have to emit something at least once and complete.
     *
     * If any input Observable errors at some point, `forkJoin` will error as well and all other Observables
     * will be immediately unsubscribed.
     *
     * Optionally `forkJoin` accepts project function, that will be called with values which normally
     * would land in emitted array. Whatever is returned by project function, will appear in output
     * Observable instead. This means that default project can be thought of as a function that takes
     * all its arguments and puts them into an array. Note that project function will be called only
     * when output Observable is supposed to emit a result.
     *
     * @example <caption>Use forkJoin with operator emitting immediately</caption>
     * const observable = Rx.Observable.forkJoin(
     *   Rx.Observable.of(1, 2, 3, 4),
     *   Rx.Observable.of(5, 6, 7, 8)
     * );
     * observable.subscribe(
     *   value => console.log(value),
     *   err => {},
     *   () => console.log('This is how it ends!')
     * );
     *
     * // Logs:
     * // [4, 8]
     * // "This is how it ends!"
     *
     *
     * @example <caption>Use forkJoin with operator emitting after some time</caption>
     * const observable = Rx.Observable.forkJoin(
     *   Rx.Observable.interval(1000).take(3), // emit 0, 1, 2 every second and complete
     *   Rx.Observable.interval(500).take(4) // emit 0, 1, 2, 3 every half a second and complete
     * );
     * observable.subscribe(
     *   value => console.log(value),
     *   err => {},
     *   () => console.log('This is how it ends!')
     * );
     *
     * // Logs:
     * // [2, 3] after 3 seconds
     * // "This is how it ends!" immediately after
     *
     *
     * @example <caption>Use forkJoin with project function</caption>
     * const observable = Rx.Observable.forkJoin(
     *   Rx.Observable.interval(1000).take(3), // emit 0, 1, 2 every second and complete
     *   Rx.Observable.interval(500).take(4), // emit 0, 1, 2, 3 every half a second and complete
     *   (n, m) => n + m
     * );
     * observable.subscribe(
     *   value => console.log(value),
     *   err => {},
     *   () => console.log('This is how it ends!')
     * );
     *
     * // Logs:
     * // 5 after 3 seconds
     * // "This is how it ends!" immediately after
     *
     * @see {@link combineLatest}
     * @see {@link zip}
     *
     * @param {...SubscribableOrPromise} sources Any number of Observables provided either as an array or as an arguments
     * passed directly to the operator.
     * @param {function} [project] Function that takes values emitted by input Observables and returns value
     * that will appear in resulting Observable instead of default array.
     * @return {Observable} Observable emitting either an array of last values emitted by passed Observables
     * or value from project function.
     * @static true
     * @name forkJoin
     * @owner Observable
     */
    ForkJoinObservable.create = function () {
        var sources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i - 0] = arguments[_i];
        }
        if (sources === null || arguments.length === 0) {
            return new EmptyObservable_1.EmptyObservable();
        }
        var resultSelector = null;
        if (typeof sources[sources.length - 1] === 'function') {
            resultSelector = sources.pop();
        }
        // if the first and only other argument besides the resultSelector is an array
        // assume it's been called with `forkJoin([obs1, obs2, obs3], resultSelector)`
        if (sources.length === 1 && isArray_1.isArray(sources[0])) {
            sources = sources[0];
        }
        if (sources.length === 0) {
            return new EmptyObservable_1.EmptyObservable();
        }
        return new ForkJoinObservable(sources, resultSelector);
    };
    /** @deprecated internal use only */ ForkJoinObservable.prototype._subscribe = function (subscriber) {
        return new ForkJoinSubscriber(subscriber, this.sources, this.resultSelector);
    };
    return ForkJoinObservable;
}(Observable_1.Observable));
exports.ForkJoinObservable = ForkJoinObservable;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ForkJoinSubscriber = (function (_super) {
    __extends(ForkJoinSubscriber, _super);
    function ForkJoinSubscriber(destination, sources, resultSelector) {
        _super.call(this, destination);
        this.sources = sources;
        this.resultSelector = resultSelector;
        this.completed = 0;
        this.haveValues = 0;
        var len = sources.length;
        this.total = len;
        this.values = new Array(len);
        for (var i = 0; i < len; i++) {
            var source = sources[i];
            var innerSubscription = subscribeToResult_1.subscribeToResult(this, source, null, i);
            if (innerSubscription) {
                innerSubscription.outerIndex = i;
                this.add(innerSubscription);
            }
        }
    }
    ForkJoinSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        if (!innerSub._hasValue) {
            innerSub._hasValue = true;
            this.haveValues++;
        }
    };
    ForkJoinSubscriber.prototype.notifyComplete = function (innerSub) {
        var destination = this.destination;
        var _a = this, haveValues = _a.haveValues, resultSelector = _a.resultSelector, values = _a.values;
        var len = values.length;
        if (!innerSub._hasValue) {
            destination.complete();
            return;
        }
        this.completed++;
        if (this.completed !== len) {
            return;
        }
        if (haveValues === len) {
            var value = resultSelector ? resultSelector.apply(this, values) : values;
            destination.next(value);
        }
        destination.complete();
    };
    return ForkJoinSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=ForkJoinObservable.js.map

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Subscriber_1 = __webpack_require__(13);
var rxSubscriber_1 = __webpack_require__(23);
var Observer_1 = __webpack_require__(22);
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber_1.rxSubscriber]) {
            return nextOrObserver[rxSubscriber_1.rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber(Observer_1.empty);
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
exports.toSubscriber = toSubscriber;
//# sourceMappingURL=toSubscriber.js.map

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isArray_1 = __webpack_require__(19);
var isObject_1 = __webpack_require__(20);
var isFunction_1 = __webpack_require__(18);
var tryCatch_1 = __webpack_require__(101);
var errorObject_1 = __webpack_require__(21);
var UnsubscriptionError_1 = __webpack_require__(102);
/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
var Subscription = (function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [errorObject_1.errorObject.e]);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        }
        else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
exports.Subscription = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}
//# sourceMappingURL=Subscription.js.map

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var errorObject_1 = __webpack_require__(21);
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject_1.errorObject.e = e;
        return errorObject_1.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;
;
//# sourceMappingURL=tryCatch.js.map

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = (function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this);
        this.errors = errors;
        var err = Error.call(this, errors ?
            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n  ') : '');
        this.name = err.name = 'UnsubscriptionError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return UnsubscriptionError;
}(Error));
exports.UnsubscriptionError = UnsubscriptionError;
//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var noop_1 = __webpack_require__(104);
/* tslint:enable:max-line-length */
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i - 0] = arguments[_i];
    }
    return pipeFromArray(fns);
}
exports.pipe = pipe;
/* @internal */
function pipeFromArray(fns) {
    if (!fns) {
        return noop_1.noop;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}
exports.pipeFromArray = pipeFromArray;
//# sourceMappingURL=pipe.js.map

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-empty */
function noop() { }
exports.noop = noop;
//# sourceMappingURL=noop.js.map

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__(8);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var EmptyObservable = (function (_super) {
    __extends(EmptyObservable, _super);
    function EmptyObservable(scheduler) {
        _super.call(this);
        this.scheduler = scheduler;
    }
    /**
     * Creates an Observable that emits no items to the Observer and immediately
     * emits a complete notification.
     *
     * <span class="informal">Just emits 'complete', and nothing else.
     * </span>
     *
     * <img src="./img/empty.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the complete notification. It can be used for composing with other
     * Observables, such as in a {@link mergeMap}.
     *
     * @example <caption>Emit the number 7, then complete.</caption>
     * var result = Rx.Observable.empty().startWith(7);
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
     * var interval = Rx.Observable.interval(1000);
     * var result = interval.mergeMap(x =>
     *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
     * );
     * result.subscribe(x => console.log(x));
     *
     * // Results in the following to the console:
     * // x is equal to the count on the interval eg(0,1,2,3,...)
     * // x will occur every 1000ms
     * // if x % 2 is equal to 1 print abc
     * // if x % 2 is not equal to 1 nothing will be output
     *
     * @see {@link create}
     * @see {@link never}
     * @see {@link of}
     * @see {@link throw}
     *
     * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
     * the emission of the complete notification.
     * @return {Observable} An "empty" Observable: emits only the complete
     * notification.
     * @static true
     * @name empty
     * @owner Observable
     */
    EmptyObservable.create = function (scheduler) {
        return new EmptyObservable(scheduler);
    };
    EmptyObservable.dispatch = function (arg) {
        var subscriber = arg.subscriber;
        subscriber.complete();
    };
    /** @deprecated internal use only */ EmptyObservable.prototype._subscribe = function (subscriber) {
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
        }
        else {
            subscriber.complete();
        }
    };
    return EmptyObservable;
}(Observable_1.Observable));
exports.EmptyObservable = EmptyObservable;
//# sourceMappingURL=EmptyObservable.js.map

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(3);
var isArrayLike_1 = __webpack_require__(107);
var isPromise_1 = __webpack_require__(108);
var isObject_1 = __webpack_require__(20);
var Observable_1 = __webpack_require__(8);
var iterator_1 = __webpack_require__(109);
var InnerSubscriber_1 = __webpack_require__(110);
var observable_1 = __webpack_require__(24);
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    if (destination.closed) {
        return null;
    }
    if (result instanceof Observable_1.Observable) {
        if (result._isScalar) {
            destination.next(result.value);
            destination.complete();
            return null;
        }
        else {
            destination.syncErrorThrowable = true;
            return result.subscribe(destination);
        }
    }
    else if (isArrayLike_1.isArrayLike(result)) {
        for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
            destination.next(result[i]);
        }
        if (!destination.closed) {
            destination.complete();
        }
    }
    else if (isPromise_1.isPromise(result)) {
        result.then(function (value) {
            if (!destination.closed) {
                destination.next(value);
                destination.complete();
            }
        }, function (err) { return destination.error(err); })
            .then(null, function (err) {
            // Escaping the Promise trap: globally throw unhandled errors
            root_1.root.setTimeout(function () { throw err; });
        });
        return destination;
    }
    else if (result && typeof result[iterator_1.iterator] === 'function') {
        var iterator = result[iterator_1.iterator]();
        do {
            var item = iterator.next();
            if (item.done) {
                destination.complete();
                break;
            }
            destination.next(item.value);
            if (destination.closed) {
                break;
            }
        } while (true);
    }
    else if (result && typeof result[observable_1.observable] === 'function') {
        var obs = result[observable_1.observable]();
        if (typeof obs.subscribe !== 'function') {
            destination.error(new TypeError('Provided object does not correctly implement Symbol.observable'));
        }
        else {
            return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
        }
    }
    else {
        var value = isObject_1.isObject(result) ? 'an invalid object' : "'" + result + "'";
        var msg = ("You provided " + value + " where a stream was expected.")
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        destination.error(new TypeError(msg));
    }
    return null;
}
exports.subscribeToResult = subscribeToResult;
//# sourceMappingURL=subscribeToResult.js.map

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.isArrayLike = (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArrayLike.js.map

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isPromise(value) {
    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
exports.isPromise = isPromise;
//# sourceMappingURL=isPromise.js.map

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(3);
function symbolIteratorPonyfill(root) {
    var Symbol = root.Symbol;
    if (typeof Symbol === 'function') {
        if (!Symbol.iterator) {
            Symbol.iterator = Symbol('iterator polyfill');
        }
        return Symbol.iterator;
    }
    else {
        // [for Mozilla Gecko 27-35:](https://mzl.la/2ewE1zC)
        var Set_1 = root.Set;
        if (Set_1 && typeof new Set_1()['@@iterator'] === 'function') {
            return '@@iterator';
        }
        var Map_1 = root.Map;
        // required for compatability with es6-shim
        if (Map_1) {
            var keys = Object.getOwnPropertyNames(Map_1.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                // according to spec, Map.prototype[@@iterator] and Map.orototype.entries must be equal.
                if (key !== 'entries' && key !== 'size' && Map_1.prototype[key] === Map_1.prototype['entries']) {
                    return key;
                }
            }
        }
        return '@@iterator';
    }
}
exports.symbolIteratorPonyfill = symbolIteratorPonyfill;
exports.iterator = symbolIteratorPonyfill(root_1.root);
/**
 * @deprecated use iterator instead
 */
exports.$$iterator = exports.iterator;
//# sourceMappingURL=iterator.js.map

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = __webpack_require__(13);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerSubscriber = (function (_super) {
    __extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        _super.call(this);
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(Subscriber_1.Subscriber));
exports.InnerSubscriber = InnerSubscriber;
//# sourceMappingURL=InnerSubscriber.js.map

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = __webpack_require__(13);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var OuterSubscriber = (function (_super) {
    __extends(OuterSubscriber, _super);
    function OuterSubscriber() {
        _super.apply(this, arguments);
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(Subscriber_1.Subscriber));
exports.OuterSubscriber = OuterSubscriber;
//# sourceMappingURL=OuterSubscriber.js.map

/***/ }),
/* 112 */
/***/ (function(module, exports) {

module.exports = "\n\n(function() {\n    var Console = require('$svr/utils/log.js');\n\n    return {\n        get: function(req, $script, $header, $reqHeader) {\n            var console = new Console($reqHeader);\n\n            /*/ will-be-replaced-by-get-service-code /*/\n\n            return \"提示：在UI设计器上编写Rest服务的逻辑时，必须使用return关键字返回一笔数据给页面！\";\n\n        },\n\n        post: function(req, $script, $header, $reqHeader) {\n            var console = new Console($reqHeader);\n\n            /*/ will-be-replaced-by-post-service-code /*/\n\n            return \"提示：在UI设计器上编写Rest服务的逻辑时，必须使用return关键字返回一笔数据给页面！\";\n\n        },\n\n        put: function(req, $script, $header, $reqHeader) {\n            var console = new Console($reqHeader);\n\n            /*/ will-be-replaced-by-put-service-code /*/\n\n            return \"提示：在UI设计器上编写Rest服务的逻辑时，必须使用return关键字返回一笔数据给页面！\";\n\n        },\n\n        delete: function(req, $script, $header, $reqHeader) {\n            var console = new Console($reqHeader);\n\n            /*/ will-be-replaced-by-delete-service-code /*/\n\n            return \"提示：在UI设计器上编写Rest服务的逻辑时，必须使用return关键字返回一笔数据给页面！\";\n\n        }\n    }\n\n})();\n"

/***/ }),
/* 113 */
/***/ (function(module, exports) {

module.exports = "\r\n(function() {\r\n    var Console = require('$svr/utils/log.js');\r\n\r\n    return {\r\n        post: function(req, $script, $header, $reqHeader) {\r\n            var console = new Console($reqHeader);\r\n\r\n            /*/ will-be-replaced-by-service-code /*/\r\n\r\n            return \"提示：在UI设计器上编写Rest服务的逻辑时，必须使用return关键字返回一笔数据给页面！\";\r\n\r\n        }\r\n    }\r\n\r\n})();\r\n"

/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = create;
/* harmony export (immutable) */ __webpack_exports__["c"] = exportCode;
/* harmony export (immutable) */ __webpack_exports__["a"] = clearCode;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__server_utils_limited_shell__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__awade_basics__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__awade_basics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__awade_basics__);



const shelljs = Object(__WEBPACK_IMPORTED_MODULE_1__server_utils_limited_shell__["b" /* nodeRequire */])('shelljs');
const os = Object(__WEBPACK_IMPORTED_MODULE_1__server_utils_limited_shell__["b" /* nodeRequire */])('os');
function create(user, project, inputPath, desc) {
    console.log('------------start create a tmp project------------');
    inputPath = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["d" /* fixPath */])(inputPath);
    let setupEnvResult = setupEnvironment(user, project, desc);
    if (!setupEnvResult) {
        console.log('set up app environment error!');
        return false;
    }
    let unzipResult = unzipInput(inputPath);
    if (!unzipResult) {
        console.log('unzip input file error!');
        return false;
    }
    inputPath = typeof unzipResult == 'string' ? unzipResult : inputPath;
    let genSavingsResult = generateSavings(user, project, inputPath);
    if (genSavingsResult) {
        if (typeof unzipResult == 'string') {
            shelljs.rm('-Rf', unzipResult.slice(0, unzipResult.indexOf('/app/*/source')));
        }
        console.log('------------create tmp project success!------------');
        return true;
    }
    else {
        console.log('create savings error!');
        console.log('------------create tmp project error!------------');
        return false;
    }
}
function exportCode(user, project, output, argvForNg) {
    let projDataPath = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["r" /* toSavingPath */])(user, project + "/histories");
    let cursor = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["e" /* getCursor */])(projDataPath);
    const exportShell = 'app/ui-designer/services/project-export-scripts/export.sh';
    const timestamp = new Date().getTime();
    const result = Object(__WEBPACK_IMPORTED_MODULE_1__server_utils_limited_shell__["a" /* limitedShell */])(`sh ${exportShell} ${projDataPath}/${cursor} ${timestamp} ${project} ${user} ${argvForNg}`).code;
    if (result != 0)
        return false;
    let filePath = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["q" /* toPublishPath */])(user, project + `/${user}-${project}-${timestamp}.zip`);
    return Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["n" /* moveFile */])(filePath, output) ? (!!output.match(/\.zip$/) ? output : `${output}/${user}-${project}-${timestamp}.zip`) : false;
}
function clearCode(user, project) {
    let savingPath = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["r" /* toSavingPath */])(user, project);
    let publishPath = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["q" /* toPublishPath */])(user, project);
    shelljs.rm('-rf', savingPath);
    shelljs.rm('-rf', publishPath);
}
function setupEnvironment(user, project, desc) {
    let webDir = 'app/ui-designer/pub/' + user + '/' + project + '/web';
    let cpWebResult = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["a" /* copyDir */])('app/ui-designer/compiler/project-seed/web', webDir);
    let pwd = __WEBPACK_IMPORTED_MODULE_2__awade_basics__["util"].isInRDK ? Java.type('java.lang.System').getProperty('user.dir') : shelljs.pwd();
    let lnSource = pwd + '/app/ui-designer/compiler/project-seed/dependencies/node_modules';
    let lnTarget = webDir + '/node_modules';
    let lnResult = Object(__WEBPACK_IMPORTED_MODULE_1__server_utils_limited_shell__["a" /* limitedShell */])(`ln -s ${lnSource} ${lnTarget}`);
    let indexResult = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["t" /* updateAppPageTitle */])(user, project, desc);
    console.info("cpWebResult:" + cpWebResult + ', lnResult:' + lnResult);
    const version = JSON.parse(Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])('app/ui-designer/web/package.json')).version;
    let packagePath = webDir + '/package.json';
    let projectInfo = JSON.parse(Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["o" /* readString */])(packagePath));
    projectInfo.version = version;
    Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(packagePath, JSON.stringify(projectInfo, null, '  '));
    return cpWebResult && lnResult.code == 0 && indexResult;
}
function generateSavings(user, project, inputPath) {
    const historyPath = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["r" /* toSavingPath */])(user, project) + '/histories';
    const projInitPath = historyPath + '/1';
    let cpSvdResult = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["a" /* copyDir */])(inputPath, projInitPath);
    let saveCursorResult = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["p" /* saveFile */])(historyPath + '/cursor', '1');
    // 处理awade-assets
    if (Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["j" /* isFolderExist */])(projInitPath, "awade-assets")) {
        // 将assets拷贝至pub目录
        let webDir = 'app/ui-designer/pub/' + user + '/' + project + '/web/src/awade-assets';
        let copyResult = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["a" /* copyDir */])(projInitPath + '/awade-assets', webDir);
        if (!copyResult) {
            console.error("copying awade-assets files to pub folder");
            return false;
        }
        // 删除saving目录里面的assets
        Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["c" /* deleteDir */])(projInitPath + '/awade-assets');
    }
    return cpSvdResult && saveCursorResult;
}
function unzipInput(inputPath) {
    const match = inputPath.match(/\/([^\/\\]+)\.zip$/);
    if (!match)
        return true;
    const tmpPath = os.tmpdir() + '/awadec-unzip-file' + new Date().getTime();
    let mdResult = Object(__WEBPACK_IMPORTED_MODULE_1__server_utils_limited_shell__["a" /* limitedShell */])(`mkdir -p ${tmpPath}`);
    if (!mdResult) {
        console.log('mkdir error: ' + tmpPath);
        return false;
    }
    let unzipResult = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["s" /* unzip */])(inputPath, tmpPath);
    if (!unzipResult) {
        console.error('unzip file error!');
        return false;
    }
    const isRightFile = Object(__WEBPACK_IMPORTED_MODULE_0__server_utils_file_system__["j" /* isFolderExist */])(tmpPath + '/app/*/', 'source');
    if (!isRightFile) {
        console.log('input zip file is not right file path format');
        return false;
    }
    return tmpPath + '/app/*/source';
}


/***/ })
/******/ ]);