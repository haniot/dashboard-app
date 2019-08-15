import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ISubscription } from 'rxjs/Subscription';

import { Patient } from '../../patient/models/patient'
import { PatientService } from '../../patient/services/patient.service'

@Component({
    selector: 'evaluation-component',
    templateUrl: './evaluation.component.html',
    styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() patientId: string;
    patient: Patient;
    private subscriptions: Array<ISubscription>;

    constructor(
        private activeRouter: ActivatedRoute,
        private location: Location,
        private patientService: PatientService
    ) {
        this.patient = new Patient();
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patient_id');
            this.loadPatient();
        }));
        this.loadPatient();
    }

    loadPatient(): void {
        if (this.patientId) {
            this.patientService.getById(this.patientId)
                .then(patient => this.patient = patient)
                .catch();
        }
    }

    onBack(): void {
        this.location.back();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.loadPatient();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
