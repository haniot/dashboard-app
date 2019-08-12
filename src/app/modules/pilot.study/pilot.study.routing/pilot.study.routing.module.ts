import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PilotStudyFormComponent } from '../pilot.study.form/pilot.study.form.component';
import { PilotStudyViewComponent } from '../pilot.study.view/pilot.study.view.component';
import { PilotStudyComponent } from '../pilot.study.component/pilot.study.component'

const routes = [
    {
        path: '',
        component: PilotStudyComponent,
        data: {
            scope: 'pilots:readAll pilots:delete'
        }
    },

    {
        path: 'new',
        component: PilotStudyFormComponent,
        data: { scope: 'pilots:create' }
    },
    {
        path: ':pilotStudyId',
        component: PilotStudyFormComponent,
        data: { scope: 'pilots:update' }
    },
    {
        path: ':pilotStudyId/details',
        component: PilotStudyViewComponent,
        data: { scope: 'pilots:update' }
    },
    {
        path: ':pilotStudyId/:userRequest',
        component: PilotStudyFormComponent,
        data: { scope: 'pilots:update' }
    },
    { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PilotStudyRoutingModule {
}
