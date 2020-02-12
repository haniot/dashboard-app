import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PatientFormComponent } from '../patient.form/patient.form.component';
import { PatientManagerComponent } from '../patient.manager/patient.manager.component';
import { PatientComponent } from '../patient.component/patient.component'
import { PatientConfigComponent } from '../configurations/configurations.component'
import { PatientMypilotstudiesComponent } from '../mypilotstudies/mypilotstudies.component'
import { PatientMyEvaluationsComponent } from '../myevaluations/myevaluations.component'
import { ViewResourcesComponent } from '../view.resources/view.resources.component'
import { PatientQuestionnairesComponent } from '../patient.questionnaires/patient.questionnaires.component'
import { PatientMeasurementsComponent } from '../patient.measurements/patient.measurements.component'
import { PatientDashboardComponent } from '../patient.dashboard/patient.dashboard.component'
import { GraphicStudyComponent } from '../graphic.study/graphic.study.component'

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
        path: 'fitbit',
        component: PatientFormComponent
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
        path: ':patientId/dashboard',
        component: PatientDashboardComponent,
        data: { scope: 'patients:read patients:delete' }
    },
    {
        path: ':patientId/measurements',
        component: PatientMeasurementsComponent,
        data: { scope: 'patients:read measurements:read' }
    },
    {
        path: ':patientId/questionnaires',
        component: PatientQuestionnairesComponent,
        data: { scope: 'patients:read forms:read' }
    },
    {
        path: ':patientId/graphic-study',
        component: GraphicStudyComponent,
        data: { scope: 'patients:read' }
    },
    {
        path: ':patientId/:resource',
        component: ViewResourcesComponent,
        data: { scope: 'patients:read measurements:read' }
    },
    { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PatientRoutingModule {
}
