import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { WaterGlassPipe } from '../pipes/water.glass.pipe';
import { BreakFastPipe } from '../pipes/break.fast.pipe';
import { BreastFeedingPipe } from '../pipes/breast.feeding.pipe';
import { FeedingHabitsRecord } from '../models/feeding';
import { FeedingRecordService } from '../services/feeding.record.service';

@Component({
    selector: 'feeding-habits',
    templateUrl: './feeding.habits.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './feeding.habits.component.scss']
})
export class FeedingHabitsComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    @Input() feedingHabitsRecord: FeedingHabitsRecord;
    feedingForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder,
        private feedingService: FeedingRecordService,
        private translateService: TranslateService,
        private waterGlassPipe: WaterGlassPipe,
        private breakFastPipe: BreakFastPipe,
        private breastPipe: BreastFeedingPipe
    ) {
        this.index = 0;
    }

    ngOnInit() {
        this.createFeedingFormInit();
    }

    createFeedingFormInit() {
        this.feedingForm = this.fb.group({
            weekly_feeding_habits: this.fb.array([this.fb.group({
                food: [{ value: '', disabled: true }],
                seven_days_freq: [{ value: '', disabled: true }]
            })]),
            daily_water_glasses: [{ value: '', disabled: true }],
            six_month_breast_feeding: [{ value: '', disabled: true }],
            food_allergy_intolerance: this.fb.array([]),
            breakfast_daily_frequency: [{ value: '', disabled: true }]
        });

    }

    createFeedingForm(feedingRecord: FeedingHabitsRecord) {
        this.feedingForm = this.fb.group({
            weekly_feeding_habits: [{ value: feedingRecord.weekly_feeding_habits, disabled: true }],
            daily_water_glasses: [{ value: feedingRecord.daily_water_glasses, disabled: true }],
            six_month_breast_feeding: [{ value: feedingRecord.six_month_breast_feeding, disabled: true }],
            food_allergy_intolerance: [{ value: feedingRecord.food_allergy_intolerance, disabled: true }],
            breakfast_daily_frequency: [{ value: feedingRecord.breakfast_daily_frequency, disabled: true }]
        });
        this.feedingForm.get('daily_water_glasses')
            .patchValue(this.translateService.instant(this.waterGlassPipe.transform(feedingRecord.daily_water_glasses)));
        this.feedingForm.get('six_month_breast_feeding')
            .patchValue(this.translateService.instant(this.breastPipe.transform(feedingRecord.six_month_breast_feeding)));
        this.feedingForm.get('breakfast_daily_frequency')
            .patchValue(this.translateService.instant(this.breakFastPipe.transform(feedingRecord.breakfast_daily_frequency)));

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.feedingService.getAll(this.patientId)
                .then(feedingRecords => {
                    this.createFeedingForm(feedingRecords[0]);
                })
                .catch();
        }
        if (this.feedingHabitsRecord && changes.feedingHabitsRecord.currentValue !== changes.feedingHabitsRecord.previousValue) {
            this.createFeedingForm(this.feedingHabitsRecord);
        }
    }

}
