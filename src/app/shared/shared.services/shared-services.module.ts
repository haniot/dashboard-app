import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService } from './notification.service';
import { PilotStudyService } from '../../modules/pilot.study/services/pilot.study.service'
import { AuthService } from '../../security/auth/services/auth.service'
import { UserService } from '../../modules/admin/services/users.service'
import { AdminService } from '../../modules/admin/services/admin.service'
import { HealthProfessionalService } from '../../modules/admin/services/health.professional.service'
import { PatientService } from '../../modules/patient/services/patient.service'
import { NutritionEvaluationService } from '../../modules/evaluation/services/nutrition.evaluation.service'
import { SecurityModule } from '../../security/security.module'

@NgModule({
    imports: [
        CommonModule,
        SecurityModule
    ],
    providers: [
        PilotStudyService,
        AuthService,
        UserService,
        AdminService,
        HealthProfessionalService,
        PatientService,
        NutritionEvaluationService,
        NotificationService
    ]
})
export class SharedServicesModule {
}
