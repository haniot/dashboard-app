import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NutritionEvaluationComponent } from '../nutrition-evaluation/nutrition-evaluation.component';
import { EvaluationComponentComponent } from '../evaluation-component/evaluation-component.component';
import { EvaluationListComponent } from '../evaluation-list/evaluation-list.component';

const routes = [

  {
    path: '',
    component: EvaluationListComponent
  },
  {
    path: ':pilostudy_id/:patient_id',
    component: EvaluationComponentComponent
    // ,
    // data: { scope: "patient:read patient:readAll" }
  },
  {
    path: ':patient_id/nutritional/:nutritionevaluation_id',
    component: NutritionEvaluationComponent
    // ,
    // data: { scope: "patient:read patient:readAll" }
  },
  { path: '**', redirectTo: 'page-not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationRoutingModule { }
