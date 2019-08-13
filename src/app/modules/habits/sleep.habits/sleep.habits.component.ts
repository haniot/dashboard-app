import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SleepHabitsRecord } from '../models/sleep';
import { SleepRecordService } from '../services/sleep.record.service';

@Component({
    selector: 'sleep-habits',
    templateUrl: './sleep.habits.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './sleep.habits.component.scss']
})
export class SleepHabitsComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    @Input() sleepHabit: SleepHabitsRecord;
    sleepForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder,
        private sleepService: SleepRecordService
    ) {
        this.index = 0;
        this.sleepHabit = new SleepHabitsRecord();
    }

    ngOnInit() {
        this.createSleepFormInit();
    }

    createSleepFormInit() {
        this.sleepForm = this.fb.group({
            week_day_sleep: [{ value: 0, disabled: true }],
            week_day_wake_up: [{ value: 0, disabled: true }]
        });
    }

    createSleepForm(sleepRecord: SleepHabitsRecord) {
        this.sleepForm = this.fb.group({
            week_day_sleep: [{ value: sleepRecord.week_day_sleep, disabled: true }],
            week_day_wake_up: [{ value: sleepRecord.week_day_wake_up, disabled: true }]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.sleepService.getAll(this.patientId)
                .then(sleepRecords => {
                    this.createSleepForm(sleepRecords[0]);
                })
                .catch();
        }
        if (changes.sleepHabit.currentValue !== changes.sleepHabit.previousValue) {
            if (this.sleepHabit) {
                this.createSleepForm(this.sleepHabit);
            } else {
                this.sleepForm.reset();
            }

        }
    }


}

