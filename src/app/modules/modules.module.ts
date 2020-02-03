import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { PaginatorIntlService } from './config.matpaginator';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        PaginatorIntlService,
        {
            provide: MatPaginatorIntl,
            useFactory: (translate) => {
                const service = new PaginatorIntlService();
                service.injectTranslateService(translate);
                return service;
            },
            deps: [TranslateService]
        }
    ],
    declarations: []
})
export class ModulesModule {
}
