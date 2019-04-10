import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';

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
    ChronicDiseasePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDatepickerModule,
  ],
  exports: [
    FeedingHabitsComponent,
    SleepHabitsComponent,
    PhysicalActivityHabitsComponent,
    MedicalRecordComponent
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
    /**services */
    FeedingRecordService,
    SleepRecordService,
    PhysicalActivityRecordService,
    MedicalRecordService
  ]
})
export class HabitsModule { }
