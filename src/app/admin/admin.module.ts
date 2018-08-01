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

import { HaniotEasyTableComponent } from '../shared/haniot-easy-table/haniot-easy-table.component';
import { HaniotCardComponent } from '../shared/haniot-card/haniot-card.component';

import { UserDetailsComponent } from '../shared/user-details/user-details.component';

import { UserMeasurementsTabsComponent } from '../shared/user-measurements-tabs/user-measurements-tabs.component';

import { MeasurementsDetailsComponent } from '../shared/measurements-details/measurements-details.component';
import { TemperatureGraphComponent } from '../shared/temperature-graph/temperature-graph.component';
import { GlucoseGraphComponent } from '../shared/glucose-graph/glucose-graph.component';

import { MaterialDialogComponent } from '../shared//material-dialog/material-dialog.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { HaniotTableRowComponent } from '../shared/haniot-table-row/haniot-table-row.component';
import { echartsDirective } from '../directives/echarts';
import { PatientsComponent } from './patients/patients.component';
import { DataTablesModule } from 'angular-datatables';
import {MatTableModule} from '@angular/material';
import {TableModule} from 'ngx-easy-table';

//import {SelectModule} from 'ng2-select';

import { NgSelectModule } from '@ng-select/ng-select';

import { UsersService } from '../services/users.service';
import { MeasurementService } from '../services/measurements.service';
import { ConfigService } from '../services/easy-table.service';
import { MeasurementsComponent } from './measurements/measurements.component';
import { DatePickerComponent } from '../shared/date-picker/date-picker.component';
import { LineGraphComponent } from '../shared/line-graph/line-graph.component';
import { AreaGraphComponent } from '../shared/area-graph/area-graph.component';
import { BarGraphComponent } from '../shared/bar-graph/bar-graph.component';
import { PieGraphComponent } from '../shared/pie-graph/pie-graph.component';
import { ScatterGraphComponent } from '../shared/scatter-graph/scatter-graph.component';

import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatePTParserFormatter } from '../services/ngb-date-ptparser-formatter.service';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n, I18n } from '../services/custom-datepicker-i18n.service';

import {MeasurementsFilterService} from '../services/measurements-filter.service';



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
    TableModule,
    //SelectModule,
    NgSelectModule,
    NgbModule.forRoot()
    
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
    MeasurementsComponent,
    HaniotEasyTableComponent,
    MaterialDialogComponent,
    UserDetailsComponent,
    UserMeasurementsTabsComponent,
    MeasurementsDetailsComponent,
    TemperatureGraphComponent,
    GlucoseGraphComponent,
    DatePickerComponent,
    LineGraphComponent,
    AreaGraphComponent,
    BarGraphComponent,
    PieGraphComponent,
    ScatterGraphComponent

  ], 
  providers:[
    [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }],
    [{provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}],
    UsersService,
    MeasurementService,
    ConfigService,
    MeasurementsFilterService

  ]
})
export class AdminModule { }
