import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../template/components.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing/admin-routing.module';

import { HaniotEasyTableComponent } from '../shared/haniot-easy-table/haniot-easy-table.component';
import { HaniotCardComponent } from '../shared/haniot-card/haniot-card.component';

import { GlucoseGraphComponent } from '../shared/glucose-graph/glucose-graph.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { echartsDirective } from '../directives/echarts';
import { PatientsComponent } from './patients/patients.component';
import { DataTablesModule } from 'angular-datatables';

import { UsersService } from '../services/users.service';

import { LineGraphComponent } from '../shared/line-graph/line-graph.component';
import { AreaGraphComponent } from '../shared/area-graph/area-graph.component';
import { BarGraphComponent } from '../shared/bar-graph/bar-graph.component';
import { ScatterGraphComponent } from '../shared/scatter-graph/scatter-graph.component';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    AdminRoutingModule,
    DataTablesModule,
    ComponentsModule,
    NgbModule.forRoot()
    
  ],
  exports: [
    AdminComponent
  ],
  declarations: [
    AdminComponent,
    DashboardComponent,
    HaniotCardComponent,
    echartsDirective,
    PatientsComponent,
    HaniotEasyTableComponent,
    GlucoseGraphComponent,
    LineGraphComponent,
    AreaGraphComponent,
    BarGraphComponent,
    ScatterGraphComponent

  ], 
  providers:[
    UsersService,
  ]
})
export class AdminModule { }
