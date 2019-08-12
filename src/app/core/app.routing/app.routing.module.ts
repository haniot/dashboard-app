import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AccessDeniedComponent } from '../template/access.denied/access.denied.component'
import { NotfoundComponent } from '../template/page.not.found/page.not.found.component'
import { TemplateComponent } from '../template/template.component/template.component'
import { AuthGuard } from '../../security/guards/auth.guard'
import { ScopeGuard } from '../../security/guards/scope.guard'

const routes = [
    { path: '', loadChildren: '../../security/auth/auth.module#AuthModule' },
    {
        path: 'app',
        component: TemplateComponent, canActivate: [AuthGuard, ScopeGuard], canActivateChild: [AuthGuard, ScopeGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadChildren: '../../modules/dashboard/dashboard.module#DashboardModule' },
            { path: 'admin', loadChildren: '../../modules/admin/admin.module#AdminModule' },
            {
                path: 'healthprofessional',
                loadChildren: '../../modules/health.professional/health.professional.module#HealthProfessionalModule'
            },
            { path: 'patients', loadChildren: '../../modules/patient/patient.module#PatientModule' },
            { path: 'pilotstudies', loadChildren: '../../modules/pilot.study/pilot.study.module#PilotStudyModule' },
            { path: 'evaluations', loadChildren: '../../modules/evaluation/evaluation.module#EvaluationModule' }
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
