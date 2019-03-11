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
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { echartsDirective } from '../directives/echarts';
import { AdministratorsComponent } from './administrators/administrators.component';
import { DataTablesModule } from 'angular-datatables';

import { LineGraphComponent } from '../shared/line-graph/line-graph.component';
import { AreaGraphComponent } from '../shared/area-graph/area-graph.component';
import { BarGraphComponent } from '../shared/bar-graph/bar-graph.component';
import { ScatterGraphComponent } from '../shared/scatter-graph/scatter-graph.component';
import { CardTopComponent } from '../shared/card-top/card-top.component';
import { HaniotTableComponent } from '../shared/haniot-table/haniot-table.component';
import { CaregiverComponent } from './caregiver/caregiver.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/users.service';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { ModalUserEditComponent } from './modal-user-edit/modal-user-edit.component';
import { MyprofileComponent } from './myprofile/myprofile.component';


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
    MatSlideToggleModule
    
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
    AdministratorsComponent,
    GlucoseGraphComponent,
    LineGraphComponent,
    AreaGraphComponent,
    BarGraphComponent,
    ScatterGraphComponent,
    HaniotTableComponent,
    CaregiverComponent,
    ModalUserComponent,
    ModalUserEditComponent,
    MyprofileComponent
    

  ], 
  providers:[
    UserService
  ]
})
export class AdminModule { }
