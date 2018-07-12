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
import { TableMaterialComponent } from '../shared/table-material/table-material.component';
import { HaniotEasyTableComponent } from '../shared/haniot-easy-table/haniot-easy-table.component';
import { HaniotCardComponent } from '../shared/haniot-card/haniot-card.component';

import { UserDetailsComponent } from '../shared/user-details/user-details.component';


import { MaterialDialogComponent } from '../shared//material-dialog/material-dialog.component';

import { HaniotTableRowComponent } from '../shared/haniot-table-row/haniot-table-row.component';
import { echartsDirective } from '../directives/echarts';
import { PatientsComponent } from './patients/patients.component';
import { DataTablesModule } from 'angular-datatables';
import {MatTableModule} from '@angular/material';
import {TableModule} from 'ngx-easy-table';




import { UsersService } from '../services/users.service';
import { MeasurementService } from '../services/measurements.service';
import { ConfigService } from '../services/easy-table.service';
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
    ComponentsModule,
    MatTableModule,
    TableModule
    
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
    TableMaterialComponent,
    echartsDirective,
    PatientsComponent,
    MeasurementsComponent,
    HaniotEasyTableComponent,
    MaterialDialogComponent,
    UserDetailsComponent
  ], 
  providers:[
    UsersService,
    MeasurementService,
    ConfigService

  ]
})
export class AdminModule { }
