import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from 'app/security/auth/login/login.component';
import { ChangePasswordComponent } from 'app/security/auth/change-password/change-password.component';
import { AcessDeniedComponent } from 'app/core/template/acess-denied/acess-denied.component';
import { NotfoundComponent } from 'app/core/template/page-not-found/page-not-found.component';

const routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/change', component: ChangePasswordComponent },
  { path: 'acess-denied', component: AcessDeniedComponent },
  { path: 'page-not-found', component: NotfoundComponent },
  { path: '**', redirectTo: 'page-not-found' },
  // {
  //   path: 'admin',
  //   loadChildren: 'app/modules/admin/admin.modules#AdminRoutingModule'
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
