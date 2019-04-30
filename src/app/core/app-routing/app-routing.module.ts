import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from 'app/security/guards/auth.guard';
import { ScopeGuard } from 'app/security/guards/scope.guard';
import { TemplateComponent } from '../template/template-component/template.component';
import { AcessDeniedComponent } from '../template/acess-denied/acess-denied.component';
import { NotfoundComponent } from '../template/page-not-found/page-not-found.component';

const routes = [
  { path: 'auth', loadChildren: 'app/security/auth/auth.module#AuthModule' },
  {
    path: '',
    component: TemplateComponent, canActivate: [AuthGuard, ScopeGuard], canActivateChild: [AuthGuard, ScopeGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: 'app/modules/dashboard/dashboard.module#DashboardModule' },
      { path: 'ui', loadChildren: 'app/modules/admin/admin.module#AdminModule' },
      { path: 'patients', loadChildren: 'app/modules/patient/patient.module#PatientModule' },
      { path: 'pilotstudies', loadChildren: 'app/modules/pilot-study/pilot-study.module#PilotStudyModule' }
    ]
  },
  { path: 'acess-denied', component: AcessDeniedComponent },
  { path: 'page-not-found', component: NotfoundComponent },
  { path: '**', redirectTo: 'page-not-found' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
