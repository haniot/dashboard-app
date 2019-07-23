import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { WaterGlassPipe } from '../pipes/water-glass.pipe';
import { BreakFastPipe } from '../pipes/break-fast.pipe';
import { BreastFeedingPipe } from '../pipes/breast-feeding.pipe';
import { FeedingHabitsRecord } from '../models/feeding';
import { FeedingRecordService } from '../services/feeding-record.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'feeding-habits',
    templateUrl: './feeding-habits.component.html',
    styleUrls: ['../shared-style/shared-styles.scss', './feeding-habits.component.scss']
})
export class FeedingHabitsComponent implements OnInit, OnChanges {

    listFeeding: Array<FeedingHabitsRecord>;
    feedingForm: FormGroup;
    @Input() patientId: string;
    @Input() feedingHabitsRecord: FeedingHabitsRecord;

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
        this.listFeeding = new Array<FeedingHabitsRecord>();
    }

    ngOnInit() {
        this.createFeedingFormInit();
    }

    /**Create form feeding */
    createFeedingFormInit() {
        this.feedingForm = this.fb.group({
            id: [''],
            created_at: [{ value: '', disabled: true }],
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
            id: [{ value: feedingRecord.id, disabled: true }],
            created_at: [{ value: feedingRecord.created_at, disabled: true }],
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
                    this.listFeeding = feedingRecords;
                    this.createFeedingForm(feedingRecords[0]);
                    // FIXME: Aqui estou pegando apenas o primeiro registro
                })
                .catch(errorResponse => {
                    // this.toastService.error('Não foi possível buscar hábitos alimentares!');
                    // console.log('Não foi possível buscar hábitos alimentares!', errorResponse);
                });
        } else if (this.feedingHabitsRecord && changes.feedingHabitsRecord.currentValue !== changes.feedingHabitsRecord.previousValue) {
            this.listFeeding = new Array<FeedingHabitsRecord>();
            this.listFeeding.push(this.feedingHabitsRecord);
            this.createFeedingForm(this.feedingHabitsRecord);
        }
    }

    prev() {
        if (this.index) {
            this.index--;
        }
        this.createFeedingForm(this.listFeeding[this.index]);
    }

    next() {
        this.index++;
        this.createFeedingForm(this.listFeeding[this.index]);
    }

}
