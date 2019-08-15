import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha'

import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change.password/change.password.component';
import { AuthRoutingModule } from './auth.routing/auth.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ForgotPasswordComponent } from './forgot.password/forgot.password.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        AuthRoutingModule,
        SharedModule,

        TranslateModule,
        RecaptchaModule
    ],
    declarations: [
        LoginComponent,
        ChangePasswordComponent,
        ForgotPasswordComponent
    ],
    providers: []
})
export class AuthModule {
}
