import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule, MatInputModule, MatPaginatorModule, MatTabsModule } from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxEchartsModule } from 'ngx-echarts';
import { TranslateModule } from '@ngx-translate/core';

import { EvaluationComponentComponent } from './evaluation.component/evaluation.component';
import { EvaluationRoutingModule } from './evaluation.routing/evaluation.routing.module';
import { NutritionEvaluationComponent } from './nutrition.evaluation/nutrition.evaluation.component';
import { NutritionEvaluationTableComponent } from './nutrition.evaluation.table/nutrition.evaluation.table.component';
import { EvaluationService } from './services/evaluation.service';
import { NutritionEvaluationService } from './services/nutrition.evaluation.service';
import { NutritionalEvaluationListComponent } from './nutritional.evaluation.list/nutritional.evaluation.list.component';
import { StudiesComponent } from './studies/studies.component';
import { PatientsComponent } from './patients/patients.component';
import { NutritionClassificationtPipe } from './pipes/nutrition.classification.pipe';
import { OverweigthClassificationPipe } from './pipes/overweigth.classification.pipe';
import { BloodglucoseClassificationPipe } from './pipes/bloodglucose.classification.pipe';
import { BloodpressureClassificationPipe } from './pipes/bloodpressure.classification.pipe';
import { MeasurementModule } from '../measurement/measurement.module';
import { HabitsModule } from '../habits/habits.module';
import { DentalEvaluationTableComponent } from './dental.evaluation.table/dental.evaluation.table.component';
import { DentalEvaluationService } from './services/dental.evaluation.service';
import { DentalEvaluationListComponent } from './dental.evaluation.list/dental.evaluation.list.component';
import { TaylorCutClassificationPipe } from './pipes/taylor.cut.classification.pipe';
import { GeneratePdfService } from './services/generate.pdf.service';
import { SendEmailService } from './services/send.email.service';
import { SharedModule } from '../../shared/shared.module'


@NgModule({
    declarations: [
        /** components */
        EvaluationComponentComponent,
        NutritionEvaluationComponent,
        NutritionEvaluationTableComponent,
        NutritionalEvaluationListComponent,
        StudiesComponent,
        PatientsComponent,
        /** pipes */
        NutritionClassificationtPipe,
        OverweigthClassificationPipe,
        BloodglucoseClassificationPipe,
        BloodpressureClassificationPipe,
        DentalEvaluationTableComponent,
        DentalEvaluationListComponent,
        TaylorCutClassificationPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MatPaginatorModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatTabsModule,
        NgxEchartsModule,
        TranslateModule,

        SharedModule,
        HabitsModule,
        MeasurementModule,
        EvaluationRoutingModule,
        MeasurementModule
    ],
    providers: [
        /** services */
        EvaluationService,
        DentalEvaluationService,
        GeneratePdfService,
        SendEmailService,
        /** pipes */
        DatePipe,
        NutritionClassificationtPipe,
        OverweigthClassificationPipe,
        BloodglucoseClassificationPipe,
        BloodpressureClassificationPipe,
        TaylorCutClassificationPipe
    ],
    exports: [
        DentalEvaluationTableComponent,
        OverweigthClassificationPipe,
        NutritionClassificationtPipe,
        TaylorCutClassificationPipe,
        BloodglucoseClassificationPipe,
        BloodpressureClassificationPipe
    ]
})
export class EvaluationModule {
}
