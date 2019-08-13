import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MedicalRecord } from '../models/medical.record';
import { MedicalRecordService } from '../services/medical.record.service';

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
        private medcalService: MedicalRecordService,
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
        if (this.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.medcalService.getAll(this.patientId)
                .then(medicalRecords => {
                    this.createMedicalForm(medicalRecords[0]);
                })
                .catch();
        }
        if (changes.medicalRecord.currentValue !== changes.medicalRecord.previousValue) {
            if (this.medicalRecord) {
                this.createMedicalForm(this.medicalRecord);
            } else {
                this.medicalForm.reset();
            }

        }
    }

}
