const compiledScript = `
(function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JigsawTabsDemoComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jigsaw_core_data_table_data__ = __webpack_require__("../../../../../src/jigsaw/core/data/table-data.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jigsaw_core_data_graph_data__ = __webpack_require__("../../../../../src/jigsaw/core/data/graph-data.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by 10177553 on 2017/3/29.
 */




var JigsawTabsDemoComponent = (function () {
    function JigsawTabsDemoComponent(http) {
        this.fruitList = new __WEBPACK_IMPORTED_MODULE_2_jigsaw_core_data_table_data__["d" /* TableData */]([
            ["banana", "$12.0", "The banana is an edible fruit – botanically a berry – produced by several kinds of large herbaceous flowering plants in the genus Musa.", "Southeast Asia"],
            ["apple", "$21.0", "The apple tree is a deciduous tree in the rose family best known for its sweet, pomaceous fruit, the apple.", "Shan Dong, China"],
            ["strawberry", "$31.0", "The garden strawberry is a widely grown hybrid species of the genus Fragaria, collectively known as the strawberries. It is cultivated worldwide for its fruit.", "Southeast Asia"],
            ["watermelon", "$13.0", "Watermelon Citrullus lanatus var. lanatus is a scrambling and trailing vine in the flowering plant family Cucurbitaceae.", "Southeast Asia"],
            ["pineapple", "$33.0", "The pineapple is a tropical plant with an edible multiple fruit consisting of coalesced berries, also called pineapples.", "Southeast Asia"],
            ["pear", "$11.0", "The pear is any of several tree and shrub species of genus Pyrus, in the family Rosaceae. It is also the name of the pomaceous fruit of the trees. ", "Southeast Asia"],
        ], ["name", "price", "desc", "origin"], ["Name", "Price", "Description", "Origin"]);
        // ====================================================================
        // ignore the following lines, they are not important to this demo
        // ====================================================================
        this.summary = '此demo主要描述tab的加载机制';
        this.description = __webpack_require__("../../../../raw-loader/index.js!../../../../../src/app/demo/tab/basic/readme.md");
        this.tags = [
            'JigsawTab.selectedIndex',
            'JigsawTab.selectChange',
            'JigsawTabPane.lazy',
            'JigsawTabPane.title',
            'JigsawTabPane.disabled',
        ];
        this.lineBarGraphData = new __WEBPACK_IMPORTED_MODULE_3_jigsaw_core_data_graph_data__["l" /* LineGraphData */]();
        this.lineBarGraphData.http = http;
        this.lineBarGraphData.fromAjax('mock-data/marketing');
    }
    JigsawTabsDemoComponent.prototype.testEvent = function (value) {
        console.info(value);
    };
    JigsawTabsDemoComponent.prototype.selectedIndexChange = function ($event) {
        console.log($event);
    };
    JigsawTabsDemoComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
            template: "\\n        <a href=\\"javascript:;\\" (click)=\\"clickHandler('\\u4FEE\\u6539')\\">\\u4FEE\\u6539</a>\\n        <a href=\\"javascript:;\\" (click)=\\"clickHandler('\\u5220\\u9664')\\">\\u5220\\u9664</a>",
            styles: [__webpack_require__("../../../../../src/app/demo/tab/basic/demo.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]])
    ], JigsawTabsDemoComponent);
    return JigsawTabsDemoComponent;
}());



/***/ })

`;
// console.log(compiledScript)
const source = parse(compiledScript);
append(source, {
    import: [{className: 'Test', from: '@rdkmaster/jigsaw'}],
    ctor: [`this.abc=123;`],
    template: 'new template',
    members: [
        'private aa: string', 'bb: number', 'public cc', 'dd',
        'private ee: string = ee', 'ff: number = ff',
        'public gg = gg', `hh = {
            hh1:1, hh2:2
        };`
    ],
    methods: [
        'protected aaa(xxxxxx):sss {\nxxxxx;\n}',
        'bbb(yyyyy):sss {\nxxxxx;\n}',
        'ccc(zzzzzz) {\nxxxxx;\n}',
        'protected ddd() {\nxxxxx;\n}',
    ]
})
console.log(simulateCompile(source));

function parse(compiledScript) {
    const imports = compiledScript.match(/\bvar\s+.*\);/g);

    const ctorMatch = compiledScript.match(/\bfunction\s+(\w+)\s*\((.*?)\)\s*{\s*([\s\S]*?)\s*}\s*\w+\.prototype\.\w+/);
    const className = ctorMatch[1];
    const inject = ctorMatch[2];
    const ctor = ctorMatch[3];

    const injectMeta = compiledScript.match(/\b(__metadata\("design:paramtypes",.*)\n/)[1];

    const templateMatch = compiledScript.match(/\b__decorate\(\[[\s\S]*?\btemplate\s*:\s*"(.*)"/);
    const template = templateMatch[1];

    const methods = [];
    compiledScript.replace(new RegExp(`\\b(${className}\\.prototype\\.[\\s\\S]*};)\\s*${className}\\b`),
        (found, method) => methods.push(method));

    return {
        import: imports,
        ctor: [ctor],
        template: template,
        members: [],
        methods: methods,
        inject: inject,
        injectMeta: injectMeta
    }
}

function append(source, incoming) {
    // 先处理members，比较特殊，只在提供的member有初始化的时候，从在构造函数里执行初始化语句，否则没有定义的过程
    const initials = incoming.members.filter(member => member.indexOf('=') != -1)
        .map(member => member.replace(/(private|protected|public\s)?\s*(.*?)(:\s*.+?)?=([\s\S]*);?/, 'this.$2=$4'));
    source.ctor = source.ctor.concat(...initials).concat(incoming.ctor);

    const toImportVarName = imp => imp.from.replace(/[^\w]/g, '_');
    const importVarNames = source.import.map(imp => imp.match(/var\s+(.*)\s*=/)[1]);
    source.import = incoming.import.filter(imp => !importVarNames.find(vn => vn.indexOf(toImportVarName(imp)) != -1))
        .map((imp, idx) => `var __WEBPACK_IMPORTED_MODULE__${toImportVarName(imp)}__ = __webpack_require__("${imp.from}");`)
        .concat(...source.import);

    source.template = incoming.template;

    const className = source.methods[0].match(/(\w+)\./)[1];
    source.methods = incoming.methods.map(method => {
            return method.replace(/(private|protected|public\s)?\s*(.*?)(\(.*\))(:\s*.+?)?\s*({[\s\S]*})/,
                `${className}.prototype.$2 = function $3 $5;`);
        })
        .concat(...source.methods);
}

function simulateCompile(source) {
    const className = source.methods[0].match(/(\w+)\./)[1];
    return `
        (function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, "a", function() { return ${className}; });
            ${source.import.join('\n')}
            var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
                var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
                if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
                else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            };
            var __metadata = (this && this.__metadata) || function (k, v) {
                if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
            };
            var ${className} = (function () {
                function ${className}(${source.inject}) {
                    ${source.ctor.join('\n')}
                }
                ${source.methods.join('\n')}
                ${className} = ${className}_1 = __decorate([
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
                        template: ${source.template},
                    }),
                    ${source.injectMeta}
                ], ${className});
                return ${className};
            }());
        /***/ })
    `;
}
