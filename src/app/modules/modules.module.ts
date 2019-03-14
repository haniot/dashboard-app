import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminModule } from './admin/admin.module';

import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminModule,
    DashboardModule,
    UserModule,
  ]
})
export class ModulesModule { }
