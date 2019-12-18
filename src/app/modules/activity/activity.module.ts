import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SleepPipe } from './pipes/sleep.pipe'
import { PhysicalActivitiesService } from './services/physical.activities.service'
import { SleepService } from './services/sleep.service'
import { StepsComponent } from './steps/steps.component'
import { TimeSeriesPipe } from './pipes/time.series.pipe'
import { CaloriesComponent } from './calories/calories.component'
import { ViewTimestampComponent } from './view.timestamp/view.timestamp.component'
import { ActivesMinutesComponent } from './actives.minutes/actives.minutes.component'
import { DistanceComponent } from './distance/distance.component'
import { HeartRateComponent } from './heart.rate/heart.rate.component'
import { TimeSeriesService } from './services/time.series.service'
import { TranslateModule } from '@ngx-translate/core'
import { SleepComponent } from './sleep/sleep.component'
import { SharedModule } from '../../shared/shared.module'
import { NgxEchartsModule } from 'ngx-echarts'
import {
    MatCheckboxModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSlideToggleModule
} from '@angular/material'
import { SatDatepickerModule } from 'saturn-datepicker'
import { FormsModule } from '@angular/forms'
import { Ng5SliderModule } from 'ng5-slider'
import { MeasurementModule } from '../measurement/measurement.module'

@NgModule({
    declarations: [
        ActivesMinutesComponent,
        CaloriesComponent,
        DistanceComponent,
        HeartRateComponent,
        StepsComponent,
        ViewTimestampComponent,
        SleepComponent,
        SleepPipe,
        TimeSeriesPipe
    ],
    exports: [
        ActivesMinutesComponent,
        CaloriesComponent,
        DistanceComponent,
        HeartRateComponent,
        StepsComponent,
        ViewTimestampComponent,
        SleepComponent,
        SleepPipe,
        TimeSeriesPipe
    ],
    providers: [
        SleepPipe,
        TimeSeriesPipe,
        PhysicalActivitiesService,
        SleepService,
        TimeSeriesService
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        MeasurementModule,

        MatExpansionModule,
        MatSlideToggleModule,
        NgxEchartsModule,
        TranslateModule,
        MatDatepickerModule,
        SatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatPaginatorModule,
        Ng5SliderModule
    ]
})
export class ActivityModule {
}
