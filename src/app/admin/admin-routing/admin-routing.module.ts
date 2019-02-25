import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from './../../guards/auth.guard';
import { AdminComponent } from './../admin.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PatientsComponent } from '../patients/patients.component';
import { CaregiverComponent } from '../caregiver/caregiver.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'patients', component: PatientsComponent },
          { path: 'caregiver', component: CaregiverComponent },
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
