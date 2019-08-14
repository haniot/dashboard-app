import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PatientFormComponent } from '../patient.form/patient.form.component';
import { ViewHabitsComponent } from '../view.habits/view.habits.component';
import { PatientManagerComponent } from '../patient.manager/patient.manager.component';
import { PatientComponent } from '../patient.component/patient.component'
import { PatientConfigComponent } from '../configurations/configurations.component'
import { PatientMypilotstudiesComponent } from '../mypilotstudies/mypilotstudies.component'
import { PatientMyEvaluationsComponent } from '../myevaluations/myevaluations.component'

const routes = [

    {
        path: '',
        component: PatientManagerComponent,
        data: { scope: 'patients:read' }
    },
    {
        path: 'new',
        component: PatientFormComponent,
        data: { scope: 'patients:create' }
    },
    {
        path: 'configurations',
        component: PatientConfigComponent,
        data: { scope: 'patients:update' }
    },
    {
        path: 'mystudies',
        component: PatientMypilotstudiesComponent,
        data: { scope: 'pilots:read' }
    },
    {
        path: 'myevaluations',
        component: PatientMyEvaluationsComponent,
        data: { scope: 'evaluations:read' }
    },
    {
        path: 'pilot',
        component: PatientComponent,
        data: { scope: 'patients:read patients:delete' }
    },
    {
        path: ':patientId',
        component: PatientFormComponent,
        data: { scope: 'patients:update' }
    },

    {
        path: ':pilotstudy_id/new',
        component: PatientFormComponent,
        data: { scope: 'patients:create' }
    },
    {
        path: ':patientId/details',
        component: ViewHabitsComponent,
        data: { scope: 'patients:read forms:read measurements:read' }
    },
    { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PatientRoutingModule {
}
