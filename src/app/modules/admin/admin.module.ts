import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {TemplateModule} from 'app/core/template/template.module';
import {AdministratorsComponent} from './administrators/administrators.component';
import {HealthProfessionalComponent} from './health.professionals/health.professionals.component';
import {ModalUserComponent} from './modal.user/modal.user.component';
import {AdminConfigurationsComponent} from './configurations/configurations.component';
import {AdminService} from './services/admin.service';
import {HealthProfessionalService} from './services/health.professional.service';
import {UserService} from './services/users.service';
import {SharedModule} from 'app/shared/shared.module';
import {MatNativeDateModule, MatTableModule} from '@angular/material';
import {EvaluationModule} from "../evaluation/evaluation.module";
import { SettingsModule } from '../settings/settings.module';
import { AdminRoutingModule } from './admin.routing/admin.routing.module'
import { HaniotTableComponent } from './haniot.table/haniot.table.component'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        AdminRoutingModule,
        TemplateModule,
        SharedModule,
        EvaluationModule,
        SettingsModule,

        MatPaginatorModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        MatTableModule
    ],
    declarations: [
        AdministratorsComponent,
        HealthProfessionalComponent,
        ModalUserComponent,
        AdminConfigurationsComponent,
        HaniotTableComponent,

    ],
    providers: [
        UserService,
        AdminService,
        HealthProfessionalService
    ]
})
export class AdminModule {
}
