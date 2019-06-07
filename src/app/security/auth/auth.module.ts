import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthRoutingModule } from './auth-routing/auth-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent,
    ChangePasswordComponent
  ],
  providers: [

  ]
})
export class AuthModule { }
