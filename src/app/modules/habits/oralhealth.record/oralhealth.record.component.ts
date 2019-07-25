import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { OralHealthRecord } from '../models/oralhealth-record';
import { OralhealthRecordService } from '../services/oralhealth.record.service';

@Component({
    selector: 'oralhealth-record',
    templateUrl: './oralhealth.record.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './oralhealth.record.component.scss']
})
export class OralhealthRecordComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    listOralHealthRecords: Array<OralHealthRecord>;
    oralHealthForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder,
        private oralHealthService: OralhealthRecordService
    ) {
        this.index = 0;
        this.listOralHealthRecords = new Array<OralHealthRecord>();
    }

    ngOnInit() {
        this.createOralHealthFormInit();
    }

    createOralHealthFormInit() {
        this.oralHealthForm = this.fb.group({
            id: [''],
            created_at: [{ value: '', disabled: true }],
            teeth_brushing_freq: [{ value: '', disabled: true }],
            teeth_lesions: this.fb.array([])
        });

    }

    createOralHealthForm(oralhealthRecord: OralHealthRecord) {
        this.oralHealthForm = this.fb.group({
            id: [{ value: oralhealthRecord.id, disabled: true }],
            created_at: [{ value: oralhealthRecord.created_at, disabled: true }],
            teeth_brushing_freq: [{ value: oralhealthRecord.teeth_brushing_freq, disabled: true }],
            teeth_lesions: [{ value: oralhealthRecord.teeth_lesions, disabled: true }]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.oralHealthService.getAll(this.patientId)
                .then(oralhealthrecords => {
                    this.listOralHealthRecords = oralhealthrecords;
                    this.createOralHealthForm(oralhealthrecords[0]);
                })
                .catch();
        }
    }

    prev() {
        if (this.index) {
            this.index--;
        }
        this.createOralHealthForm(this.listOralHealthRecords[this.index]);
    }

    next() {
        this.index++;
        this.createOralHealthForm(this.listOralHealthRecords[this.index]);
    }

}
