import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { OralHealthRecord } from '../models/oral.health.record';
import { OralhealthRecordService } from '../services/oralhealth.record.service';
import { MedicalRecord } from '../models/medical.record'

@Component({
    selector: 'oralhealth-record',
    templateUrl: './oral.health.record.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './oral.health.record.component.scss']
})
export class OralHealthRecordComponent implements OnInit, OnChanges {
    @Input() oralHealthRecord: OralHealthRecord;
    @Input() patientId: string;
    oralHealthForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder,
        private oralHealthService: OralhealthRecordService
    ) {
        this.index = 0;
        this.oralHealthRecord = new OralHealthRecord();
    }

    ngOnInit() {
        this.createOralHealthFormInit();
    }

    createOralHealthFormInit() {
        this.oralHealthForm = this.fb.group({
            teeth_brushing_freq: [{ value: '', disabled: true }],
            teeth_lesions: this.fb.array([])
        });

    }

    createOralHealthForm(oralhealthRecord: OralHealthRecord) {
        this.oralHealthForm = this.fb.group({
            teeth_brushing_freq: [{ value: oralhealthRecord.teeth_brushing_freq, disabled: true }],
            teeth_lesions: [{ value: oralhealthRecord.teeth_lesions, disabled: true }]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.oralHealthService.getAll(this.patientId)
                .then(oralhealthrecords => {
                    this.createOralHealthForm(oralhealthrecords[0]);
                })
                .catch();
        }
        if (changes.oralHealthRecord.currentValue !== changes.oralHealthRecord.previousValue) {
            if (this.oralHealthRecord) {
                this.createOralHealthForm(this.oralHealthRecord);
            } else {
                this.oralHealthForm.reset();
            }

        }
    }

}
