import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../template/components.module';
import { AdminComponent } from './admin.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing/admin-routing.module';
import { MatButtonModule, MatRippleModule, MatInputModule, MatTooltipModule } from '@angular/material';
import { UsersComponent } from './users/users.component';
import { HaniotTableComponent } from '../shared/haniot-table/haniot-table.component';
import { HaniotCardComponent } from '../shared/haniot-card/haniot-card.component';

import { HaniotTableRowComponent } from '../shared/haniot-table-row/haniot-table-row.component';
import { echartsDirective } from '../directives/echarts';
import { PatientsComponent } from './patients/patients.component';
import { DataTablesModule } from 'angular-datatables';


import { UsersService } from '../services/users.service';
import { MeasurementService } from '../services/measurements.service';
import { MeasurementsComponent } from './measurements/measurements.component';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
    AdminRoutingModule,
    DataTablesModule,
    ComponentsModule
  ],
  exports: [
    AdminComponent
  ],
  declarations: [
    AdminComponent,
    DashboardComponent,
    UserProfileComponent,
    UsersComponent,
    HaniotTableComponent,
    HaniotTableRowComponent,
    HaniotCardComponent,
    echartsDirective,
    PatientsComponent,
    MeasurementsComponent
  ], 
  providers:[
    UsersService,
    MeasurementService

  ]
})
export class AdminModule { }
