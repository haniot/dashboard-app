import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PilotStudyComponentComponent } from 'app/modules/pilot-study/pilot-study-component/pilot-study-component.component';
import { TemplateComponent } from 'app/core/template/template-component/template.component';
import { AuthGuard } from 'app/security/guards/auth.guard';
import { ScopeGuard } from 'app/security/guards/scope.guard';
import { PilotStudyFormComponent } from '../pilot-study-form/pilot-study-form.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: PilotStudyComponentComponent
//   },
//   { 
//     path: 'new',
//     component: PilotStudyComponentComponent,
//     data: { scope: ""}
//   },
//   { 
//     path: ':pilotStudyId',
//     component: PilotStudyComponentComponent,
//     data: { scope: ""}
//   }
  
// ];

const routes = [{
  path: '',
  component: TemplateComponent, canActivate: [AuthGuard, ScopeGuard], canActivateChild: [AuthGuard, ScopeGuard],
  children: [
    {
      path: 'pilotstudies',
      component: PilotStudyComponentComponent,
      data: { scope: "pilotstudy:readAll pilotstudy:delete pilotstudy:deleteAll"}
    },
    { 
      path: 'pilotstudies/new',
      component: PilotStudyFormComponent,
      data: { scope: "pilotstudy:create"}
    },
    { 
      path: 'pilotstudies/:pilotStudyId',
      component: PilotStudyFormComponent,
      data: { scope: "pilotstudy:update pilotstudy:updateAll"}
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PilotStudyRoutingModule { }