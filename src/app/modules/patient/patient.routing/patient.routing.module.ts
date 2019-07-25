import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PatientComponent } from '../patient.component/patient.component';
import { PatientFormComponent } from '../patient.form/patient.form.component';
import { ViewHabitsComponent } from '../view.habits/view.habits.component';
import { PatientManagerComponent } from '../patient.manager/patient.manager.component';

const routes = [

    {
        path: '',
        component: PatientManagerComponent
        // data: { scope: "pilots:read" }
    },
    {
        path: 'new',
        component: PatientFormComponent,
        data: { scope: 'patients:create' }
    },
    {
        path: ':pilotstudy_id',
        component: PatientComponent,
        data: { scope: 'patients:read patients:delete' }
    },
    {
        path: ':pilotstudy_id/new',
        component: PatientFormComponent,
        data: { scope: 'patients:create' }
    },
    {
        path: ':patientId/:pilotstudy_id',
        component: PatientFormComponent,
        data: { scope: 'patients:update' }
    },
    {
        path: ':patientId/:pilotstudy_id/details',
        component: ViewHabitsComponent,
        data: { scope: 'patients:read' }// TODO: Aqui acredito que devo adicionar os escopos forms:read
    },
    { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PatientRoutingModule {
}
