import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { OralHealthRecord } from '../models/oralhealth-record';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OralHealthRecordService } from '../services/oralhealth-record.service';

@Component({
    selector: 'oralhealth-record',
    templateUrl: './oralhealth-record.component.html',
    styleUrls: ['../shared-style/shared-styles.scss', './oralhealth-record.component.scss']
})
export class OralhealthRecordComponent implements OnInit {

    listOralhealthRecords: Array<OralHealthRecord>;
    oralhealthForm: FormGroup;
    @Input() patientId: string;
    index: number;

    constructor(
        private fb: FormBuilder,
        private oralhealthService: OralHealthRecordService
    ) {
        this.index = 0;
        this.listOralhealthRecords = new Array<OralHealthRecord>();
    }

    ngOnInit() {
        this.createOralHealthFormInit();
    }

    /**Create form oral health */
    createOralHealthFormInit() {
        this.oralhealthForm = this.fb.group({
            id: [''],
            created_at: [{ value: '', disabled: true }],
            teeth_brushing_freq: [{ value: '', disabled: true }],
            teeth_lesions: this.fb.array([])
        });

    }

    createOralHealthForm(oralhealthRecord: OralHealthRecord) {
        this.oralhealthForm = this.fb.group({
            id: [{ value: oralhealthRecord.id, disabled: true }],
            created_at: [{ value: oralhealthRecord.created_at, disabled: true }],
            teeth_brushing_freq: [{ value: oralhealthRecord.teeth_brushing_freq, disabled: true }],
            teeth_lesions: [{ value: oralhealthRecord.teeth_lesions, disabled: true }]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId.currentValue != changes.patientId.previousValue) {
            this.oralhealthService.getAll(this.patientId)
                .then(oralhealthrecords => {
                    this.listOralhealthRecords = oralhealthrecords;
                    this.createOralHealthForm(oralhealthrecords[0]);// FIXME: Aqui estou pegando apenas o primeiro registro
                })
                .catch(errorResponse => {
                    //this.toastService.error('Não foi possível buscar coesão familiar!');
                    //console.log('Não foi possível buscar coesão familiar!', errorResponse);
                });
        }
    }

    prev() {
        if (this.index) {
            this.index--;
        }
        this.createOralHealthForm(this.listOralhealthRecords[this.index]);
    }

    next() {
        this.index++;
        this.createOralHealthForm(this.listOralhealthRecords[this.index]);
    }

}
