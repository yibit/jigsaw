import {Component, ViewEncapsulation} from "@angular/core";
import {InitData} from "../jigsaw/component/iterative-container/iterative-container";
import {IDynamicInstantiatable} from "../jigsaw/component/common";

@Component({
    selector: 'complete-component',
    template: `CompleteComponent2: <jigsaw-button (click)="onClick()">{{$iter}} @ {{$index}}</jigsaw-button>`
})
export class CompleteComponent2 implements IDynamicInstantiatable {
    public $iter: any;
    public $index: number;

    constructor(public initData: InitData) {
        if (this.initData) {
            this.$iter = this.initData.iterator;
            this.$index = this.initData.index;
        }
        console.log(this.initData);
    }

    onClick() {
        alert(this.$iter)
    }
}
@Component({
    selector: 'complete-component',
    template: `CompleteComponent1: {{$iter}} @ {{$index}}`
})
export class CompleteComponent1 implements IDynamicInstantiatable {
    public $iter: any;
    public $index: number;

    constructor(public initData: InitData) {
        if (this.initData) {
            this.$iter = this.initData.iterator;
            this.$index = this.initData.index;
        }
        console.log(this.initData);
    }
}

@Component({
    selector: 'complete-component-p',
    template: `
        <awade-iterative-container [data]="$iter.list" [iterateWith]="$iter.child"></awade-iterative-container>
    `
})
export class CompleteComponentP implements IDynamicInstantiatable {
    public $iter: any;
    public $index: number;

    constructor(public initData: InitData) {
        if (this.initData) {
            this.$iter = this.initData.iterator;
            this.$index = this.initData.index;
        }
        console.log(this.initData);
    }
}

@Component({
    selector: 'app-root',
    template: `
        <jigsaw-root>
            <div class="app-wrap">
                <awade-iterative-container [data]="
                        [{list:[11,12,13,14], child: child1}, {list:[21,22,23,24], child: child2}]
                    " [iterateWith]="iterateWith">
                </awade-iterative-container>
            </div>
        </jigsaw-root>
    `,
    styleUrls: ['./live-demo-wrapper.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    iterateWith = CompleteComponentP;
    child1 = CompleteComponent1;
    child2 = CompleteComponent2;
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
