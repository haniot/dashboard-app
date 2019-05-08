import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatPaginatorModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';

import { EvaluationComponentComponent } from './evaluation-component/evaluation-component.component';
import { EvaluationRoutingModule } from './evaluation-routing/evaluation-routing.module';
import { NutritionEvaluationComponent } from './nutrition-evaluation/nutrition-evaluation.component';
import { NutritionEvaluationTableComponent } from './nutrition-evaluation-table/nutrition-evaluation-table.component';
import { SharedModule } from 'app/shared/shared.module';
import { EvaluationService } from './services/evaluation.service';
import { NutritionEvaluationService } from './services/nutrition-evaluation.service';
import { EvaluationStatustPipe } from './pipes/evaluation-status.pipe';
import { EvaluationListComponent } from './evaluation-list/evaluation-list.component';
import { StudiesComponent } from './studies/studies.component';
import { PatientsComponent } from './patients/patients.component';

@NgModule({
  declarations: [
    EvaluationComponentComponent,
    NutritionEvaluationComponent,
    NutritionEvaluationTableComponent,
    EvaluationStatustPipe,
    EvaluationListComponent,
    StudiesComponent,
    PatientsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatPaginatorModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,


    SharedModule,
    EvaluationRoutingModule
  ],
  providers: [
    /** services */
    EvaluationService,
    NutritionEvaluationService,
    /** pipes */
    EvaluationStatustPipe,
    DatePipe
  ]
})
export class EvaluationModule { }
