import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {TranslateModule, TranslateService as TS} from "@ngx-translate/core";
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateService} from "@ngx-translate/core/src/translate.service";
import {JigsawModule} from '@rdkmaster/jigsaw';
import {MyModule} from '@awade/basics';

import {AppComponent} from './app.component';
import {NewComp2, NewComp1,} from "./new-comp";

console.log('fffffffffffff', TS === TranslateService);

@NgModule({
    declarations: [
        AppComponent, NewComp2, NewComp1
    ],
    imports: [
        BrowserModule, FormsModule, BrowserAnimationsModule,
        JigsawModule, TranslateModule.forRoot(), MyModule
    ],
    providers: [TranslateService],
    bootstrap: [AppComponent],
    entryComponents: []
})
export class AppModule {
    constructor(translateService: TranslateService) {
        translateService.setTranslation('zh', {
            'get-started': '马上开始',
            'give-star': '给 Jigsaw 点个星星'
        });
        translateService.setTranslation('en', {
            'get-started': 'Get started',
            'give-star': 'Give us a star on Github.com'
        });

        const lang: string = translateService.getBrowserLang();
        translateService.setDefaultLang(lang);
        translateService.use(lang);
    }
}