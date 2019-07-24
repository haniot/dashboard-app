import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SleepHabitsRecord } from '../models/sleep';
import { SleepRecordService } from '../services/sleep-record.service';

@Component({
    selector: 'sleep-habits',
    templateUrl: './sleep-habits.component.html',
    styleUrls: ['../shared-style/shared-styles.scss', './sleep-habits.component.scss']
})
export class SleepHabitsComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    @Input() sleepHabit: SleepHabitsRecord;
    listSleep: Array<SleepHabitsRecord>;
    sleepForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder,
        private sleepService: SleepRecordService
    ) {
        this.index = 0;
        this.listSleep = new Array<SleepHabitsRecord>();
        this.sleepHabit = new SleepHabitsRecord();
    }

    ngOnInit() {
        this.createSleepFormInit();
    }

    createSleepFormInit() {
        this.sleepForm = this.fb.group({
            id: [''],
            created_at: [{ value: '', disabled: true }],
            week_day_sleep: [{ value: 0, disabled: true }],
            week_day_wake_up: [{ value: 0, disabled: true }]
        });
    }

    createSleepForm(sleepRecord: SleepHabitsRecord) {
        this.sleepForm = this.fb.group({
            id: [{ value: sleepRecord.id }],
            created_at: [{ value: sleepRecord.created_at, disabled: true }],
            week_day_sleep: [{ value: sleepRecord.week_day_sleep, disabled: true }],
            week_day_wake_up: [{ value: sleepRecord.week_day_wake_up, disabled: true }]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.sleepService.getAll(this.patientId)
                .then(sleepRecords => {
                    this.listSleep = sleepRecords;
                    this.createSleepForm(sleepRecords[0]);
                })
                .catch();
        } else if (this.sleepHabit && changes.sleepHabit.currentValue !== changes.sleepHabit.previousValue) {
            this.listSleep = new Array<SleepHabitsRecord>();
            this.listSleep.push(this.sleepHabit);
            this.createSleepForm(this.sleepHabit);
        }
    }

    prev() {
        if (this.index) {
            this.index--;
        }
        this.createSleepForm(this.listSleep[this.index]);
    }

    next() {
        this.index++;
        this.createSleepForm(this.listSleep[this.index]);
    }

}

