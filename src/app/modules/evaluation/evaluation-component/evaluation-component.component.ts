import {Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {ISubscription} from 'rxjs/Subscription';

import {Patient, Gender} from 'app/modules/patient/models/patient';
import {PatientService} from 'app/modules/patient/services/patient.service';

@Component({
    selector: 'evaluation-component',
    templateUrl: './evaluation-component.component.html',
    styleUrls: ['./evaluation-component.component.scss']
})
export class EvaluationComponentComponent implements OnInit, OnChanges, OnDestroy {

    @Input() patientId: string;
    @Input() pilotStudyId: string;
    subtitle: string;
    patient: Patient;

    optionsGender: Array<string> = Object.keys(Gender);

    private subscriptions: Array<ISubscription>;

    constructor(
        private activeRouter: ActivatedRoute,
        private location: Location,
        private patientService: PatientService
    ) {
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patient_id');
            this.pilotStudyId = params.get('pilostudy_id');
            this.loadPatient();
        }));
        this.loadPatient();
    }

    loadPatient(): void {
        if (this.pilotStudyId && this.patientId) {
            this.patientService.getById(this.patientId)
                .then(patient => this.patient = patient)
                .catch(errorResponse => {
                    // console.log('Não foi possível buscar paciente!', errorResponse);
                });
        }
    }

    onBack(): void {
        this.location.back();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.loadPatient();
    }

    ngOnDestroy(): void {
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
