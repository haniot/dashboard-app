import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
    selector: 'app-evaluation-list',
    templateUrl: './nutritional.evaluation.list.component.html',
    styleUrls: ['./nutritional.evaluation.list.component.scss'],
    providers: [{
        provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
    }]
})
export class NutritionalEvaluationListComponent implements OnInit {
    pilotForm: FormGroup;
    patientForm: FormGroup;
    pilotstudy_id: string;
    patient_id: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.patient_id = '';
        this.pilotstudy_id = '';
    }

    ngOnInit() {
        this.createForms();
    }

    createForms() {
        this.pilotForm = this.formBuilder.group({
            pilotstudyId: ['', Validators.required]
        });
        this.patientForm = this.formBuilder.group({
            patientId: ['', Validators.required]
        });
    }

    selectStudy(pilotstudy_id, stepper) {
        this.patientForm.reset();
        this.pilotForm.get('pilotstudyId').setValue(pilotstudy_id);
        this.pilotstudy_id = pilotstudy_id;
        stepper.next();
    }

    selectPatient(patient_id) {
        this.patientForm.get('patientId').setValue(patient_id);
        this.patient_id = patient_id;
        this.router.navigate(['/app/evaluations/nutritional', patient_id]);
    }
}
