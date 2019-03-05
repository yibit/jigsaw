import {Component, ViewEncapsulation} from "@angular/core";
import {InitData} from "../jigsaw/component/iterative-container/iterative-container";
import {IDynamicInstantiatable} from "../jigsaw/component/common";

@Component({
    selector: 'complete-component',
    template: `CompleteComponent2:
    <jigsaw-input [placeholder]="it + '@' + index + '@' + odd"></jigsaw-input>`
})
export class CompleteComponent2 extends InitData implements IDynamicInstantiatable {
    constructor(public initData: InitData) {
        super(initData);
        console.log(this.initData);
    }

    onClick() {
        alert(this.it)
    }
}
@Component({
    selector: 'complete-component',
    template: `
        CompleteComponent1:<br>
        <j-combo-select maxWidth="500"
                        [clearable]="true"
                        labelField="enName"
                        [searchable]="true"
                        placeholder="search a country...">
            <ng-template>
                <div style="background-color: #3ab1ea; width: 200px; height: 100px;">
                </div>
            </ng-template>
        </j-combo-select>
        <br>
    `
})
export class CompleteComponent1 extends InitData implements IDynamicInstantiatable {
    constructor(public initData: InitData) {
        super(initData);
    }
}

@Component({
    selector: 'complete-component-p',
    template: `
        <awade-iterative-container [data]="it.list" [iterateWith]="it.child"></awade-iterative-container>
    `
})
export class CompleteComponentP extends InitData implements IDynamicInstantiatable {
    constructor(public initData: InitData) {
        super(initData);
    }
}

@Component({
    selector: 'app-root',
    template: `
        <jigsaw-root>
            <a (click)="changeData()">change data</a> <a (click)="showHide()">showHide</a>
            <div *ngIf="!hidden" class="app-wrap">
                <awade-iterative-container [data]="data" [iterateWith]="iterateWith">
                </awade-iterative-container>
            </div>
        </jigsaw-root>
    `,
    styleUrls: ['./live-demo-wrapper.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    hidden = false;
    data: any = [{list:[11,12,13,14], child: CompleteComponent1}, {list:['21',null,null,33.22], child: CompleteComponent2}];
    iterateWith = CompleteComponentP;

    changeData() {
        this.data = [{list:[111,112,113,114], child: CompleteComponent1}, {list:['1232321',true,true,33.22], child: CompleteComponent2}];
    }

    showHide() {
        this.hidden = !this.hidden;
    }
}

// @Injectable()
// export class Greeter {
//     suffix = '!';
// }
//
// @Component({
//     selector: 'ng-component-outlet-complete-example',
//     template: `
//     <ng-container *ngComponentOutlet="CompleteComponent;
//                                       injector: myInjector;
//                                       content: myContent"></ng-container>`
// })
// export class NgTemplateOutletCompleteExample {
//     // This field is necessary to expose CompleteComponent to the template.
//     CompleteComponent = CompleteComponent;
//     myInjector: Injector;
//
//     myContent = [['aa'], ['Svet']];
//
//     constructor(injector: Injector) {
//         this.myInjector =
//             Injector.create({providers: [{provide: Greeter, deps: []}], parent: injector});
//     }
// }
