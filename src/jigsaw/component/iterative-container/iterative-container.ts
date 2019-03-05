import {Component, Injector, Input, NgIterable, Type} from "@angular/core";
import {IDynamicInstantiatable} from "../common";

export class InitData {
    iterator: any;
    index: number;
}

@Component({
    selector: 'awade-iterative-container',
    template: `
        <div>
            <ng-container *ngFor="let item of data; let idx = index;">
                <ng-container *ngComponentOutlet="iterateWith; injector: createInjector(item, idx)">
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

    constructor(private _injector: Injector) {
    }

    public createInjector(iterator: any, index: number): Injector {
        const provider = {provide: InitData, useValue: {iterator, index}};
        return Injector.create({providers: [provider], parent: this._injector});
    }
}
