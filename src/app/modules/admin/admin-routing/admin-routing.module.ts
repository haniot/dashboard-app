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
    data: { scope: "" }
  },
  {
    path: 'administrators',
    component: AdministratorsComponent,
    data: { scope: "admins:create admins:delete admins:readAll admins:update" }
  },
  {
    path: 'healthprofessionals',
    component: HealthProfessionalComponent,
    data: {
      scope: "healthprofessionals:create healthprofessionals:readAll"
    }
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
