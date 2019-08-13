import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { PhysicalActivityRecordService } from '../services/physical.activity.record.service';
import { PhysicalActivityPipe } from '../pipes/physical.activity.frequency.pipe';
import { PhysicalActivityHabitsRecord } from '../models/physical.activity';

@Component({
    selector: 'physical-activity-habits',
    templateUrl: './physical.activity.habits.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './physical.activity.habits.component.scss']
})
export class PhysicalActivityHabitsComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    @Input() physicalRecord: PhysicalActivityHabitsRecord;
    physicalActivityForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder,
        private physicalActivityService: PhysicalActivityRecordService,
        private physicalActivityPipe: PhysicalActivityPipe,
        private translateService: TranslateService,
        private sanitizer: DomSanitizer
    ) {
        this.index = 0;
        this.physicalRecord = new PhysicalActivityHabitsRecord();
    }

    ngOnInit() {
        this.createPhysicalActivityFormInit();
    }

    createPhysicalActivityFormInit() {
        this.physicalActivityForm = this.fb.group({
            school_activity_freq: [{ value: '', disabled: true }],
            weekly_activities: this.fb.array([])
        });
    }

    createPhysicalActivityForm(physicalActivity: PhysicalActivityHabitsRecord) {
        this.physicalActivityForm = this.fb.group({
            school_activity_freq: [{ value: physicalActivity.school_activity_freq, disabled: true }],
            weekly_activities: [{ value: physicalActivity.weekly_activities, disabled: true }]
        });
        this.physicalActivityForm.get('school_activity_freq')
            .patchValue(this.translateService.instant(this.physicalActivityPipe.transform(physicalActivity.school_activity_freq)));

    }

    getTrustedUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.physicalActivityService.getAll(this.patientId)
                .then(physicalRecords => {
                    this.createPhysicalActivityForm(physicalRecords[0]);
                })
                .catch();
        }
        if (changes.physicalRecord.currentValue !== changes.physicalRecord.previousValue) {
            if (this.physicalRecord) {
                this.createPhysicalActivityForm(this.physicalRecord);
            } else {
                this.physicalActivityForm.reset();
            }
        }
    }

}
