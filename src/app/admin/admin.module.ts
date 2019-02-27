import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../template/components.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing/admin-routing.module';
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
import { CardTopComponent } from '../shared/card-top/card-top.component';
import { HaniotTableComponent } from '../shared/haniot-table/haniot-table.component';
import { CaregiverComponent } from './caregiver/caregiver.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CaregiverService } from './caregiver/caregiver.service';

import {ToastModule} from 'ng2-toastr/ng2-toastr';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    CommonModule,
    AdminRoutingModule,
    DataTablesModule,
    ComponentsModule,
    NgbModule.forRoot(),
    ToastModule.forRoot() 
    
  ],
  exports: [
    AdminComponent
  ],
  declarations: [
    AdminComponent,
    DashboardComponent,
    CardTopComponent,
    HaniotCardComponent,
    echartsDirective,
    PatientsComponent,
    GlucoseGraphComponent,
    LineGraphComponent,
    AreaGraphComponent,
    BarGraphComponent,
    ScatterGraphComponent,
    HaniotTableComponent,
    CaregiverComponent
    

  ], 
  providers:[
    UsersService,
    CaregiverService
  ]
})
export class AdminModule { }
