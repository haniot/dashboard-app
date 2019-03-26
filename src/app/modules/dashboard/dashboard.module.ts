import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard-component/dashboard.component';
import { AreaGraphComponent } from './area-graph/area-graph.component';
import { BarGraphComponent } from './bar-graph/bar-graph.component';
import { GlucoseGraphComponent } from './glucose-graph/glucose-graph.component';
import { LineGraphComponent } from './line-graph/line-graph.component';
import { ScatterGraphComponent } from './scatter-graph/scatter-graph.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    AreaGraphComponent,
    BarGraphComponent,
    GlucoseGraphComponent,
    LineGraphComponent,
    ScatterGraphComponent
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
