import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';

import { DashboardComponent } from './dashboard-component/dashboard.component';
import { AreaGraphComponent } from './area-graph/area-graph.component';
import { BarGraphComponent } from './bar-graph/bar-graph.component';
import { GlucoseGraphComponent } from './glucose-graph/glucose-graph.component';
import { LineGraphComponent } from './line-graph/line-graph.component';
import { ScatterGraphComponent } from './scatter-graph/scatter-graph.component';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing/dashboard-routing.module';
import { DashboardService } from './services/dashboard.service';
import {MatPaginatorModule} from "@angular/material";
import {ConvertInAgePipe} from "./pipes/age.pipe";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    DashboardRoutingModule,

    MatSelectModule,
    MatPaginatorModule
  ],
  declarations: [
    DashboardComponent,
    AreaGraphComponent,
    BarGraphComponent,
    GlucoseGraphComponent,
    LineGraphComponent,
    ScatterGraphComponent,
    ConvertInAgePipe
  ],
  providers: [DashboardService],
  exports: [
    AreaGraphComponent,
    BarGraphComponent,
    GlucoseGraphComponent,
    LineGraphComponent,
    ScatterGraphComponent,
    ConvertInAgePipe
  ],
})
export class DashboardModule { }
