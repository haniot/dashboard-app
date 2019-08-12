import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PatientFormComponent } from '../patient.form/patient.form.component';
import { ViewHabitsComponent } from '../view.habits/view.habits.component';
import { PatientManagerComponent } from '../patient.manager/patient.manager.component';
import { PatientComponent } from '../patient.component/patient.component'

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
    {
        path: 'pilot',
        component: PatientComponent,
        data: { scope: 'patients:read patients:delete' }
    },
    { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PatientRoutingModule {
}
