import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadingService} from "../../../shared/shared-components/loading-component/service/loading.service";

@Component({
    selector: 'app-dental-evaluation-list',
    templateUrl: './dental-evaluation-list.component.html',
    styleUrls: ['./dental-evaluation-list.component.scss']
})
export class DentalEvaluationListComponent implements OnInit, AfterViewChecked{

    pilotForm: FormGroup;

    pilotstudy_id: string;

    constructor(
        private formBuilder: FormBuilder,
        private loadingService: LoadingService
    ) {
    }

    ngOnInit() {
        this.createForms();
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

    ngAfterViewChecked() {
        this.loadingService.close();
    }

}
