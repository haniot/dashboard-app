import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MeasurementComponentComponent } from './measurement-component/measurement-component.component';
import { SharedModule } from 'app/shared/shared.module';
import { MeasurementService } from './services/measurement.service';
import { WeightComponent } from './weight/weight.component';
import { HeightComponent } from './height/height.component';
import { WaistCircunferenceComponent } from './waist-circunference/waist-circunference.component';
import { BodyTemperatureComponent } from './body-temperature/body-temperature.component';
import { BloodGlucoseComponent } from './blood-glucose/blood-glucose.component';

@NgModule({
  declarations: [
    MeasurementComponentComponent,
    WeightComponent,
    HeightComponent,
    WaistCircunferenceComponent,
    BodyTemperatureComponent,
    BloodGlucoseComponent
  ],
  imports: [
    CommonModule,    
    SharedModule,
  ],
  exports: [
    MeasurementComponentComponent
  ],
  providers: [
    MeasurementService,
    DatePipe
  ]
})
export class MeasurementModule { }
