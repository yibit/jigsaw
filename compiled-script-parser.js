const compiledScript = `
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var core_1 = window['awade'].deps.angular_core_esm5_core;
var http_1 = window['awade'].deps.angular_common_esm5_http;
var uid_sdk_1 = window['awade'].deps.rdkmaster_uid_sdk_bundles_sdk_es5;
var core_2 = window['awade'].deps.ngx_translate_core_index;
var jigsaw_1 = window['awade'].deps.rdkmaster_jigsaw_es5;
var router_1 = window['awade'].deps.angular_router_esm5_router;
var common_1 = window['awade'].deps.angular_common_esm5_common;
var console = uid_sdk_1.LogService;
var AppComponent = (function () {
    function AppComponent(route, router, location, http, zone, eventBus, dataBus, translateService, loadingService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.location = location;
        this.http = http;
        this.zone = zone;
        this.eventBus = eventBus;
        this.dataBus = dataBus;
        this.translateService = translateService;
        this.loadingService = loadingService;
        // 存放所有订阅事件
        this._subscribers = [];
        this._internalVariable = {};
        //-----------i18n----------
        translateService.setTranslation('zh', {}, true);
        translateService.setTranslation('en', {}, true);
        this.http.get('/rdk/service/app/common/locale').subscribe(function (lang) {
            lang = typeof lang == 'string' ? lang.split('_')[0] : 'zh';
            jigsaw_1.TranslateHelper.changeLanguage(_this.translateService, lang);
        });
        this.dataBus.i18n = {};
        jigsaw_1.TranslateHelper.languageChangEvent.subscribe(function (langInfo) {
        });
        try {
            this.jigsawBox3_direction = "vertical";
        }
        catch (e) {
        }
        //---------------------
        try {
            this.jigsawIcon13_icon = "fa fa-calendar";
        }
        catch (e) {
        }
        //---------------------
        try {
            this.jxRangeTimeSelect11_value = [{ label: jigsaw_1.TimeService.getFormatDate('now-7d', jigsaw_1.TimeGr.date) }, { label: jigsaw_1.TimeService.getFormatDate('now', jigsaw_1.TimeGr.date) }];
        }
        catch (e) {
        }
    }
    Object.defineProperty(AppComponent.prototype, "i18n", {
        get: function () {
            return this.dataBus.i18n;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "root", {
        get: function () {
            return this._root;
        },
        set: function (value) {
            if (!value || value === this._root) {
                return;
            }
            this._root = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "jigsawBox3", {
        get: function () {
            return this._jigsawBox3;
        },
        set: function (value) {
            if (!value || value === this._jigsawBox3) {
                return;
            }
            this._jigsawBox3 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "jigsawBox6", {
        get: function () {
            return this._jigsawBox6;
        },
        set: function (value) {
            if (!value || value === this._jigsawBox6) {
                return;
            }
            this._jigsawBox6 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "uidPlaceholder1", {
        get: function () {
            return this._uidPlaceholder1;
        },
        set: function (value) {
            if (!value || value === this._uidPlaceholder1) {
                return;
            }
            this._uidPlaceholder1 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "jigsawBox18", {
        get: function () {
            return this._jigsawBox18;
        },
        set: function (value) {
            if (!value || value === this._jigsawBox18) {
                return;
            }
            this._jigsawBox18 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "jigsawIcon13", {
        get: function () {
            return this._jigsawIcon13;
        },
        set: function (value) {
            if (!value || value === this._jigsawIcon13) {
                return;
            }
            this._jigsawIcon13 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "jxRangeTimeSelect11", {
        get: function () {
            return this._jxRangeTimeSelect11;
        },
        set: function (value) {
            if (!value || value === this._jxRangeTimeSelect11) {
                return;
            }
            this._jxRangeTimeSelect11 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "jigsawRangeTime12", {
        get: function () {
            return this._jigsawRangeTime12;
        },
        set: function (value) {
            if (!value || value === this._jigsawRangeTime12) {
                return;
            }
            this._jigsawRangeTime12 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "jigsawBox15", {
        get: function () {
            return this._jigsawBox15;
        },
        set: function (value) {
            if (!value || value === this._jigsawBox15) {
                return;
            }
            this._jigsawBox15 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "jigsawButton10", {
        get: function () {
            return this._jigsawButton10;
        },
        set: function (value) {
            if (!value || value === this._jigsawButton10) {
                return;
            }
            this._jigsawButton10 = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "uidPlaceholder2", {
        get: function () {
            return this._uidPlaceholder2;
        },
        set: function (value) {
            if (!value || value === this._uidPlaceholder2) {
                return;
            }
            this._uidPlaceholder2 = value;
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.jxRangeTimeSelect11_openChange = function ($event) {
        try {
            // 自定义代码块
            this.jxRangeTimeSelect11_interactive($event);
        }
        catch (e) {
            console.error('script error in jxRangeTimeSelect11_openChange: ', e.message);
        }
    };
    AppComponent.prototype.jigsawButton10_click = function ($event) {
        try {
            // 发送事件到事件总线
            this.eventBus.emit('search', {});
        }
        catch (e) {
            console.error('script error in jigsawButton10_click: ', e.message);
        }
        // 提醒
        jigsaw_1.JigsawNotification.show("\u67E5\u8BE2\u6309\u94AE\u88AB\u70B9\u51FB\u4E86", {
            caption: undefined, position: jigsaw_1.NotificationPosition.rightTop, icon: undefined,
            timeout: 8000, width: 350, height: 0,
            innerHtmlContext: this
        });
    };
    AppComponent.prototype.jxRangeTimeSelect11_interactive = function ($event) {
        var _this = this;
        if (!$event) {
            if (this._internalVariable['_remove_jxRangeTimeSelect11_dateChange']) {
                this._internalVariable['_remove_jxRangeTimeSelect11_dateChange'].unsubscribe();
                this._internalVariable['_remove_jxRangeTimeSelect11_dateChange'] = null;
            }
            return;
        }
        setTimeout(function () {
            if (!_this.jigsawRangeTime12 || !_this.jxRangeTimeSelect11)
                return;
            if (_this.jxRangeTimeSelect11.value && _this.jxRangeTimeSelect11.value.length == 2) {
                setTimeout(function () {
                    _this.jigsawRangeTime12.beginDate = _this.jxRangeTimeSelect11.value[0].label;
                    _this.jigsawRangeTime12.endDate = _this.jxRangeTimeSelect11.value[1].label;
                });
            }
            else if (_this.jigsawRangeTime12.beginDate && _this.jigsawRangeTime12.endDate) {
                _this.jxRangeTimeSelect11.value = [{ label: _this.jigsawRangeTime12.beginDate }, { label: _this.jigsawRangeTime12.endDate }];
            }
            else {
                _this.jxRangeTimeSelect11.value = null;
            }
            if (_this._internalVariable['_remove_jxRangeTimeSelect11_dateChange']) {
                _this._internalVariable['_remove_jxRangeTimeSelect11_dateChange'].unsubscribe();
                _this._internalVariable['_remove_jxRangeTimeSelect11_dateChange'] = null;
            }
            _this._internalVariable['_remove_jxRangeTimeSelect11_dateChange'] = _this.jigsawRangeTime12.change.debounceTime(300).subscribe(function () {
                _this.jxRangeTimeSelect11.value = [{ label: _this.jigsawRangeTime12.beginDate }, { label: _this.jigsawRangeTime12.endDate }];
            });
        });
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.eventBus.emit('AppComponent_onInit');
        this.route.params.subscribe(function (params) {
            _this.routerParamValue = params[_this.paramName];
        });
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._resizeEndDrawingBoardHandler = jigsaw_1.JigsawBox.resizeEnd.subscribe(function (event) {
            _this._triggerWindowResize();
        });
        this._boxViewInitHandler = jigsaw_1.JigsawBox.viewInit.subscribe(function (event) {
            _this._triggerWindowResize();
        });
        this._subscribers.push(this._boxViewInitHandler);
        this._subscribers.push(this._resizeEndDrawingBoardHandler);
        this.eventBus.emit('AppComponent_afterViewInit');
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this._subscribers.forEach(function (subscriber) {
            subscriber.unsubscribe();
        });
    };
    AppComponent.prototype._triggerWindowResize = function () {
        var e = document.createEvent("Event");
        e.initEvent("resize", true, true);
        window.dispatchEvent(e);
    };
    __decorate([
        core_1.ViewChild('root'),
        __metadata("design:type", jigsaw_1.JigsawBox),
        __metadata("design:paramtypes", [jigsaw_1.JigsawBox])
    ], AppComponent.prototype, "root", null);
    __decorate([
        core_1.ViewChild('jigsawBox3'),
        __metadata("design:type", jigsaw_1.JigsawBox),
        __metadata("design:paramtypes", [jigsaw_1.JigsawBox])
    ], AppComponent.prototype, "jigsawBox3", null);
    __decorate([
        core_1.ViewChild('jigsawBox6'),
        __metadata("design:type", jigsaw_1.JigsawBox),
        __metadata("design:paramtypes", [jigsaw_1.JigsawBox])
    ], AppComponent.prototype, "jigsawBox6", null);
    __decorate([
        core_1.ViewChild('uidPlaceholder1'),
        __metadata("design:type", core_1.ElementRef),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], AppComponent.prototype, "uidPlaceholder1", null);
    __decorate([
        core_1.ViewChild('jigsawBox18'),
        __metadata("design:type", jigsaw_1.JigsawBox),
        __metadata("design:paramtypes", [jigsaw_1.JigsawBox])
    ], AppComponent.prototype, "jigsawBox18", null);
    __decorate([
        core_1.ViewChild('jigsawIcon13'),
        __metadata("design:type", jigsaw_1.JigsawIcon),
        __metadata("design:paramtypes", [jigsaw_1.JigsawIcon])
    ], AppComponent.prototype, "jigsawIcon13", null);
    __decorate([
        core_1.ViewChild('jxRangeTimeSelect11'),
        __metadata("design:type", jigsaw_1.JigsawComboSelect),
        __metadata("design:paramtypes", [jigsaw_1.JigsawComboSelect])
    ], AppComponent.prototype, "jxRangeTimeSelect11", null);
    __decorate([
        core_1.ViewChild('jigsawRangeTime12'),
        __metadata("design:type", jigsaw_1.JigsawRangeTime),
        __metadata("design:paramtypes", [jigsaw_1.JigsawRangeTime])
    ], AppComponent.prototype, "jigsawRangeTime12", null);
    __decorate([
        core_1.ViewChild('jigsawBox15'),
        __metadata("design:type", jigsaw_1.JigsawBox),
        __metadata("design:paramtypes", [jigsaw_1.JigsawBox])
    ], AppComponent.prototype, "jigsawBox15", null);
    __decorate([
        core_1.ViewChild('jigsawButton10'),
        __metadata("design:type", jigsaw_1.JigsawButton),
        __metadata("design:paramtypes", [jigsaw_1.JigsawButton])
    ], AppComponent.prototype, "jigsawButton10", null);
    __decorate([
        core_1.ViewChild('uidPlaceholder2'),
        __metadata("design:type", core_1.ElementRef),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], AppComponent.prototype, "uidPlaceholder2", null);
    AppComponent = __decorate([
        core_1.Component({
            template: "\\n                <jigsaw-box [perfectScrollbar]=\\"{wheelSpeed: 0.5, wheelPropagation: true}\\"\\n                    [grow]=\\"1\\" style=\\"min-width: 22px;min-height:22px\\"     \\n                    #root agent=\\"3f02d90a-1fba-4593-a294-6f75d872c752\\" class=\\"root_class\\"   [height]=\\"'100%'\\"  ><jigsaw-box [perfectScrollbar]=\\"{wheelSpeed: 0.5, wheelPropagation: true}\\"\\n                    [grow]=\\"1\\" style=\\"min-width: 22px;min-height:22px\\"     [direction]=\\"jigsawBox3_direction\\" \\n                    #jigsawBox3 agent=\\"8f72a0e1-586d-411d-be22-122c97aae5b5\\" class=\\"jigsawBox3_class\\"   ><jigsaw-box [perfectScrollbar]=\\"{wheelSpeed: 0.5, wheelPropagation: true}\\"\\n                    [grow]=\\"4.86322188449848\\" style=\\"min-width: 22px;min-height:22px\\"     \\n                    #jigsawBox6 agent=\\"52a38847-9a5c-4ef8-819d-ae4440138570\\" class=\\"jigsawBox6_class\\"   [height]=\\"'50PX'\\"  >\\n                        <jigsaw-box [grow]=\\"46.93093542300566\\" [perfectScrollbar]=\\"{wheelSpeed: 0.5, wheelPropagation: true}\\" \\n                                    style=\\"min-width: 22px;min-height:22px\\"  ><uid-placeholder  #uidPlaceholder1 agent=\\"c61060f3-7266-4c2f-9cce-85ed5ede3fd6\\" class=\\"uidPlaceholder1_class\\"  ></uid-placeholder></jigsaw-box>\\n                    <jigsaw-box [perfectScrollbar]=\\"{wheelSpeed: 0.5, wheelPropagation: true}\\"\\n                    [grow]=\\"53.06906457699434\\" style=\\"min-width: 22px;min-height:22px\\"     \\n                    #jigsawBox18 agent=\\"58334bf1-5117-4463-ada4-c6b490b329cd\\" class=\\"jigsawBox18_class\\"   [width]=\\"'270PX'\\"  >\\n                        <jigsaw-box [grow]=\\"6.533564814814814\\" [perfectScrollbar]=\\"{wheelSpeed: 0.5, wheelPropagation: true}\\" \\n                                    style=\\"min-width: 22px;min-height:22px\\"  ><jigsaw-icon  [icon]=\\"jigsawIcon13_icon\\"      #jigsawIcon13 agent=\\"35eef44d-69fb-4e6d-82dd-d7170b65562f\\" class=\\"jigsawIcon13_class\\"  ></jigsaw-icon></jigsaw-box>\\n                    \\n                        <jigsaw-box [grow]=\\"93.46643518518518\\" [perfectScrollbar]=\\"{wheelSpeed: 0.5, wheelPropagation: true}\\" \\n                                    style=\\"min-width: 22px;min-height:22px\\"  ><jigsaw-combo-select [(value)]=\\"jxRangeTimeSelect11_value\\"               (openChange)=\\"jxRangeTimeSelect11_openChange($event)\\"  #jxRangeTimeSelect11 agent=\\"6ebf293a-411b-41a8-bcd6-0e8e655b8321\\" class=\\"jxRangeTimeSelect11_class\\"  ><ng-template><jigsaw-range-time                 #jigsawRangeTime12 agent=\\"14e77290-6ca3-49db-92d8-b1e26bd12d85\\" class=\\"jigsawRangeTime12_class\\"  ></jigsaw-range-time></ng-template></jigsaw-combo-select></jigsaw-box>\\n                    </jigsaw-box><jigsaw-box [perfectScrollbar]=\\"{wheelSpeed: 0.5, wheelPropagation: true}\\"\\n                    [grow]=\\"8.695718842001963\\" style=\\"min-width: 22px;min-height:22px\\"     \\n                    #jigsawBox15 agent=\\"6ba1a224-6608-4da2-a153-6e6deb8a7c68\\" class=\\"jigsawBox15_class\\"   [width]=\\"'100PX'\\"  ><jigsaw-button     (click)=\\"jigsawButton10_click($event)\\"  #jigsawButton10 agent=\\"f9e38a3e-6610-4ab7-9f86-c8e41044a057\\" class=\\"jigsawButton10_class\\"  ><div>\u67E5\u8BE2</div></jigsaw-button></jigsaw-box></jigsaw-box>\\n                        <jigsaw-box [grow]=\\"95.13677811550151\\" [perfectScrollbar]=\\"{wheelSpeed: 0.5, wheelPropagation: true}\\" \\n                                    style=\\"min-width: 22px;min-height:22px\\"  ><uid-placeholder  #uidPlaceholder2 agent=\\"7084be3b-d489-4c64-8ca9-0af605b4c3fb\\" class=\\"uidPlaceholder2_class\\"  ></uid-placeholder></jigsaw-box>\\n                    </jigsaw-box></jigsaw-box>\\n             ",
            styles: ["\\n                \\n                .root_class {\\n                    height: 100%; \\n                }\\n            \\n                .jigsawBox6_class {\\n                    height: 50PX; line-height: 49PX; background-color: #009FF5 !important ; \\n                }\\n            \\n                .jigsawBox18_class {\\n                    width: 270PX; \\n                }\\n            \\n                .jigsawIcon13_class {\\n                    color: #fff !important ; font-size: 18PX; \\n                }\\n            \\n                .jxRangeTimeSelect11_class {\\n                    line-height: 0PX; \\n                }\\n            \\n                .jigsawBox15_class {\\n                    width: 100PX; text-align: center; \\n                }\\n            \\n             "]
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            router_1.Router,
            common_1.Location,
            http_1.HttpClient,
            core_1.NgZone,
            uid_sdk_1.EventBus,
            uid_sdk_1.DataBus,
            core_2.TranslateService,
            uid_sdk_1.LoadingService])
    ], AppComponent);
    return AppComponent;
}());

;
var __uid_ts_1542795814596;;AppComponent
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
        'public gg = gg',
        `
            hh = {
                hh1:1, hh2:2
            };
        `,
        `
            private _abc: string = 'dfdfd';

            public get abc():string {
                return this._abc;
            }

            public set abc(value: string) {
                this._abc = value;
            }
        `
    ],
    methods: [
        'protected aaa(xxxxxx):sss {\nxxxxx;\n}',
        'bbb(yyyyy):sss {\nxxxxx;\n}',
        'ccc(zzzzzz) {\nxxxxx;\n}',
        'protected ddd() {\nxxxxx;\n}',
    ],
    inject: 'dataBus: DataBus',
    viewChildren: 'newComponentId'
})
console.log(source);
// console.log(simulateCompile(source));

function parse(compiledScript) {
    const imports = compiledScript.match(/\bvar\s+\w+\s*=\s*window\['awade']\.deps\.\w+;/g);

    const ctorRegExp = /\bfunction\s+(\w+)\s*\((.*?)\)\s*{\s*([\s\S]*?)\s*}\s*Object\.defineProperty\b/;
    const ctorMatch = compiledScript.match(ctorRegExp);
    const className = ctorMatch[1];
    const inject = ctorMatch[2];
    const ctor = ctorMatch[3];

    const injectMeta = compiledScript.match(/\b(__metadata\("design:paramtypes",[\s\S]*])/)[1];

    const templateMatch = compiledScript.match(/\b__decorate\(\[[\s\S]*?\btemplate\s*:\s*"(.*)"/);
    const template = templateMatch[1];

    const membersRegExp = new RegExp(`\\bObject\\.defineProperty\\(${className}\\.prototype[\\s\\S]*?}\\);`, 'g');
    const members = compiledScript.match(membersRegExp);

    const methodsRegExp = new RegExp(`\\b(${className}\\.prototype\\.[\\s\\S]*};)\\s*__decorate\\(\\[`);
    const methods = compiledScript.match(methodsRegExp)[1];

    const viewChildrenRegExp = new RegExp(`\\b__decorate\\(\\[[\\s\\S]*?,\\s*${className}\\.prototype.*`, 'g');
    const viewChildren = compiledScript.match(viewChildrenRegExp);

    return {
        import: imports,
        ctor: [ctor],
        template: template,
        members: members,
        methods: methods,
        inject: inject,
        injectMeta: injectMeta,
        viewChildren: viewChildren
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
            ${source.import.join('\\n')}
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
                    ${source.ctor.join('\\n')}
                }
                ${source.methods.join('\\n')}
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
