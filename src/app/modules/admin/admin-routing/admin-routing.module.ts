import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './../admin.component';
import { AdministratorsComponent } from '../administrators/administrators.component';
import { HealthProfessionalComponent } from '../health-professionals/health-professionals.component';

import { MyprofileComponent } from '../myprofile/myprofile.component';
import { ScopeGuard } from 'app/security/guards/scope.guard';
import { AuthGuard } from 'app/security/guards/auth.guard';
import { DashboardComponent } from 'app/modules/dashboard/dashboard-component/dashboard.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent, canActivate: [AuthGuard, ScopeGuard], canActivateChild: [AuthGuard, ScopeGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent, data: {}},
          { 
            path: 'myprofile',
            component: MyprofileComponent,
            data: { scope: "admin:readAll admin:updateAll healthprofessional:read healthprofessional:update"}},
          { 
            path: 'administrators',
            component: AdministratorsComponent,
            data: { scope: "admin:create admin:deleteAll admin:readAll admin:updateAll"} },
          { 
            path: 'healthprofessionals',
            component: HealthProfessionalComponent,
            data: { scope: "healthprofessional:create healthprofessional:deleteAll healthprofessional:readAll healthprofessional:updateAll"}
          }
        ]
      },
      { path: '**', redirectTo: 'page-not-found' }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
