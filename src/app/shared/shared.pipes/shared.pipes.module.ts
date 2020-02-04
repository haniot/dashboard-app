import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthAreaPipe } from './pipes/health.area.pipe';
import { GenderPipe } from './pipes/gender.pipe';
import { MyDatePipe } from './pipes/my.date.pipe';
import { ConvertInAgePipe } from './pipes/age.pipe';
import { PilotStudySituationPipe } from './pipes/pilot.study.state.pipe';
import { MatDatepickerModule } from '@angular/material'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import { EvaluationStatustPipe } from './pipes/evaluation.status.pipe'
import { FilterTypePipe } from './pipes/filter.type.pipe'

@NgModule({
    declarations: [
        HealthAreaPipe,
        GenderPipe,
        MyDatePipe,
        ConvertInAgePipe,
        PilotStudySituationPipe,
        EvaluationStatustPipe,
        FilterTypePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        HealthAreaPipe,
        GenderPipe,
        MyDatePipe,
        ConvertInAgePipe,
        PilotStudySituationPipe,
        EvaluationStatustPipe,
        FilterTypePipe
    ],
    providers: [
        MatDatepickerModule,
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
    ]
})
export class SharedPipesModule {
}
