import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdministratorsComponent } from '../administrators/administrators.component';
import { HealthProfessionalComponent } from '../health.professionals/health.professionals.component';
import { AdminConfigurationsComponent } from '../configurations/configurations.component';

const routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'configurations',
        component: AdminConfigurationsComponent,
        data: { scope: "admins:update" }
    },
    {
        path: 'administrators',
        component: AdministratorsComponent,
        data: { scope: "admins:create admins:delete admins:readAll admins:update" }
    },
    {
        path: 'healthprofessionals',
        component: HealthProfessionalComponent,
        data: {
            scope: "healthprofessionals:create healthprofessionals:readAll"
        }
    },
    { path: '**', redirectTo: 'page-not-found' },

];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
