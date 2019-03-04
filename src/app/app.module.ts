import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {JigsawRootModule} from "jigsaw/component/root/root";
import {AppComponent, CompleteComponent1,CompleteComponent2, CompleteComponentP} from './app.component';
import {AjaxInterceptor} from './app.interceptor';
import {DemoListComponent} from "./demo-list.component";
import {routerConfig} from "./router-config";
import {IterativeContainerComponent} from "../jigsaw/component/iterative-container/iterative-container";
import {JigsawModule} from "../jigsaw/module";

{
    (<any[]>routerConfig).push(
        {path: '', component: DemoListComponent},
        {path: '**', redirectTo: ''}
    );
}

@NgModule({
    declarations: [
        AppComponent, DemoListComponent, CompleteComponent1,CompleteComponent2,
        IterativeContainerComponent, CompleteComponentP
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, HttpClientModule, JigsawModule,
        RouterModule.forRoot(routerConfig),
        JigsawRootModule
    ],
    entryComponents: [CompleteComponent1,CompleteComponent2,CompleteComponentP],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AjaxInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
