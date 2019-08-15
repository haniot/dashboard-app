import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SleepHabitsRecord } from '../models/sleep';

@Component({
    selector: 'sleep-habits',
    templateUrl: './sleep.habits.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './sleep.habits.component.scss']
})
export class SleepHabitsComponent implements OnInit, OnChanges {
    @Input() sleepHabit: SleepHabitsRecord;
    sleepForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder
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
        if (changes.sleepHabit.currentValue !== changes.sleepHabit.previousValue) {
            if (this.sleepHabit) {
                this.createSleepForm(this.sleepHabit);
            } else {
                this.sleepForm.reset();
            }

        }
    }


}

