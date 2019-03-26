import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TemplateModule } from 'app/core/template/template.module';
import { AdminRoutingModule } from './admin-routing/admin-routing.module';

import { AdministratorsComponent } from './administrators/administrators.component';
import { HealthProfessionalComponent } from './health-professionals/health-professionals.component';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { AdminService } from './services/admin.service';
import { HealthProfessionalService } from './services/health-professional.service';
import { UserService } from './services/users.service';
import { SharedModule } from 'app/shared/shared.module';
import { PilotStudyModule } from '../pilot-study/pilot-study.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,    
    
    AdminRoutingModule,
    TemplateModule,
    SharedModule,
    PilotStudyModule,

    MatSlideToggleModule,
  ],
  declarations: [
    AdministratorsComponent,   
    HealthProfessionalComponent,
    ModalUserComponent,
    MyprofileComponent    

  ], 
  providers:[
    UserService,
    AdminService,
    HealthProfessionalService
  ]
})
export class AdminModule { }
