import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraphService } from './graph.service';
import { AuthService } from 'app/security/auth/services/auth.service';
import { UserService } from 'app/modules/admin/services/users.service';
import { AdminService } from 'app/modules/admin/services/admin.service';
import { HealthProfessionalService } from 'app/modules/admin/services/health-professional.service';
import { PilotStudyService } from 'app/modules/pilot-study/services/pilot-study.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    GraphService,
    PilotStudyService,
    AuthService,
    UserService,
    AdminService,
    HealthProfessionalService]
})
export class SharedServicesModule { }
