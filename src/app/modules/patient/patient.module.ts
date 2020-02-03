import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule, MatIconModule, MatTabsModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { PatientFormComponent } from './patient.form/patient.form.component';
import { PatientTableComponent } from './patient.table/patient.table.component';
import { PatientComponent } from './patient.component/patient.component';
import { PatientRoutingModule } from './patient.routing/patient.routing.module';
import { ListPilotstudiesComponent } from './list.pilotstudies/list.pilotstudies.component';
import { HabitsModule } from '../habits/habits.module';
import { MeasurementModule } from '../measurement/measurement.module';
import { PatientManagerComponent } from './patient.manager/patient.manager.component';
import { SharedModule } from '../../shared/shared.module'
import { PatientConfigComponent } from './configurations/configurations.component'
import { PatientMypilotstudiesComponent } from './mypilotstudies/mypilotstudies.component'
import { SettingsModule } from '../settings/settings.module'
import { PatientMyEvaluationsComponent } from './myevaluations/myevaluations.component'
import { NgxEchartsModule } from 'ngx-echarts';
import { ViewResourcesComponent } from './view.resources/view.resources.component';
import { ActivityModule } from '../activity/activity.module';
import { PatientQuestionnairesComponent } from './patient.questionnaires/patient.questionnaires.component';
import { PatientDashboardComponent } from './patient.dashboard/patient.dashboard.component';
import { PatientMeasurementsComponent } from './patient.measurements/patient.measurements.component'

@NgModule({
    declarations: [
        PatientConfigComponent,
        PatientMyEvaluationsComponent,
        PatientMypilotstudiesComponent,
        PatientFormComponent,
        PatientTableComponent,
        PatientComponent,
        ListPilotstudiesComponent,
        PatientManagerComponent,
        ViewResourcesComponent,
        PatientQuestionnairesComponent,
        PatientDashboardComponent,
        PatientMeasurementsComponent
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
        NgxEchartsModule,
        MatCheckboxModule,
        MatIconModule,

        PatientRoutingModule,
        HabitsModule,
        MeasurementModule,
        ActivityModule,
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
