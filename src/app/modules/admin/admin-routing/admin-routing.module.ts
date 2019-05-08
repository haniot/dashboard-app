import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdministratorsComponent } from '../administrators/administrators.component';
import { HealthProfessionalComponent } from '../health-professionals/health-professionals.component';
import { MyprofileComponent } from '../myprofile/myprofile.component';
import { MypilotstudiesComponent } from '../mypilotstudies/mypilotstudies.component';
import { EditMypilotComponent } from '../edit-mypilot/edit-mypilot.component';

const routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'myprofile',
    component: MyprofileComponent,
    data: { scope: "admin:readAll admin:updateAll healthprofessional:read healthprofessional:update" }
  },
  {
    path: 'administrators',
    component: AdministratorsComponent,
    data: { scope: "admin:create admin:deleteAll admin:readAll admin:updateAll" }
  },
  {
    path: 'healthprofessionals',
    component: HealthProfessionalComponent,
    data: { scope: "healthprofessional:create healthprofessional:deleteAll healthprofessional:readAll healthprofessional:updateAll" }
  },
  {
    path: 'mystudies',
    component: MypilotstudiesComponent,
    data: { scope: "" }
  },
  {
    path: 'mystudies/:userId/:pilotstudy_id',
    component: EditMypilotComponent,
    data: { scope: "" }
  },
  { path: '**', redirectTo: 'page-not-found' },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
