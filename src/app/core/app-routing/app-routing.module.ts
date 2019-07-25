import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from 'app/security/guards/auth.guard';
import { ScopeGuard } from 'app/security/guards/scope.guard';
import { TemplateComponent } from '../template/template-component/template.component';
import { AcessDeniedComponent } from '../template/acess-denied/acess-denied.component';
import { NotfoundComponent } from '../template/page-not-found/page-not-found.component';

const routes = [
    { path: 'auth', loadChildren: () => import('app/security/auth/auth.module').then(m => m.AuthModule) },
    {
        path: '',
        component: TemplateComponent, canActivate: [AuthGuard, ScopeGuard], canActivateChild: [AuthGuard, ScopeGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            { path: 'admin', loadChildren: () => import('app/modules/admin/admin.module').then(m => m.AdminModule) },
            {
                path: 'healthprofessional',
                loadChildren: () => import('app/modules/health-professional/health-professional.module')
                    .then(m => m.HealthProfessionalModule)
            },
            {
                path: 'patients',
                loadChildren: () => import('app/modules/patient/patient.module').then(m => m.PatientModule)
            },
            {
                path: 'pilotstudies',
                loadChildren: () => import('app/modules/pilot-study/pilot-study.module').then(m => m.PilotStudyModule)
            },
            {
                path: 'evaluations',
                loadChildren: () => import('app/modules/evaluation/evaluation.module').then(m => m.EvaluationModule)
            }
        ]
    },
    { path: 'access-denied', component: AcessDeniedComponent },
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
