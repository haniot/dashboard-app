import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NutritionEvaluationComponent } from '../nutrition.evaluation/nutrition.evaluation.component';
import { EvaluationComponentComponent } from '../evaluation.component/evaluation.component';
import { NutritionalEvaluationListComponent } from '../nutritional.evaluation.list/nutritional.evaluation.list.component';

const routes = [
    {
        path: 'nutritional',
        component: NutritionalEvaluationListComponent,
        data: { scope: 'evaluations:read' }
    },
    {
        path: 'nutritional/:patient_id',
        component: EvaluationComponentComponent,
        data: { scope: 'evaluations:read' }
    },
    {
        path: ':patient_id/nutritional/:nutritionevaluation_id',
        component: NutritionEvaluationComponent,
        data: { scope: 'evaluations:read evaluations:update' }
    },
    { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EvaluationRoutingModule {
}
