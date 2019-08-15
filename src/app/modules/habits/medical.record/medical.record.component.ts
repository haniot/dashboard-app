import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MedicalRecord } from '../models/medical.record';

@Component({
    selector: 'medical-record',
    templateUrl: './medical.record.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './medical.record.component.scss']
})
export class MedicalRecordComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    @Input() medicalRecord: MedicalRecord;
    medicalForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder,
        private sanitizer: DomSanitizer
    ) {
        this.index = 0;
    }

    ngOnInit() {
        this.createMedicalFormInit();
    }

    createMedicalFormInit() {
        this.medicalForm = this.fb.group({
            chronic_diseases: this.fb.array([])
        });
    }

    createMedicalForm(medicalRecord: MedicalRecord) {
        this.medicalForm = this.fb.group({
            chronic_diseases: [{ value: medicalRecord.chronic_diseases, disabled: true }]
        });
    }

    getTrustedUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.medicalRecord.currentValue !== changes.medicalRecord.previousValue) {
            if (this.medicalRecord) {
                this.createMedicalForm(this.medicalRecord);
            } else {
                this.medicalForm.reset();
            }

        }
    }

}
