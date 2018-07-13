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
import { HaniotEasyTableComponent } from '../shared/haniot-easy-table/haniot-easy-table.component';
import { HaniotCardComponent } from '../shared/haniot-card/haniot-card.component';

import { UserDetailsComponent } from '../shared/user-details/user-details.component';


import { MaterialDialogComponent } from '../shared//material-dialog/material-dialog.component';

import { echartsDirective } from '../directives/echarts';
import { PatientsComponent } from './patients/patients.component';
import { DataTablesModule } from 'angular-datatables';
import {MatTableModule} from '@angular/material';
import {TableModule} from 'ngx-easy-table';




import { UsersService } from '../services/users.service';
import { MeasurementService } from '../services/measurements.service';
import { ConfigService } from '../services/easy-table.service';



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
    HaniotCardComponent,
    echartsDirective,
    PatientsComponent,
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
