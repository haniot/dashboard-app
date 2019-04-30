import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthAreaPipe } from './pipes/health-area.pipe';
import { GenderPipe } from './pipes/gender.pipe';
import { MyDatePipe } from './pipes/my-date.pipe';

@NgModule({
  declarations: [
    HealthAreaPipe,
    GenderPipe,
    MyDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HealthAreaPipe,
    GenderPipe,
    MyDatePipe
  ]
})
export class SharedPipesModule { }
