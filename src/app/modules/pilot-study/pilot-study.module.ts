import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MultiSelectModule } from 'primeng/multiselect';

import { PilotStudyFormComponent } from './pilot-study-form/pilot-study-form.component';
import { SharedModule } from 'app/shared/shared.module';
import { PilotStudyService } from './services/pilot-study.service';
import { PilotStudyTableComponent } from './pilot-study-table/pilot-study-table.component';
import { PilotStudyComponentComponent } from './pilot-study-component/pilot-study-component.component';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { PilotStudyRoutingModule } from './pilot-study-routing/pilot-study-routing.module';
import { ViewHealthProfessionalComponent } from './view-health-professional/view-health-professional.component';
import { PilotStudyViewComponent } from './pilot-study-view/pilot-study-view.component';
import { DashboardModule } from '../dashboard/dashboard.module';

@NgModule({
  declarations: [
    PilotStudyFormComponent,
    PilotStudyTableComponent,
    PilotStudyComponentComponent,
    ViewHealthProfessionalComponent,
    PilotStudyViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MultiSelectModule,

    SharedModule,
    PilotStudyRoutingModule,
  ],
  providers: [
    PilotStudyService,
    MatDatepickerModule
  ]
})
export class PilotStudyModule { }
