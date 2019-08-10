import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SatDatepickerModule } from 'saturn-datepicker';
import { TranslateModule } from '@ngx-translate/core';

import { PilotStudyFormComponent } from './pilot.study.form/pilot.study.form.component';
import { SharedModule } from 'app/shared/shared.module';
import { PilotStudyService } from './services/pilot.study.service';
import { PilotStudyTableComponent } from './pilot.study.table/pilot.study.table.component';
import { PilotStudyComponent } from './pilot.study.component/pilot.study.component';
import { PilotStudyRoutingModule } from './pilot.study.routing/pilot.study.routing.module';
import { ViewHealthProfessionalComponent } from './view.health.professional/view.health.professional.component';
import { PilotStudyViewComponent } from './pilot.study.view/pilot.study.view.component';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { PilotStudyFilesComponent } from './pilot.study.files/pilot.study.files.component';
import { MeasurementModule } from '../measurement/measurement.module'
import { MatCheckboxModule, MatExpansionModule, MatStepperModule } from '@angular/material'
import { HabitsModule } from '../habits/habits.module'


@NgModule({
    declarations: [
        PilotStudyFormComponent,
        PilotStudyTableComponent,
        PilotStudyComponent,
        ViewHealthProfessionalComponent,
        PilotStudyViewComponent,
        PilotStudyFilesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        MatPaginatorModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        SatDatepickerModule,
        TranslateModule,

        SharedModule,
        PilotStudyRoutingModule,
        EvaluationModule,
        MeasurementModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatStepperModule,
        HabitsModule
    ],
    providers: [
        PilotStudyService
    ]
})
export class PilotStudyModule {
}
