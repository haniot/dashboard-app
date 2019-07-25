import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoadingService } from '../../../shared/shared.components/loading.component/service/loading.service';
import { PilotStudy } from '../../pilot.study/models/pilot.study';
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service';

@Component({
    selector: 'app-dental-evaluation-list',
    templateUrl: './dental.evaluation.list.component.html',
    styleUrls: ['./dental.evaluation.list.component.scss']
})
export class DentalEvaluationListComponent implements OnInit, AfterViewChecked {
    pilotForm: FormGroup;
    pilotstudy_id: string;
    pilotStudy: PilotStudy;

    constructor(
        private formBuilder: FormBuilder,
        private loadingService: LoadingService,
        private pilotStudyService: PilotStudyService
    ) {
        this.pilotStudy = new PilotStudy();
    }

    ngOnInit() {
        this.createForms();
        this.getPilotStudy();
    }

    createForms() {
        this.pilotForm = this.formBuilder.group({
            pilotstudyId: ['', Validators.required]
        });
    }

    selectStudy(pilotstudy_id) {
        this.pilotForm.get('pilotstudyId').setValue(pilotstudy_id);
        this.pilotstudy_id = pilotstudy_id;
    }

    getPilotStudy(): void {
        this.pilotStudyService.getById(this.pilotstudy_id)
            .then(pilotstudy => {
                this.pilotStudy = pilotstudy
            })
            .catch()

    }

    ngAfterViewChecked() {
        this.loadingService.close();
    }

}
