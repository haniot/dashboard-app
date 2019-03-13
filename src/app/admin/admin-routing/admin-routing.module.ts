import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from './../../guards/auth.guard';
import { AdminComponent } from './../admin.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AdministratorsComponent } from '../administrators/administrators.component';
import { HealthProfessionalComponent } from '../health-professionals/health-professionals.component';
import { ScopeGuard } from 'app/guards/scope.guard';
import { MyprofileComponent } from '../myprofile/myprofile.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent, canActivate: [AuthGuard, ScopeGuard], canActivateChild: [AuthGuard, ScopeGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent, data: {}},
          { path: 'myprofile', component: MyprofileComponent, data: {}},
          { 
            path: 'administrators',
            component: AdministratorsComponent,
            data: { scope: "adminAccount:create adminAccount:deleteAll adminAccount:readAll adminAccount:updateAll"} },
          { 
            path: 'caregiver',
            component: HealthProfessionalComponent,
            data: { scope: "caregiverAccount:create caregiverAccount:deleteAll caregiverAccount:readAll caregiverAccount:updateAll"}
          }
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
