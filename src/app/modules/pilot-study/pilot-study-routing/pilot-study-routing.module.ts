import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PilotStudyComponentComponent } from 'app/modules/pilot-study/pilot-study-component/pilot-study-component.component';
import { PilotStudyFormComponent } from '../pilot-study-form/pilot-study-form.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: PilotStudyComponentComponent
//   },
//   { 
//     path: 'new',
//     component: PilotStudyComponentComponent,
//     data: { scope: ""}
//   },
//   { 
//     path: ':pilotStudyId',
//     component: PilotStudyComponentComponent,
//     data: { scope: ""}
//   }

// ];

const routes = [
  {
    path: '',
    component: PilotStudyComponentComponent,
    data: { scope: "pilotstudy:readAll pilotstudy:delete pilotstudy:deleteAll" }
  },
  {
    path: 'new',
    component: PilotStudyFormComponent,
    data: { scope: "pilotstudy:create" }
  },
  {
    path: ':pilotStudyId',
    component: PilotStudyFormComponent,
    data: { scope: "pilotstudy:update pilotstudy:updateAll" }
  },
  {
    path: ':pilotStudyId/:userRequest',
    component: PilotStudyFormComponent,
    data: { scope: "pilotstudy:update pilotstudy:updateAll" }
  },
  { path: '**', redirectTo: 'page-not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PilotStudyRoutingModule { }