import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';


const routes = [
    { path: 'login', component: LoginComponent },
    { path: 'change', component: ChangePasswordComponent },
    { path: '**', redirectTo: 'page-not-found' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }