import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthAreaPipe } from './pipes/health-area.pipe';

@NgModule({
  declarations: [
    HealthAreaPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HealthAreaPipe
  ]
})
export class SharedPipesModule { }
