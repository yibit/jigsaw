import {Component, NgModule} from "@angular/core";

@Component({
    template: 'hello ffffffffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaa ',
    selector: 'my-comp1'
})
export class MyComponent {

}

@NgModule({
    declarations: [
        MyComponent
    ],
    exports: [
        MyComponent
    ],
    providers: [],
    entryComponents: []
})
export class MyModule {
}

