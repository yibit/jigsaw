﻿import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgModule,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Renderer2,
    ViewChildren
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AbstractJigsawComponent, JigsawCommonModule} from "../common";
import {JigsawTableCellInternalComponent, JigsawTableHeaderInternalComponent} from "./table-inner.components";
import {TableData} from "../../core/data/table-data";

import {
    _getColumnIndex,
    AdditionalColumnDefine,
    AdditionalTableData,
    ColumnDefine,
    SortChangeEvent,
    TableCellSetting,
    TableColumnTargetFinder,
    TableDataChangeEvent,
    TableHeadSetting
} from "./table-typings";
import {CallbackRemoval, CommonUtils} from "../../core/utils/common-utils";
import {SortAs, SortOrder} from "../../core/data/component-data";
import {DefaultCellRenderer, JigsawTableRendererModule, TableCellTextEditorRenderer} from "./table-renderer";
import {AffixUtils} from "../../core/utils/internal-utils";

@Component({
    selector: 'jigsaw-table, j-table',
    templateUrl: 'table.html',
    host: {
        '[style.width]': 'width',
        '[style.height]': 'height',
        '[class.jigsaw-table-host]': 'true',
        '[class.jigsaw-table-hide-head]': "hideHeader"
    },
})
export class JigsawTable extends AbstractJigsawComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(private _renderer: Renderer2, private _elementRef: ElementRef,
                private _zone: NgZone) {
        super();
    }

    @Output()
    public sort = new EventEmitter<SortChangeEvent>();

    private _contentWidth: string;

    @Input()
    public get contentWidth(): string {
        return this._contentWidth;
    }

    public set contentWidth(value: string) {
        this._contentWidth = CommonUtils.getCssValue(value);
    }

    @Input()
    public hideHeader: boolean = false;

    private _selectedRow: number;

    @Input()
    public get selectedRow(): number {
        return this._selectedRow;
    }

    public set selectedRow(value: number) {
        this._selectedRow = value;
        if (this.initialized) {
            this._$selectRow(value);
        }
    }

    @Output()
    public selectChange: EventEmitter<number> = new EventEmitter<number>();

    private _getColumnIndex(field: string): [number, TableData] {
        return _getColumnIndex(this.data, this._additionalData, field);
    }

    private _getHeaderValueByField(field): string {
        let [index, tableData] = this._getColumnIndex(field);
        if (index == -1) {
            console.error('no header value found, unknown field: ' + field);
            return '';
        }
        return tableData.header[index];
    }

    /**
     * @internal
     */
    public _$headerSettings: TableHeadSetting[] = [];
    private _headerSettingsBackup: { [field: string]: TableHeadSetting } = {};

    private _updateHeaderSettings(mixedFields: string[]): void {
        const oldBackup = CommonUtils.shallowCopy(this._headerSettingsBackup);
        this._headerSettingsBackup = {};
        this._$headerSettings.splice(0, this._$headerSettings.length);

        mixedFields.forEach((field, index) => {
            let matchedColumnDef = this.columnDefines.find(
                colDef => (<TableColumnTargetFinder>colDef.target)(field, index));
            if (matchedColumnDef && matchedColumnDef.visible === false) {
                return;
            }

            let settings = oldBackup[field];
            if (!settings) {
                settings = this._createHeaderSettings(matchedColumnDef, field);
            }
            if (settings.cellData === null) {
                settings.cellData = this._getHeaderValueByField(field);
            }
            this._$headerSettings.push(settings);
            this._headerSettingsBackup[field] = settings;
        });
    }

    private _getCellDataByField(field: string, row: number): any {
        let [index, tableData] = this._getColumnIndex(field);
        if (index == -1) {
            console.error('no cell data found, unknown field: ' + field);
            return '';
        }
        if (!tableData.data[row]) {
            tableData.data[row] = [];
        }
        return tableData.data[row][index];
    }

    private _setCellDataByField(field: string, row: number, data: any): void {
        let [index, tableData] = this._getColumnIndex(field);
        if (index == -1) {
            console.error('no cell data found, unable to set, field: ' + field);
            return;
        }
        if (!tableData.data[row]) {
            tableData.data[row] = [];
        }
        tableData.data[row][index] = data;
    }

    /**
     * @internal
     */
    public _$cellSettings: TableCellSetting[][] = [];
    private _cellSettingsBackup: { [field: string]: TableCellSetting[] } = {};

    private _updateCellSettings(mixedFields: string[]): void {
        // clear origin settings, but keep the origin row array ref,
        // which will avoid ngFor from rerendering the dom
        this._$cellSettings.forEach(row => row.splice(0, row.length));
        const dataLen = this.data.data.length;
        // remove extra lines if necessary
        this._$cellSettings.splice(dataLen, this._$cellSettings.length);
        this._additionalData.data.splice(dataLen, this._$cellSettings.length);

        let oldBackup = CommonUtils.shallowCopy(this._cellSettingsBackup);
        this._cellSettingsBackup = {};

        mixedFields.forEach((field, colIndex) => {
            let matchedColumnDef = this.columnDefines.find(
                colDef => (<TableColumnTargetFinder>colDef.target)(field, colIndex));
            if (matchedColumnDef && matchedColumnDef.visible === false) {
                return;
            }

            // prepare for backing up the new settings
            this._cellSettingsBackup[field] = [];

            let sTemplate: TableCellSetting = this._createCellSettings(matchedColumnDef, field);
            const [realColIndex,] = this._getColumnIndex(field);
            let groupSetting: TableCellSetting;
            let settings: TableCellSetting;
            for (let rowIndex = 0; rowIndex < dataLen; rowIndex++) {
                settings = oldBackup[field] ? oldBackup[field][rowIndex] : undefined;
                if (!settings) {
                    settings = <TableCellSetting>CommonUtils.shallowCopy(sTemplate);
                }
                this._cellSettingsBackup[field].push(settings);
                // reset the rowSpan value, it will be recomputed later.
                settings.rowSpan = 1;

                if (!this._$cellSettings[rowIndex]) {
                    this._$cellSettings.push([]);
                }
                this._$cellSettings[rowIndex].push(settings);

                if (settings.editable) {
                    settings.renderer = settings.renderer ? settings.renderer : DefaultCellRenderer;
                    settings.editorRenderer = settings.editorRenderer ? settings.editorRenderer : TableCellTextEditorRenderer;
                }

                const generator = matchedColumnDef && matchedColumnDef.cell && matchedColumnDef.cell.data instanceof Function ?
                    matchedColumnDef.cell.data : null;
                const originVal = this._getCellDataByField(field, rowIndex);
                if (generator) {
                    // 根据cell的data函数，生成新的cellData，并更新tableData
                    settings.cellData = generator(this.data, rowIndex, realColIndex, this._additionalData);
                    this._setCellDataByField(field, rowIndex, settings.cellData);
                } else {
                    settings.cellData = originVal;
                }
                settings.cellData = CommonUtils.isDefined(settings.cellData) ? settings.cellData : '';

                // 修改settings的group属性
                if (matchedColumnDef && matchedColumnDef.group) {
                    if (groupSetting && groupSetting.cellData == settings.cellData) {
                        groupSetting.rowSpan++;
                        settings.rowSpan = 0;
                    } else {
                        groupSetting = settings;
                    }
                }
            }
        });
    }

    private _createCellSettings(columnDefine: ColumnDefine, field: string): TableCellSetting {
        let settings: TableCellSetting = {
            cellData: '',
            width: undefined,
            visible: true,
            renderer: null,
            clazz: '',
            editable: false,
            editorRenderer: null,
            group: false,
            field: field,
            rowSpan: 1,
            lineEllipsis: false
        };
        settings.width = columnDefine && columnDefine.width;
        settings.group = columnDefine && columnDefine.group;
        let cellDef = columnDefine && columnDefine.cell;
        if (cellDef) {
            settings.renderer = cellDef.renderer;
            settings.clazz = cellDef.clazz;
            settings.editable = cellDef.editable;
            settings.editorRenderer = cellDef.editorRenderer;
            settings.lineEllipsis = cellDef.lineEllipsis;
        }
        return settings;
    }

    private _createHeaderSettings(columnDefine: ColumnDefine, field: string): TableHeadSetting {
        let settings: TableHeadSetting = {
            cellData: null,
            width: null,
            visible: true,
            renderer: null,
            clazz: '',
            sortable: false,
            sortAs: SortAs.string,
            defaultSortOrder: SortOrder.default,
            field: field
        };
        settings.width = columnDefine && columnDefine.width;
        let headerDef = columnDefine && columnDefine.header;
        if (headerDef) {
            settings.cellData = CommonUtils.isDefined(headerDef.text) ? headerDef.text : settings.cellData;
            settings.renderer = headerDef.renderer;
            settings.clazz = headerDef.clazz;
            settings.sortable = headerDef.sortable;
            settings.sortAs = CommonUtils.isDefined(headerDef.sortAs) ? headerDef.sortAs : settings.sortAs;
            settings.defaultSortOrder = CommonUtils.isDefined(headerDef.sortAs) ?
                headerDef.defaultSortOrder : settings.defaultSortOrder;
        }
        return settings;
    }

    /**
     * 根据tableDate的field和additionalColumn的field生成最终要显示出来的列位置
     * 比如['additional-field-0', 'name', 'gender', 'position', 'additional-field-1']
     * @returns {string[]}
     * @private
     */
    private _getMixedFields(): string[] {
        if (!this._additionalColumnDefines || !this.data) {
            return [];
        }
        const result = this.data.field.concat();
        for (let i = this._additionalColumnDefines.length - 1; i >= 0; i--) {
            const field = 'additional-field-' + i;
            const acd = this._additionalColumnDefines[i];
            const pos = CommonUtils.isDefined(acd.pos) ? acd.pos : this._data.field.length;
            result.splice(pos, 0, field);
        }
        return result;
    }

    /**
     * ColumnDefine所有的target转化为函数的形式
     * @param {ColumnDefine} colDef
     * @returns {ColumnDefine}
     * @private
     */
    private _fixColumnDefineTarget(colDef: ColumnDefine): ColumnDefine {
        let targets;
        if (typeof colDef.target == 'number' || typeof colDef.target == 'string') {
            targets = [colDef.target];
        } else if (colDef.target instanceof Array) {
            targets = colDef.target
        } else if (colDef.target instanceof Function) {
            return;
        } else {
            colDef.target = () => false;
            return;
        }
        if (CommonUtils.isDefined(targets) && targets.length > 0) {
            colDef.target = (field, index) => !!targets.find(
                f => (typeof f === 'string' && f === field) || (typeof f === 'number' && f === index));
        }
        return colDef;
    }

    private _update(): void {
        if (!this.initialized || !this._data) {
            return;
        }
        if (!this._data.field || this._data.field.length == 0) {
            console.error('invalid table data, need a "field" property.');
            return;
        }

        const mixedFields = this._getMixedFields();
        this._updateHeaderSettings(mixedFields);
        this._updateCellSettings(mixedFields);
        this.additionalDataChange.emit(this.additionalData);
        setTimeout(() => this._calculateContentWidth(), 0);
    }

    private _additionalData = new AdditionalTableData();

    @Input()
    public get additionalData(): TableData {
        return this._additionalData;
    }

    public set additionalData(value: TableData) {
        //ignore incoming data.
    }

    @Output()
    public additionalDataChange = new EventEmitter<TableData>();

    private _trackRowBy: string;

    @Input()
    public get trackRowBy(): string {
        return this._trackRowBy;
    }

    public set trackRowBy(value: string) {
        this._trackRowBy = value;
        this._additionalData.trackRowBy = value;
    }

    private _removeTableDataRefresh: CallbackRemoval;
    private _removeAdditionalDataRefresh: CallbackRemoval;
    private _data: TableData;

    @Input()
    public get data(): TableData {
        return this._data;
    }

    public set data(value: TableData) {
        if (value == this._data || !value) {
            return;
        }
        this._data = value;
        this._additionalData.data.splice(0, this._additionalData.data.length);
        this._additionalData.clearCachedValues();
        this._additionalData.originData = value;

        this._update();

        if (this._removeTableDataRefresh) {
            this._removeTableDataRefresh();
        }
        this._removeTableDataRefresh = value.onRefresh(this._update, this);

        if (!this._removeAdditionalDataRefresh) {
            this._removeAdditionalDataRefresh = this._additionalData.onRefresh(this._update, this);
        }
    }

    @Output()
    public dataChange = new EventEmitter<TableDataChangeEvent>();

    private _columnDefines: ColumnDefine[] = [];

    @Input()
    public get columnDefines(): ColumnDefine[] {
        return this._columnDefines;
    }

    public set columnDefines(value: ColumnDefine[]) {
        if (!value || value == this._columnDefines) {
            return;
        }
        if (this._columnDefines.length > 0) {
            console.warn('do not support updating the columnDefines yet! ' +
                'you can give the table every possible column defines when you init it.');
            return;
        }
        this._columnDefines = value;
        this._normalizeColumnTarget();
    }

    private _normalizeColumnTarget() {
        // normalize the target to `TableColumnTargetFinder`
        this.columnDefines.forEach((colDef, index) => {
            const cd = <ColumnDefine>CommonUtils.shallowCopy(colDef);
            this.columnDefines[index] = cd;
            if (!cd.hasOwnProperty('target')) {
                console.error('invalid column target, need a "target" property!');
                return;
            }
            this._fixColumnDefineTarget(cd);
        });
    }

    private _additionalColumnDefines: AdditionalColumnDefine[] = [];

    @Input()
    public get additionalColumnDefines(): AdditionalColumnDefine[] {
        return this._additionalColumnDefines;
    }

    public set additionalColumnDefines(value: AdditionalColumnDefine[]) {
        if (!value || value == this._additionalColumnDefines) {
            return;
        }
        if (this._additionalColumnDefines.length > 0) {
            console.warn('do not support updating the additionalColumnDefine yet! ' +
                'you can give the table every possible additional column defines when you init it.');
            return;
        }
        this._additionalColumnDefines = value;
    }

    @Output()
    public doubleClick: EventEmitter<number> = new EventEmitter<number>();

    public _$handleRowDoubleClick(rowIndex: number) {
        this.doubleClick.emit(rowIndex);
    }

    @ViewChildren('tableRow', {read: ElementRef})
    private _rowElementRefs: QueryList<ElementRef>;

    public _$selectRow(rowIndex: number, suppressEvent: boolean = false) {
        this._rowElementRefs.forEach((row, index) => {
            if (index === rowIndex) {
                this._renderer.addClass(row.nativeElement, 'jigsaw-table-row-selected');
                if (!suppressEvent) {
                    this.selectChange.emit(rowIndex);
                }
            } else {
                this._renderer.removeClass(row.nativeElement, 'jigsaw-table-row-selected');
            }
        })
    }

    // /**
    //  * 一旦数据有更新，表格将自动对已经设置了排序的行做自动排序处理。在某些情况下会很方便，但是在表格数据量大的时候，可能会有性能问题，
    //  * 表格数据量大的时候，最好关闭这个选项，由应用自行对`data`属性做排序。也可以不自动排序，由用户自行点击列头触发行排序
    //  *
    //  * @type {boolean}
    //  */
    // @Input()
    // public autoSort: boolean = false;
    //
    // private _sortedColumn: number = -1;
    // private _sortedOrder: SortOrder;
    //
    // private _sortColumn(): void {
    //     if (!this.autoSort) {
    //         return;
    //     }
    //     let headSetting = this._$headerSettings.find(headSetting => headSetting.sortable &&
    //         (headSetting.defaultSortOrder == SortOrder.asc || headSetting.defaultSortOrder == SortOrder.des)
    //     );
    //     // if (headSetting) {
    //     //     this._sortedColumn = headSetting.field;
    //     // }
    //     this.data.sort(headSetting.sortAs, headSetting.defaultSortOrder, headSetting.field);
    // }

    @Input()
    public floatingHeader: boolean = false;

    private _removeWindowScrollListener: Function;
    private _removeWindowResizeListener: Function;

    private _addWindowListener() {
        this._removeWindowListener();

        this._removeWindowResizeListener = this._renderer.listen('window', 'resize', () => {
            this._floatHead();
        });

        if (this.floatingHeader && !this.hideHeader) {
            this._zone.runOutsideAngular(() => {
                this._removeWindowScrollListener = this._renderer.listen('window', 'scroll', () => {
                    this._floatHead();
                });
            });
        }
    }

    private _floatingHeadElement: HTMLElement;

    private _floatHead() {
        const maxTop = this._elementRef.nativeElement.offsetHeight - this._floatingHeadElement.offsetHeight;
        let tableDocumentTop = AffixUtils.offset(this._elementRef.nativeElement).top;
        let scrollTop = AffixUtils.getScrollTop();
        let top = scrollTop - tableDocumentTop;
        if (top > 0 && top < maxTop) {
            this._renderer.setStyle(this._floatingHeadElement, 'top', top + 'px');
        } else if (top <= 0) {
            if (this._floatingHeadElement.style.top !== '0' && this._floatingHeadElement.style.top !== '0px') {
                this._renderer.setStyle(this._floatingHeadElement, 'top', '0');
            }
        } else if (top >= maxTop) {
            // table超出屏幕显示位置
        }
    }

    private _removeWindowListener() {
        if (this._removeWindowScrollListener) {
            this._removeWindowScrollListener();
            this._removeWindowScrollListener = null;
        }
        if (this._removeWindowResizeListener) {
            this._removeWindowResizeListener();
            this._removeWindowResizeListener = null;
        }
    }

    @ViewChildren(JigsawTableHeaderInternalComponent)
    private _headerComponents: QueryList<JigsawTableHeaderInternalComponent>;

    public _$onSort(sortInfo): void {
        this._headerComponents.forEach(comp => sortInfo.field != comp.field && comp.updateSortOrderClass(SortOrder.default));
        this.sort.emit(sortInfo);
    }

    private _mixInColumns(): void {
        if (!this._additionalColumnDefines) {
            return;
        }
        for (let i = this._additionalColumnDefines.length - 1; i >= 0; i--) {
            const acd = this._additionalColumnDefines[i];
            const cd: ColumnDefine = this._fixColumnDefineTarget({
                target: 'additional-field-' + i,
                header: acd.header,
                group: acd.group,
                cell: acd.cell,
                width: acd.width,
                visible: acd.visible
            });
            this.columnDefines.push(cd);
        }
    }

    private _initAdditionalData(): void {
        if (!this.additionalColumnDefines) {
            return;
        }
        this.additionalColumnDefines.forEach((acd, i) => {
            this._additionalData.field.push('additional-field-' + i);
            this._additionalData.header.push(acd.header.text);
        });
    }

    private _calculateContentWidth() {
        if (this.contentWidth == 'auto') {
            this._elementRef.nativeElement.querySelectorAll('table').forEach(table => {
                this._renderer.setStyle(table, 'table-layout', 'auto');
            });
            const contentRange = this._elementRef.nativeElement.querySelector('.jigsaw-table-range');
            const contentWidth = contentRange.querySelector('.jigsaw-table-body table').offsetWidth;
            this._renderer.addClass(contentRange, 'jigsaw-table-auto-width');
            this._renderer.setStyle(contentRange, 'width', contentWidth + 'px');
            this._renderer.setStyle(this._floatingHeadElement, 'width', contentWidth + 'px');

            this._elementRef.nativeElement.querySelectorAll('table').forEach(table => {
                this._renderer.setStyle(table, 'table-layout', 'fixed');
            });
        }
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this._$selectRow(this.selectedRow, true);
        this._calculateContentWidth();
    }

    ngOnInit() {
        super.ngOnInit();

        this._mixInColumns();
        this._initAdditionalData();
        if (this._data.field && this._data.field.length != 0) {
            this._update();
        }

        this._addWindowListener();

        this._renderer.setStyle(this._elementRef.nativeElement.querySelector('.jigsaw-table-body'),
            'max-height', this._maxHeight);
        this._floatingHeadElement = this._elementRef.nativeElement.querySelector(".jigsaw-table-header");
    }

    ngOnDestroy() {
        if (this._removeTableDataRefresh) {
            this._removeTableDataRefresh();
            this._removeTableDataRefresh = null;
        }
        if (this._removeAdditionalDataRefresh) {
            this._removeAdditionalDataRefresh();
            this._removeAdditionalDataRefresh = null;
        }
        this._removeWindowListener();

        this._data = null;
        this._headerSettingsBackup = null;
        this._cellSettingsBackup = null;
        this._columnDefines = null;
        this._additionalColumnDefines = null;
        this._$cellSettings = null;
        this._$headerSettings = null;
        this._floatingHeadElement = null;
        this._rowElementRefs = null;
        this._headerComponents = null;
    }
}

@NgModule({
    declarations: [JigsawTable, JigsawTableCellInternalComponent, JigsawTableHeaderInternalComponent],
    imports: [CommonModule, JigsawCommonModule, JigsawTableRendererModule],
    exports: [JigsawTable, JigsawTableCellInternalComponent, JigsawTableHeaderInternalComponent],
    entryComponents: [TableCellTextEditorRenderer, DefaultCellRenderer]
})
export class JigsawTableModule {
}
