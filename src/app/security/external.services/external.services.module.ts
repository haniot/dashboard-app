import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalServicesRoutingModule } from './external.services-routing.module';
import { FitbitService } from './services/fitbit.service';
import { ExternalServiceComponent } from './external.service/external.service.component'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { SharedComponentsModule } from '../../shared/shared.components/shared-components.module'
import { FitbitStatusPipe } from './pipes/fitbit.status.pipe'
import { SecurityModule } from '../security.module'
import { EscapeComponent } from './escape/escape.component'
import { TemplateModule } from '../../core/template/template.module'

@NgModule({
    declarations: [
        ExternalServiceComponent,
        EscapeComponent,
        FitbitStatusPipe
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,

        TranslateModule,

        SecurityModule,
        ExternalServicesRoutingModule,
        SharedComponentsModule,
        TemplateModule
    ],
    exports: [
        ExternalServiceComponent,
        FitbitStatusPipe
    ],
    providers: [
        FitbitService,
        FitbitStatusPipe
    ]
})
export class ExternalServicesModule {
}
