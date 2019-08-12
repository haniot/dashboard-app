import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';

import { FeedingHabitsComponent } from './feeding.habits/feeding.habits.component';
import { WaterGlassPipe } from './pipes/water.glass.pipe';
import { BreakFastPipe } from './pipes/break.fast.pipe';
import { BreastFeedingPipe } from './pipes/breast.feeding.pipe';
import { FoodAllergyPipe } from './pipes/food.allergy.pipe';
import { WeeklyFrequencyPipe } from './pipes/weekly.frequency.pipe';
import { SleepHabitsComponent } from './sleep.habits/sleep.habits.component';
import { SleepRecordService } from './services/sleep.record.service';
import { FeedingRecordService } from './services/feeding.record.service';
import { PhysicalActivityHabitsComponent } from './physical.activity.habits/physical.activity.habits.component';
import { PhysicalActivityRecordService } from './services/physical.activity.record.service';
import { PhysicalActivityPipe } from './pipes/physical.activity.frequency.pipe';
import { WeeklyActivityPipe } from './pipes/weekly.activities.pipe';
import { MedicalRecordComponent } from './medical.record/medical.record.component';
import { MedicalRecordService } from './services/medical.record.service';
import { ChronicDiseasePipe } from './pipes/chronic.disease.pipe';
import { DiseaseHistoryPipe } from './pipes/disease.history.pipe';
import { WeeklyFoodPipe } from './pipes/weekly.food.pipe';
import { SocioDemographicRecordComponent } from './socio.demographic.record/socio.demographic.record.component';
import { FamilyCohesionRecordComponent } from './family.cohesion.record/family.cohesion.record.component';
import { OralHealthRecordComponent } from './oral.health.record/oral.health.record.component';
import { FrequencyFamilycohesionPipe } from './pipes/frequency.familycohesion.pipe';
import { FamilyCohesionRecordService } from './services/family.cohesion.record.service';
import { OralhealthRecordService } from './services/oralhealth.record.service';
import { SocioDemographicRecordService } from './services/socio.demographic.record.service';
import { MotherSchoolarityPipe } from './pipes/mother.schoolarity.pipe';
import { CorAndRacePipe } from './pipes/cor.race.pipe';
import { TeethbushingPipe } from './pipes/teeth.brushing.frequency.pipe';
import { ToothTypePipe } from './pipes/tooth.type.pipe';
import { LesionTypePipe } from './pipes/lesion.type.pipe';
import { NutritionalQuestionnairesService } from './services/nutritional.questionnaires.service'
import { OdontologicalQuestionnairesService } from './services/odontological.questionnaires.service'
import { QuestionnaireTypePipe } from './pipes/questionnaire.type'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
    declarations: [
        /**Componentes */
        FeedingHabitsComponent,
        SleepHabitsComponent,
        PhysicalActivityHabitsComponent,
        MedicalRecordComponent,
        /**Pipes */
        WaterGlassPipe,
        BreakFastPipe,
        BreastFeedingPipe,
        FoodAllergyPipe,
        WeeklyFrequencyPipe,
        WeeklyActivityPipe,
        ChronicDiseasePipe,
        DiseaseHistoryPipe,
        WeeklyFoodPipe,
        PhysicalActivityPipe,
        SocioDemographicRecordComponent,
        FamilyCohesionRecordComponent,
        OralHealthRecordComponent,
        FrequencyFamilycohesionPipe,
        MotherSchoolarityPipe,
        CorAndRacePipe,
        TeethbushingPipe,
        ToothTypePipe,
        LesionTypePipe,
        QuestionnaireTypePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        MatDatepickerModule,
        TranslateModule
    ],
    exports: [
        FeedingHabitsComponent,
        SleepHabitsComponent,
        PhysicalActivityHabitsComponent,
        MedicalRecordComponent,
        SocioDemographicRecordComponent,
        FamilyCohesionRecordComponent,
        OralHealthRecordComponent,
        QuestionnaireTypePipe
    ],
    providers: [
        /**Pipes */
        WaterGlassPipe,
        BreakFastPipe,
        BreastFeedingPipe,
        FoodAllergyPipe,
        WeeklyFrequencyPipe,
        PhysicalActivityPipe,
        WeeklyActivityPipe,
        ChronicDiseasePipe,
        DiseaseHistoryPipe,
        WeeklyFoodPipe,
        FrequencyFamilycohesionPipe,
        MotherSchoolarityPipe,
        CorAndRacePipe,
        TeethbushingPipe,
        ToothTypePipe,
        LesionTypePipe,
        QuestionnaireTypePipe,
        /** Services */
        FeedingRecordService,
        SleepRecordService,
        PhysicalActivityRecordService,
        MedicalRecordService,
        FamilyCohesionRecordService,
        OralhealthRecordService,
        SocioDemographicRecordService,
        NutritionalQuestionnairesService,
        OdontologicalQuestionnairesService
    ]
})
export class HabitsModule {
}
