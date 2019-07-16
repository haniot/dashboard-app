import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {MeasurementComponentComponent} from './measurement-component/measurement-component.component';
import {SharedModule} from 'app/shared/shared.module';
import {MeasurementService} from './services/measurement.service';
import {WeightComponent} from './weight/weight.component';
import {HeightComponent} from './height/height.component';
import {WaistCircunferenceComponent} from './waist-circunference/waist-circunference.component';
import {BodyTemperatureComponent} from './body-temperature/body-temperature.component';
import {BloodGlucoseComponent} from './blood-glucose/blood-glucose.component';
import {BloodPressureComponent} from './blood-pressure/blood-pressure.component';
import {HeartRateComponent} from './heart-rate/heart-rate.component';
import {MealPipe} from './pipes/meal.pipe';
import {FatComponent} from './fat/fat.component';
import {DeviceTypePipe} from './pipes/device-type.pipe';
import {DeviceComponent} from './device/device.component';
import {DeviceService} from './services/device.service';
import {DecimalFormatterPipe} from './pipes/decimal-formatter.pipe';
import {TranslateModule} from "@ngx-translate/core";
import {MeasurementCardComponent} from './measurement-card/measurement-card.component';
import {MatDatepickerModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule} from "saturn-datepicker";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {NgxEchartsModule} from "ngx-echarts";

@NgModule({
    declarations: [
        MeasurementComponentComponent,
        WeightComponent,
        HeightComponent,
        WaistCircunferenceComponent,
        BodyTemperatureComponent,
        BloodGlucoseComponent,
        BloodPressureComponent,
        HeartRateComponent,
        MealPipe,
        DeviceTypePipe,
        FatComponent,
        DeviceComponent,
        DecimalFormatterPipe,
        MeasurementCardComponent
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
        MatInputModule
    ],
    exports: [
        MeasurementComponentComponent,
        DeviceComponent,
        MealPipe,
        WeightComponent,
        HeightComponent,
        WaistCircunferenceComponent,
        BodyTemperatureComponent,
        BloodGlucoseComponent,
        BloodPressureComponent,
        HeartRateComponent,
        FatComponent,
        DecimalFormatterPipe
    ],
    providers: [
        MeasurementService,
        DeviceService,
        DatePipe,
        MealPipe,
        DeviceTypePipe,
        DecimalFormatterPipe,
        MatDatepickerModule,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    ]
})
export class MeasurementModule {
}
