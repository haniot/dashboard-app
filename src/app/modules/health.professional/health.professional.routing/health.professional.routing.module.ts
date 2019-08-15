import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HealthProfessionalConfigComponent } from '../configurations/configurations.component';
import { MypilotstudiesComponent } from '../mypilotstudies/mypilotstudies.component';
import { EditMypilotComponent } from '../edit.mypilot/edit.mypilot.component';
import { MyevaluationsComponent } from '../myevaluations/myevaluations.component';


const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'configurations',
        component: HealthProfessionalConfigComponent,
        data: { scope: 'healthprofessionals:update' }
    },
    {
        path: 'mystudies',
        component: MypilotstudiesComponent,
        data: { scope: 'pilots:read' }
    },
    {
        path: 'mystudies/:userId/:pilotstudy_id',
        component: EditMypilotComponent,
        data: { scope: 'pilots:update' }
    },
    {
        path: 'myevaluations',
        component: MyevaluationsComponent,
        data: { scope: 'evaluations:read' }
    },
    { path: '**', redirectTo: 'page-not-found' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HealthProfessionalRoutingModule {
}
