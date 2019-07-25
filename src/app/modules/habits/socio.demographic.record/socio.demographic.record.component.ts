import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SocioDemographicRecord } from '../models/sociodemographic-record';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SocioDemographicRecordService } from '../services/socio.demographic.record.service';
import { MotherSchoolarityPipe } from '../pipes/mother.schoolarity.pipe';
import { CorAndRacePipe } from '../pipes/cor.race.pipe';

@Component({
    selector: 'sociodemographic-record',
    templateUrl: './socio.demographic.record.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class SocioDemographicRecordComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    listSocioDemographic: Array<SocioDemographicRecord>;
    socioDemographicForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder,
        private socioDemographicService: SocioDemographicRecordService,
        private motherSchoolarityPipe: MotherSchoolarityPipe,
        private corAndRacePipe: CorAndRacePipe
    ) {
        this.index = 0;
        this.listSocioDemographic = new Array<SocioDemographicRecord>();
    }

    ngOnInit() {
        this.createSocioDemographicFormInit();
    }


    createSocioDemographicFormInit() {
        this.socioDemographicForm = this.fb.group({
            id: [''],
            created_at: [{ value: '', disabled: true }],
            color_race: [{ value: '', disabled: true }],
            mother_scholarity: [{ value: '', disabled: true }],
            people_in_home: [{ value: 0, disabled: true }]
        });

    }

    createSocioDemographicForm(sociodemographicRecord: SocioDemographicRecord) {
        this.socioDemographicForm = this.fb.group({
            id: [{ value: sociodemographicRecord.id, disabled: true }],
            created_at: [{ value: sociodemographicRecord.created_at, disabled: true }],
            color_race: [{ value: sociodemographicRecord.color_race, disabled: true }],
            mother_scholarity: [{ value: sociodemographicRecord.mother_scholarity, disabled: true }],
            people_in_home: [{ value: sociodemographicRecord.people_in_home, disabled: true }]
        });
        this.socioDemographicForm.get('color_race')
            .patchValue(this.corAndRacePipe.transform(sociodemographicRecord.color_race));
        this.socioDemographicForm.get('mother_schoolarity')
            .patchValue(this.motherSchoolarityPipe.transform(sociodemographicRecord.mother_scholarity));
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.socioDemographicService.getAll(this.patientId)
                .then(sociodemographics => {
                    this.listSocioDemographic = sociodemographics;
                    this.createSocioDemographicForm(sociodemographics[0]);
                })
                .catch();
        }
    }

    prev() {
        if (this.index) {
            this.index--;
        }
        this.createSocioDemographicForm(this.listSocioDemographic[this.index]);
    }

    next() {
        this.index++;
        this.createSocioDemographicForm(this.listSocioDemographic[this.index]);
    }

}
