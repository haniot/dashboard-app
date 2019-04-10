import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminModule } from './admin/admin.module';

import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PilotStudyModule } from './pilot-study/pilot-study.module';
import { PatientModule } from './patient/patient.module';
import { HabitsModule } from './habits/habits.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminModule,
    DashboardModule,
    UserModule,
    PilotStudyModule,
    PatientModule,
    HabitsModule
  ]
})
export class ModulesModule { }
