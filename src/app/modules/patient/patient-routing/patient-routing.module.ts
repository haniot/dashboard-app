import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TemplateComponent } from 'app/core/template/template-component/template.component';
import { AuthGuard } from 'app/security/guards/auth.guard';
import { ScopeGuard } from 'app/security/guards/scope.guard';
import { PatientComponentComponent } from '../patient-component/patient-component.component';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { ListPilotstudiesComponent } from '../list-pilotstudies/list-pilotstudies.component';

const routes = [
  {
    path: '',
    component: TemplateComponent, canActivate: [AuthGuard, ScopeGuard], canActivateChild: [AuthGuard, ScopeGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'patients',
        component: ListPilotstudiesComponent,
        data: { scope: ""}//patient:readAll patient:delete patient:deleteAll
      },
      { 
        path: 'patients/:pilotstudy_id',
        component: PatientComponentComponent,
        data: { scope: ""} //patient:create
      },
      { 
        path: 'patients/:pilotstudy_id/new',
        component: PatientFormComponent,
        data: { scope: ""} //patient:create
      },
      { 
        path: 'patients/:patientId/:pilotstudy_id',
        component: PatientFormComponent,
        data: { scope: ""}//patient:update patient:updateAll
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
