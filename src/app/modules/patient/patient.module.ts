import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { PatientFormComponent } from './patient.form/patient.form.component';
import { PatientTableComponent } from './patient.table/patient.table.component';
import { PatientComponent } from './patient.component/patient.component';

import { PatientRoutingModule } from './patient.routing/patient.routing.module';
import { ListPilotstudiesComponent } from './list.pilotstudies/list.pilotstudies.component';
import { ViewHabitsComponent } from './view.habits/view.habits.component';
import { HabitsModule } from '../habits/habits.module';
import { MeasurementModule } from '../measurement/measurement.module';
import { PatientManagerComponent } from './patient.manager/patient.manager.component';
import { SharedModule } from '../../shared/shared.module'
import { PatientConfigComponent } from './configurations/configurations.component'
import { PatientMypilotstudiesComponent } from './mypilotstudies/mypilotstudies.component'
import { SettingsModule } from '../settings/settings.module'
import { PatientMyEvaluationsComponent } from './myevaluations/myevaluations.component'

@NgModule({
    declarations: [
        PatientConfigComponent,
        PatientMyEvaluationsComponent,
        PatientMypilotstudiesComponent,
        PatientFormComponent,
        PatientTableComponent,
        PatientComponent,
        ListPilotstudiesComponent,
        ViewHabitsComponent,
        PatientManagerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,

        MatPaginatorModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatTabsModule,
        TranslateModule,

        PatientRoutingModule,
        HabitsModule,
        MeasurementModule,
        SettingsModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
    ],
    exports: [
        PatientTableComponent,
        ListPilotstudiesComponent
    ]
})
export class PatientModule {
}
