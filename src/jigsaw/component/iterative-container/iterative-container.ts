import {Component, Injector, Input, NgIterable, OnDestroy, Type} from "@angular/core";
import {IDynamicInstantiatable} from "../common";

export class InitData {
    constructor(initData: any) {
        if (!initData) {
            return;
        }
        this.it = initData.it;
        this.index = initData.index;
        this.odd = initData.odd;
        this.even = initData.even;
        this.first = initData.first;
        this.last = initData.last;
    }

    it: any;
    index: number;
    odd: boolean;
    even: boolean;
    first: boolean;
    last: boolean;
}

@Component({
    selector: 'awade-iterative-container',
    template: `
        <div>
            <ng-container *ngFor="
                                let item of data;
                                let index = index;
                                let odd = odd;
                                let even = even;
                                let first = first;
                                let last = last;">
                <ng-container *ngComponentOutlet="iterateWith;
                                injector: createInjector(item, index, odd, even, first, last)">
                </ng-container>
            </ng-container>
        </div>
    `
})
export class IterativeContainerComponent implements OnDestroy {
    @Input()
    public iterateWith: Type<IDynamicInstantiatable>;
    @Input()
    public trackItemBy: string | string[];

    private _injectors: Injector[] = [];
    private _data: NgIterable<any>;

    @Input()
    public get data(): NgIterable<any> {
        return this._data;
    }

    public set data(value: NgIterable<any>) {
        if (value === this._data) {
            return;
        }
        this._injectors.splice(0, Infinity);
        this._data = value;
    }

    constructor(private _injector: Injector) {
    }

    public createInjector(it: any, index: number, odd: boolean, even: boolean, first: boolean, last: boolean): Injector {
        if (!!this._injectors[index]) {
            return this._injectors[index];
        }

        const useValue: any = {it, index, odd, even, first, last};
        const injector = Injector.create({
            providers: [{provide: InitData, useValue: useValue}],
            parent: this._injector
        });
        this._injectors[index] = injector;
        return injector;
    }

    ngOnDestroy() {
        this._injectors.splice(0, Infinity);
    }
}
