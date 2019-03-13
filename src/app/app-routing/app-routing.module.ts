import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './../auth/login/login.component';
import { ChangePasswordComponent } from '../auth/change-password/change-password.component';
import { NotfoundComponent } from 'app/template/page-not-found/page-not-found.component';
import { AcessDeniedComponent } from 'app/template/acess-denied/acess-denied.component';


@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/change', component: ChangePasswordComponent },
      { path: 'acess-denied', component: AcessDeniedComponent },
      { path: 'page-not-found', component: NotfoundComponent },
      { path: '**', redirectTo: 'page-not-found' }
    ])
  ],
  declarations: [],
  exports: [ RouterModule]
})
export class AppRoutingModule { }
