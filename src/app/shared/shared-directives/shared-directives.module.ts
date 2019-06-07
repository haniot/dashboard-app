import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { echartsDirective } from './echarts.directive';

@NgModule({
  declarations: [
    echartsDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [ echartsDirective]
})
export class SharedDirectivesModule { }
