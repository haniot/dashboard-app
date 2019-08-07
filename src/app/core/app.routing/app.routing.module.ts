import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from 'app/security/guards/auth.guard';
import { ScopeGuard } from 'app/security/guards/scope.guard';
import { AccessDeniedComponent } from '../template/access.denied/access.denied.component'
import { NotfoundComponent } from '../template/page.not.found/page.not.found.component'
import { TemplateComponent } from '../template/template.component/template.component'

const routes = [
    { path: '', loadChildren: 'app/security/auth/auth.module#AuthModule' },
    {
        path: 'app',
        component: TemplateComponent, canActivate: [AuthGuard, ScopeGuard], canActivateChild: [AuthGuard, ScopeGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadChildren: 'app/modules/dashboard/dashboard.module#DashboardModule' },
            { path: 'admin', loadChildren: 'app/modules/admin/admin.module#AdminModule' },
            {
                path: 'healthprofessional',
                loadChildren: 'app/modules/health.professional/health.professional.module#HealthProfessionalModule'
            },
            { path: 'patients', loadChildren: 'app/modules/patient/patient.module#PatientModule' },
            { path: 'pilotstudies', loadChildren: 'app/modules/pilot.study/pilot.study.module#PilotStudyModule' },
            { path: 'evaluations', loadChildren: 'app/modules/evaluation/evaluation.module#EvaluationModule' }
        ]
    },
    { path: 'access-denied', component: AccessDeniedComponent },
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
export class AppRoutingModule {
}
