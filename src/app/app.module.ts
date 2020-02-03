import { enableProdMode, LOCALE_ID, NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CommonModule, DecimalPipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';

import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { SecurityModule } from './security/security.module';
import { CoreModule } from './core/core.module';
import { ModulesModule } from './modules/modules.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './core/app.routing/app.routing.module';
import { SelectPilotStudyService } from './shared/shared.components/select.pilotstudy/service/select.pilot.study.service';
import { environment } from '../environments/environment';
import { LanguagesConfiguration } from '../assets/i18n/config.js';
import { DashboardService } from './modules/dashboard/services/dashboard.service';
import { LocalStorageService } from './shared/shared.services/local.storage.service'

const languagesConfig = LanguagesConfiguration;

registerLocaleData(localePt, 'pt-BR', localePtExtra);

if (environment.production) {
    enableProdMode();
}

export class DynamicLocaleId extends String {
    constructor(protected service: TranslateService) {
        super('');
    }

    toString() {
        return this.service.currentLang;
    }
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule,

        ToastrModule.forRoot({
            timeOut: 10000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            closeButton: true
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),

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
        { provide: LOCALE_ID, useClass: DynamicLocaleId, deps: [TranslateService] },
        { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
        SelectPilotStudyService,
        DashboardService,
        DecimalPipe,
        LocalStorageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(public translate: TranslateService) {
        this.configLanguage();
    }

    configLanguage(): void {
        const languages = Object.keys(languagesConfig)

        this.translate.addLangs(languages);
        this.translate.setDefaultLang('pt-BR');

        const browserLang = this.translate.getBrowserLang();

        languages.forEach(language => {
            if (language.match(browserLang) && language.match(browserLang).length) {
                return this.translate.use(language);
            }
        })

    }
}


