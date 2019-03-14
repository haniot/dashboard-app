import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTopComponent } from './card-top/card-top.component';
import { HaniotCardComponent } from './haniot-card/haniot-card.component';
import { HaniotTableComponent } from './haniot-table/haniot-table.component';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';

@NgModule({
  declarations: [
    CardTopComponent,
    HaniotCardComponent,
    HaniotTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    SharedPipesModule
  ],
  exports: [
    CardTopComponent,
    HaniotCardComponent,
    HaniotTableComponent
  ]
})
export class SharedComponentsModule { }
