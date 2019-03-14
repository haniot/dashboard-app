import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { TemplateModule } from 'app/core/template/template.module';
import { AdminRoutingModule } from './admin-routing/admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdministratorsComponent } from './administrators/administrators.component';
import { HealthProfessionalComponent } from './health-professionals/health-professionals.component';
import { ModalUserEditComponent } from './modal-user-edit/modal-user-edit.component';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { AdminService } from './services/admin.service';
import { HealthProfessionalService } from './services/health-professional.service';
import { UserService } from './services/users.service';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    CommonModule,
    AdminRoutingModule,
    DataTablesModule,
    TemplateModule,
    NgbModule.forRoot(),
    MatSlideToggleModule,
    SharedModule    
  ],
  exports: [
    AdminComponent,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    AdministratorsComponent,   
    HealthProfessionalComponent,
    ModalUserComponent,
    ModalUserEditComponent,
    MyprofileComponent    

  ], 
  providers:[
    UserService,
    AdminService,
    HealthProfessionalService
  ]
})
export class AdminModule { }
