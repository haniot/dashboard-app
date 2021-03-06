import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SocioDemographicRecord } from '../models/socio.demographic.record';
import { MotherSchoolarityPipe } from '../pipes/mother.schoolarity.pipe';
import { CorAndRacePipe } from '../pipes/cor.race.pipe';

@Component({
    selector: 'sociodemographic-record',
    templateUrl: './socio.demographic.record.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class SocioDemographicRecordComponent implements OnInit, OnChanges {
    @Input() socioDemographicRecord: SocioDemographicRecord;
    socioDemographicForm: FormGroup;
    index: number;

    constructor(
        private fb: FormBuilder,
        private motherSchoolarityPipe: MotherSchoolarityPipe,
        private corAndRacePipe: CorAndRacePipe
    ) {
        this.index = 0;
        this.socioDemographicRecord = new SocioDemographicRecord();
    }

    ngOnInit() {
        this.createSocioDemographicFormInit();
    }


    createSocioDemographicFormInit() {
        this.socioDemographicForm = this.fb.group({
            color_race: [{ value: '', disabled: true }],
            mother_scholarity: [{ value: '', disabled: true }],
            people_in_home: [{ value: 0, disabled: true }]
        });

    }

    createSocioDemographicForm(sociodemographicRecord: SocioDemographicRecord) {
        this.socioDemographicForm = this.fb.group({
            color_race: [{ value: sociodemographicRecord.color_race, disabled: true }],
            mother_scholarity: [{ value: sociodemographicRecord.mother_scholarity, disabled: true }],
            people_in_home: [{ value: sociodemographicRecord.people_in_home, disabled: true }]
        });
        this.socioDemographicForm.get('color_race')
            .patchValue(this.corAndRacePipe.transform(sociodemographicRecord.color_race));
        this.socioDemographicForm.get('mother_scholarity')
            .patchValue(this.motherSchoolarityPipe.transform(sociodemographicRecord.mother_scholarity));
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.socioDemographicRecord.currentValue !== changes.socioDemographicRecord.previousValue) {
            if (this.socioDemographicRecord) {
                this.createSocioDemographicForm(this.socioDemographicRecord);
            } else {
                this.socioDemographicForm.reset();
            }
        }
    }
}
