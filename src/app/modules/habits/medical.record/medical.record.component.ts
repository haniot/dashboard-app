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
    listMedical: Array<MedicalRecord>;
    medicalForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder,
        private medcalService: MedicalRecordService,
        private sanitizer: DomSanitizer
    ) {
        this.index = 0;
        this.listMedical = new Array<MedicalRecord>();
    }

    ngOnInit() {
        this.createMedicalFormInit();
    }

    createMedicalFormInit() {
        this.medicalForm = this.fb.group({
            id: [''],
            created_at: [{ value: '', disabled: true }],
            chronic_diseases: this.fb.array([])
        });
    }

    createMedicalForm(medicalRecord: MedicalRecord) {
        this.medicalForm = this.fb.group({
            id: [{ value: medicalRecord.id }],
            created_at: [{ value: medicalRecord.created_at, disabled: true }],
            chronic_diseases: [{ value: medicalRecord.chronic_diseases, disabled: true }]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.medcalService.getAll(this.patientId)
                .then(medicalRecords => {
                    this.listMedical = medicalRecords;
                    this.createMedicalForm(medicalRecords[0]);
                })
                .catch();
        } else if (this.medicalRecord && changes.medicalRecord.currentValue !== changes.medicalRecord.previousValue) {
            this.listMedical = new Array<MedicalRecord>();
            this.listMedical.push(this.medicalRecord);
            this.createMedicalForm(this.medicalRecord);
        }
    }

    prev() {
        if (this.index) {
            this.index--;
        }
        this.createMedicalForm(this.listMedical[this.index]);
    }

    next() {
        this.index++;
        this.createMedicalForm(this.listMedical[this.index]);
    }

    getTrustedUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}
