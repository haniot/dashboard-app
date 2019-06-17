import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AdministratorsComponent} from '../administrators/administrators.component';
import {HealthProfessionalComponent} from '../health-professionals/health-professionals.component';
import {MyprofileComponent} from '../myprofile/myprofile.component';

const routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {
        path: 'myprofile',
        component: MyprofileComponent,
        data: {scope: ""}
    },
    {
        path: 'new/administrators',
        component: AdministratorsComponent,
        data: {scope: "admins:create admins:delete admins:readAll admins:update"}
    },
    {
        path: 'new/healthprofessionals',
        component: HealthProfessionalComponent,
        data: {
            scope: "healthprofessionals:create healthprofessionals:readAll"
        }
    },
    {path: '**', redirectTo: 'page-not-found'},

];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
