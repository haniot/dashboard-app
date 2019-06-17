import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HealthProfessionalRoutingModule} from "./health-professional-routing/health-professional-routing.module";

import {MypilotstudiesComponent} from "./mypilotstudies/mypilotstudies.component";
import {EditMypilotComponent} from "./edit-mypilot/edit-mypilot.component";
import {MyevaluationsComponent} from "./myevaluations/myevaluations.component";
import {MyprofileComponent} from "./myprofile/myprofile.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSlideToggleModule, MatTableModule
} from "@angular/material";
import {EvaluationModule} from "../evaluation/evaluation.module";

@NgModule({
    declarations: [
        MyprofileComponent,
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

        MatPaginatorModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        MatTableModule,
    ],
    exports: [
        MypilotstudiesComponent
    ]
})
export class HealthProfessionalModule {
}
