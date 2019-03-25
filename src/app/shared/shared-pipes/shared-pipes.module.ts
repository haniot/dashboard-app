import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthAreaPipe } from './pipes/health-area.pipe';
import { GenderPipe } from './pipes/gender.pipe';

@NgModule({
  declarations: [
    HealthAreaPipe,
    GenderPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HealthAreaPipe,
    GenderPipe
  ]
})
export class SharedPipesModule { }
