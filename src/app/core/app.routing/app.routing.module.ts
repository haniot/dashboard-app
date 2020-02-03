import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccessDeniedComponent } from '../template/access.denied/access.denied.component'
import { NotfoundComponent } from '../template/page.not.found/page.not.found.component'
import { TemplateComponent } from '../template/template.component/template.component'
import { AuthGuard } from '../../security/guards/auth.guard'
import { ScopeGuard } from '../../security/guards/scope.guard'

const routes = [
    {
        path: '',
        loadChildren: () => import('../../security/auth/auth.module')
            .then(m => m.AuthModule)
    },
    {
        path: 'app',
        component: TemplateComponent, canActivate: [AuthGuard, ScopeGuard], canActivateChild: [AuthGuard, ScopeGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadChildren: () => import('../../modules/dashboard/dashboard.module')
                    .then(m => m.DashboardModule)
            },
            {
                path: 'admin',
                loadChildren: () => import('../../modules/admin/admin.module').then(m => m.AdminModule)
            },
            {
                path: 'healthprofessional',
                loadChildren: () => import('../../modules/health.professional/health.professional.module')
                    .then(m => m.HealthProfessionalModule)
            },
            {
                path: 'patients',
                loadChildren: () => import('../../modules/patient/patient.module').then(m => m.PatientModule)
            },
            {
                path: 'pilotstudies',
                loadChildren: () => import('../../modules/pilot.study/pilot.study.module')
                    .then(m => m.PilotStudyModule)
            },
            {
                path: 'evaluations',
                loadChildren: () => import('../../modules/evaluation/evaluation.module')
                    .then(m => m.EvaluationModule)
            },
            {
                path: 'activities',
                loadChildren: () => import('../../modules/activity/activity.module')
                    .then(m => m.ActivityModule)
            }
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
