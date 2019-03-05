import {Component, Injector, Input, NgIterable, Type} from "@angular/core";
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
export class IterativeContainerComponent {
    @Input()
    public data: NgIterable<any>;
    @Input()
    public iterateWith: Type<IDynamicInstantiatable>;
    @Input()
    public trackItemBy: string | string[];

    constructor(private _injector: Injector) {
    }

    public createInjector(it: any, index: number, odd: boolean, even: boolean, first: boolean, last: boolean): Injector {
        const provider = {provide: InitData, useValue: {it, index, odd, even, first, last}};
        return Injector.create({providers: [provider], parent: this._injector});
    }
}
