import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdministratorsComponent } from '../administrators/administrators.component';
import { HealthProfessionalComponent } from '../health-professionals/health-professionals.component';
import { MyprofileComponent } from '../myprofile/myprofile.component';
import { ScopeGuard } from 'app/security/guards/scope.guard';
import { AuthGuard } from 'app/security/guards/auth.guard';
import { DashboardComponent } from 'app/modules/dashboard/dashboard-component/dashboard.component';
import { TemplateComponent } from 'app/core/template/template-component/template.component';
import { MypilotstudiesComponent } from '../mypilotstudies/mypilotstudies.component';

const routes = [
  {
    path: '',
    component: TemplateComponent, canActivate: [AuthGuard, ScopeGuard], canActivateChild: [AuthGuard, ScopeGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: {} },
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
        path: 'mystudies/:userId',
        component: MypilotstudiesComponent,
        data: { scope: "" }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
