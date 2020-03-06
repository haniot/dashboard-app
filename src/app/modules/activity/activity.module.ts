import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SleepPipe } from './pipes/sleep.pipe'
import { PhysicalActivitiesService } from './services/physical.activities.service'
import { SleepService } from './services/sleep.service'
import { StepsComponent } from './steps/steps.component'
import { TimeSeriesPipe } from './pipes/time.series.pipe'
import { CaloriesComponent } from './calories/calories.component'
import { ViewTimeSeriesComponent } from './view.time.series/view.time.series.component'
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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTabsModule
} from '@angular/material'
import { SatDatepickerModule } from 'saturn-datepicker'
import { FormsModule } from '@angular/forms'
import { ActivityDetailsComponent } from './activity.details/activity.details.component'
import { ActivityRoutingModule } from './activity.routing/activity.routing.module';
import { ActivityDashboardComponent } from './activity.dashboard/activity.dashboard.component';
import { ActivityLevelPipe } from './pipes/activity.level.pipe';
import { MillisecondPipe } from './pipes/millisecond.pipe'
import { NgxGaugeModule } from 'ngx-gauge';
import { ActivityListComponent } from './activity.list/activity.list.component';
import { SleepListComponent } from './sleep.list/sleep.list.component';
import { DistancePipe } from './pipes/distance.pipe';
import { ActiveMinutesPipe } from './pipes/active.minutes.pipe';
import { DurationPipe } from './pipes/duration.pipe';

@NgModule({
    declarations: [
        ActivesMinutesComponent,
        CaloriesComponent,
        DistanceComponent,
        HeartRateComponent,
        StepsComponent,
        ViewTimeSeriesComponent,
        SleepComponent,
        SleepPipe,
        TimeSeriesPipe,
        ActivityDetailsComponent,
        ActivityDashboardComponent,
        ActivityLevelPipe,
        MillisecondPipe,
        ActivityListComponent,
        SleepListComponent,
        DistancePipe,
        ActiveMinutesPipe,
        DurationPipe
    ],
    exports: [
        ActivityDashboardComponent,
        ActivesMinutesComponent,
        CaloriesComponent,
        DistanceComponent,
        HeartRateComponent,
        StepsComponent,
        ViewTimeSeriesComponent,
        SleepComponent,
        SleepPipe,
        TimeSeriesPipe,
        ActivityLevelPipe,
        DistancePipe,
        ActiveMinutesPipe,
        DurationPipe
    ],
    providers: [
        SleepPipe,
        TimeSeriesPipe,
        PhysicalActivitiesService,
        SleepService,
        TimeSeriesService,
        MillisecondPipe,
        DistancePipe,
        ActiveMinutesPipe,
        DurationPipe
    ],
    imports: [
        CommonModule,
        FormsModule,

        ActivityRoutingModule,
        SharedModule,

        NgxEchartsModule,
        TranslateModule,
        SatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTabsModule,
        MatIconModule,
        NgxGaugeModule
    ]
})
export class ActivityModule {
}
