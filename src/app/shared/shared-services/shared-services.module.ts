import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from 'app/security/auth/services/auth.service';
import { UserService } from 'app/modules/admin/services/users.service';
import { AdminService } from 'app/modules/admin/services/admin.service';
import { HealthProfessionalService } from 'app/modules/admin/services/health-professional.service';
import { PilotStudyService } from 'app/modules/pilot-study/services/pilot-study.service';
import { PatientService } from 'app/modules/patient/services/patient.service';
import { LocalStorageService } from './localstorage.service';
import { NotificationService } from './notification.service';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        PilotStudyService,
        AuthService,
        UserService,
        AdminService,
        HealthProfessionalService,
        PatientService,
        LocalStorageService,
        NotificationService
    ]
})
export class SharedServicesModule {
}
