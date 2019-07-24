import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';

import { FeedingHabitsComponent } from './feeding-habits/feeding-habits.component';
import { SharedModule } from 'app/shared/shared.module';
import { WaterGlassPipe } from './pipes/water-glass.pipe';
import { BreakFastPipe } from './pipes/break-fast.pipe';
import { BreastFeedingPipe } from './pipes/breast-feeding.pipe';
import { FoodAllergyPipe } from './pipes/food-allergy.pipe';
import { WeeklyFrequencyPipe } from './pipes/weekly-frequency.pipe';
import { SleepHabitsComponent } from './sleep-habits/sleep-habits.component';
import { SleepRecordService } from './services/sleep-record.service';
import { FeedingRecordService } from './services/feeding-record.service';
import { PhysicalActivityHabitsComponent } from './physical-activity-habits/physical-activity-habits.component';
import { PhysicalActivityRecordService } from './services/physical-activity-record.service';
import { PhysicalActivityPipe } from './pipes/physical-activity-frequency.pipe';
import { WeeklyActivityPipe } from './pipes/weekly-activities.pipe';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { MedicalRecordService } from './services/medical-record.service';
import { ChronicDiseasePipe } from './pipes/chronic-disease.pipe';
import { DiseaseHistoryPipe } from './pipes/disease-history.pipe';
import { WeeklyFoodPipe } from './pipes/weekly-food.pipe';
import { SocioDemographicRecordComponent } from './sociodemographic-record/socio-demographic-record.component';
import { FamilycohesionRecordComponent } from './familycohesion-record/familycohesion-record.component';
import { OralhealthRecordComponent } from './oralhealth-record/oralhealth-record.component';
import { FrequencyFamilyCohesionPipe } from './pipes/frequency-familycohesion.pipe';
import { FamilyCohesionRecordService } from './services/familycohesion-record.service';
import { OralHealthRecordService } from './services/oralhealth-record.service';
import { SocioDemographicRecordService } from './services/sociodemographic-record.service';
import { MotherSchoolarityPipe } from './pipes/mother-schoolarity.pipe';
import { CorAndRacePipe } from './pipes/cor-race.pipe';
import { TeethbushingPipe } from './pipes/teeth-brushing-frequency.pipe';
import { ToothTypePipe } from './pipes/tooth-type.pipe';
import { LesionTypePipe } from './pipes/lesion-type.pipe';

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
    FamilycohesionRecordComponent,
    OralhealthRecordComponent,
    FrequencyFamilyCohesionPipe,
    MotherSchoolarityPipe,
    CorAndRacePipe,
    TeethbushingPipe,
    ToothTypePipe,
    LesionTypePipe
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
    FamilycohesionRecordComponent,
    OralhealthRecordComponent
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
    FrequencyFamilyCohesionPipe,
    MotherSchoolarityPipe,
    CorAndRacePipe,
    TeethbushingPipe,
    ToothTypePipe,
    LesionTypePipe,
    /**services */
    FeedingRecordService,
    SleepRecordService,
    PhysicalActivityRecordService,
    MedicalRecordService,
    FamilyCohesionRecordService,
    OralHealthRecordService,
    SocioDemographicRecordService
  ]
})
export class HabitsModule { }
