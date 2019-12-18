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
import { ViewMeasurementsComponent } from './view.measurements/view.measurements.component';

@NgModule({
    declarations: [
        MeasurementComponent,
        WeightComponent,
        HeightComponent,
        WaistCircumferenceComponent,
        BodyTemperatureComponent,
        BloodGlucoseComponent,
        BloodPressureComponent,
        ViewMeasurementsComponent,
        MealPipe,
        DeviceTypePipe,
        FatComponent,
        DeviceComponent,
        DecimalFormatterPipe,
        MeasurementCardComponent,
        MeasurementLogsComponent,
        MeasurementTypePipe
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
        FatComponent,
        ViewMeasurementsComponent,
        DecimalFormatterPipe,
        MeasurementTypePipe,
        MeasurementCardComponent
    ],
    providers: [
        MeasurementService,
        DeviceService,
        DatePipe,
        MealPipe,
        DeviceTypePipe,
        DecimalFormatterPipe
    ]
})
export class MeasurementModule {
}
