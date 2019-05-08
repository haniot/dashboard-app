import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MultiSelectModule } from 'primeng/multiselect';

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
import { MypilotstudiesComponent } from './mypilotstudies/mypilotstudies.component';
import { EditMypilotComponent } from './edit-mypilot/edit-mypilot.component';
import { MatNativeDateModule } from '@angular/material';
import { HaniotTableComponent } from './haniot-table/haniot-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    AdminRoutingModule,
    TemplateModule,
    SharedModule,

    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MultiSelectModule
  ],
  declarations: [
    AdministratorsComponent,
    HealthProfessionalComponent,
    ModalUserComponent,
    MyprofileComponent,
    MypilotstudiesComponent,
    EditMypilotComponent,
    HaniotTableComponent

  ],
  providers: [
    UserService,
    AdminService,
    HealthProfessionalService
  ],
  exports: [
    MypilotstudiesComponent
  ]
})
export class AdminModule { }
