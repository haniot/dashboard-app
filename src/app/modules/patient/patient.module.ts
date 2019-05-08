import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material';

import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientTableComponent } from './patient-table/patient-table.component';
import { PatientComponentComponent } from './patient-component/patient-component.component';

import { PatientRoutingModule } from './patient-routing/patient-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { ListPilotstudiesComponent } from './list-pilotstudies/list-pilotstudies.component';
import { ViewHabitsComponent } from './view-habits/view-habits.component';
import { HabitsModule } from '../habits/habits.module';
import { MeasurementModule } from '../measurement/measurement.module';

@NgModule({
  declarations: [
    PatientFormComponent,
    PatientTableComponent,
    PatientComponentComponent,
    ListPilotstudiesComponent,
    ViewHabitsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MultiSelectModule,
    MatTabsModule,

    PatientRoutingModule,
    HabitsModule,
    MeasurementModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  exports: [
    PatientTableComponent
  ]
})
export class PatientModule { }
