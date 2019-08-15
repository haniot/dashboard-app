import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ISubscription } from 'rxjs/Subscription';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'

@Component({
    selector: 'patient-component',
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit, OnDestroy {
    pilotStudyId: string;
    private subscriptions: Array<ISubscription>;

    constructor(
        private router: Router,
        private localStorageService: LocalStorageService) {
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit(): void {
        const userId = this.localStorageService.getItem('user');
        this.pilotStudyId = this.localStorageService.getItem(userId);
    }

    newPatient() {
        this.router.navigate(['/app/patients/new']);
    }

    onBack() {
        this.router.navigate(['/app/patients']);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
