import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NgxEchartsModule } from 'ngx-echarts';
import { TranslateModule } from '@ngx-translate/core';
import { SatDatepickerModule } from 'saturn-datepicker';
import { MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatPaginatorModule } from '@angular/material';

import { MeasurementComponent } from './measurement.component/measurement.component';
import { MeasurementService } from './services/measurement.service';
import { WeightComponent } from './weight/weight.component';
import { HeightComponent } from './height/height.component';
import { WaistCircumferenceComponent } from './waist.circunference/waist.circumference.component';
import { BodyTemperatureComponent } from './body.temperature/body.temperature.component';
import { BloodGlucoseComponent } from './blood.glucose/blood.glucose.component';
import { BloodPressureComponent } from './blood.pressure/blood.pressure.component';
import { HeartRateComponent } from './heart.rate/heart.rate.component';
import { MealPipe } from './pipes/meal.pipe';
import { FatComponent } from './fat/fat.component';
import { DeviceTypePipe } from './pipes/device.type.pipe';
import { DeviceComponent } from './device/device.component';
import { DeviceService } from './services/device.service';
import { DecimalFormatterPipe } from './pipes/decimal.formatter.pipe';
import { MeasurementCardComponent } from './measurement.card/measurement.card.component';
import { MeasurementLogsComponent } from './measurement.logs/measurement.logs.component';
import { MeasurementTypePipe } from './pipes/measurement.type.pipe';
import { SharedModule } from '../../shared/shared.module'
import { Ng5SliderModule } from 'ng5-slider'
import { SleepComponent } from './sleep/sleep.component';
import { SleepPipe } from './pipes/sleep.pipe'
import { ViewMeasurementsComponent } from './view.measurements/view.measurements.component';
import { StepsComponent } from './steps/steps.component';
import { TimeSeriesPipe } from './pipes/time.series.pipe';
import { CaloriesComponent } from './calories/calories.component';
import { ViewTimestampComponent } from './view.timestamp/view.timestamp.component';
import { ActivesMinutesComponent } from './actives.minutes/actives.minutes.component';
import { DistanceComponent } from './distance/distance.component'

@NgModule({
    declarations: [
        MeasurementComponent,
        WeightComponent,
        HeightComponent,
        WaistCircumferenceComponent,
        BodyTemperatureComponent,
        BloodGlucoseComponent,
        BloodPressureComponent,
        HeartRateComponent,
        SleepComponent,
        ViewMeasurementsComponent,
        MealPipe,
        DeviceTypePipe,
        FatComponent,
        DeviceComponent,
        DecimalFormatterPipe,
        MeasurementCardComponent,
        MeasurementLogsComponent,
        MeasurementTypePipe,
        SleepPipe,
        StepsComponent,
        TimeSeriesPipe,
        CaloriesComponent,
        ViewTimestampComponent,
        ActivesMinutesComponent,
        DistanceComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,

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
    ],
    exports: [
        MeasurementComponent,
        MeasurementLogsComponent,
        DeviceComponent,
        MealPipe,
        WeightComponent,
        HeightComponent,
        WaistCircumferenceComponent,
        BodyTemperatureComponent,
        BloodGlucoseComponent,
        BloodPressureComponent,
        HeartRateComponent,
        FatComponent,
        SleepComponent,
        ViewMeasurementsComponent,
        StepsComponent,
        CaloriesComponent,
        ActivesMinutesComponent,
        DistanceComponent,
        ViewTimestampComponent,
        DecimalFormatterPipe,
        MeasurementTypePipe,
        SleepPipe,
        TimeSeriesPipe
    ],
    providers: [
        MeasurementService,
        DeviceService,
        DatePipe,
        MealPipe,
        DeviceTypePipe,
        DecimalFormatterPipe,
        SleepPipe
    ]
})
export class MeasurementModule {
}
