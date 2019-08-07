import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ISubscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-patient-component',
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit, OnDestroy {
    pilotStudyId: string;
    private subscriptions: Array<ISubscription>;

    constructor(
        private router: Router,
        private activeRouter: ActivatedRoute) {
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.pilotStudyId = params.get('pilotstudy_id');
            this.router.navigate(['/app/patients', this.pilotStudyId]);
        }));
    }

    newPatient() {
        this.router.navigate(['/app/patients', this.pilotStudyId, 'new']);
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
