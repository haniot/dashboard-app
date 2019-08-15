import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { OralHealthRecord } from '../models/oral.health.record';

@Component({
    selector: 'oralhealth-record',
    templateUrl: './oral.health.record.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './oral.health.record.component.scss']
})
export class OralHealthRecordComponent implements OnInit, OnChanges {
    @Input() oralHealthRecord: OralHealthRecord;
    oralHealthForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder
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
        if (changes.oralHealthRecord.currentValue !== changes.oralHealthRecord.previousValue) {
            if (this.oralHealthRecord) {
                this.createOralHealthForm(this.oralHealthRecord);
            } else {
                this.oralHealthForm.reset();
            }

        }
    }

}
