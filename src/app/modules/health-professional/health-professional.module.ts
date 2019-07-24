import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

import {
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSlideToggleModule, MatTableModule
} from "@angular/material";

import {MypilotstudiesComponent} from "./mypilotstudies/mypilotstudies.component";
import {EditMypilotComponent} from "./edit-mypilot/edit-mypilot.component";
import {MyevaluationsComponent} from "./myevaluations/myevaluations.component";
import {HealthProfessionalConfigComponent} from "./configurations/configurations.component";
import {HealthProfessionalRoutingModule} from "./health-professional-routing/health-professional-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {EvaluationModule} from "../evaluation/evaluation.module";
import { SettingsModule } from '../settings/settings.module';

@NgModule({
    declarations: [
        HealthProfessionalConfigComponent,
        MypilotstudiesComponent,
        EditMypilotComponent,
        MyevaluationsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HealthProfessionalRoutingModule,
        SharedModule,
        EvaluationModule,
        SettingsModule,

        MatPaginatorModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        MatTableModule
    ],
    exports: [
        MypilotstudiesComponent
    ]
})
export class HealthProfessionalModule {
}
