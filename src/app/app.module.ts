import {enableProdMode, LOCALE_ID, NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {CommonModule, registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {ToastrModule} from 'ngx-toastr';

import {AppComponent} from './app.component';
import {SecurityModule} from './security/security.module';
import {CoreModule} from './core/core.module';
import {ModulesModule} from './modules/modules.module';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './core/app-routing/app-routing.module';
import {SelectPilotStudyService} from "./shared/shared-components/select-pilotstudy/service/select-pilot-study.service";
import {environment} from "../environments/environment";

registerLocaleData(localePt, 'pt-BR', localePtExtra);

if (environment.production) {
    enableProdMode();
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        HttpClientModule,
        RouterModule,

        ToastrModule.forRoot(),

        SecurityModule,
        CoreModule,
        SharedModule,
        ModulesModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        {provide: LOCALE_ID, useValue: "pt-BR"},
        {provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}},
        SelectPilotStudyService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}


