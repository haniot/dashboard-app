import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PhysicalActivityHabitsRecord } from '../models/physicalActivity';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PhysicalActivityRecordService } from '../services/physical-activity-record.service';
import { PhysicalActivityPipe } from '../pipes/physical-activity-frequency.pipe';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'physical-activity-habits',
    templateUrl: './physical-activity-habits.component.html',
    styleUrls: ['../shared-style/shared-styles.scss', './physical-activity-habits.component.scss']
})
export class PhysicalActivityHabitsComponent implements OnInit, OnChanges {

    listPhysicalActivits: Array<PhysicalActivityHabitsRecord>;
    physicalActivityForm: FormGroup;
    @Input() patientId: string;
    @Input() physicalRecord: PhysicalActivityHabitsRecord;
    index: number;

    constructor(
        private fb: FormBuilder,
        private physicalActivityService: PhysicalActivityRecordService,
        private physicalActivityPipe: PhysicalActivityPipe,
        private translateService: TranslateService,
        private sanitizer: DomSanitizer
    ) {
        this.index = 0;
        this.listPhysicalActivits = new Array<PhysicalActivityHabitsRecord>();
    }

    ngOnInit() {
        this.createPhysicalActivityFormInit();
    }

    /**Create form feeding */
    createPhysicalActivityFormInit() {
        this.physicalActivityForm = this.fb.group({
            id: [''],
            created_at: [{ value: '', disabled: true }],
            school_activity_freq: [{ value: '', disabled: true }],
            weekly_activities: this.fb.array([])
        });
    }

    createPhysicalActivityForm(physicalActivity: PhysicalActivityHabitsRecord) {
        this.physicalActivityForm = this.fb.group({
            id: [{ value: physicalActivity.id }],
            created_at: [{ value: physicalActivity.created_at, disabled: true }],
            school_activity_freq: [{ value: physicalActivity.school_activity_freq, disabled: true }],
            weekly_activities: [{ value: physicalActivity.weekly_activities, disabled: true }]
        });
        this.physicalActivityForm.get('school_activity_freq')
            .patchValue(this.translateService.instant(this.physicalActivityPipe.transform(physicalActivity.school_activity_freq)));

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId.currentValue != changes.patientId.previousValue) {
            this.physicalActivityService.getAll(this.patientId)
                .then(physicalRecords => {
                    this.listPhysicalActivits = physicalRecords;
                    this.createPhysicalActivityForm(physicalRecords[0]);// FIXME: Aqui estou pegando apenas o primeiro registro
                })
                .catch(errorResponse => {
                    // this.toastService.error('Não foi possível buscar hábitos de sono!');
                    // console.log('Não foi possível buscar hábitos de sono!', errorResponse);
                });
        } else if (this.physicalRecord && changes.physicalRecord.currentValue != changes.physicalRecord.previousValue) {
            this.listPhysicalActivits = new Array<PhysicalActivityHabitsRecord>();
            this.listPhysicalActivits.push(this.physicalRecord);
            this.createPhysicalActivityForm(this.physicalRecord);
        }
    }

    prev() {
        if (this.index) {
            this.index--;
        }
        this.createPhysicalActivityForm(this.listPhysicalActivits[this.index]);
    }

    next() {
        this.index++;
        this.createPhysicalActivityForm(this.listPhysicalActivits[this.index]);
    }

    getTrustedUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}
