import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {ISubscription} from 'rxjs/Subscription';

import {PilotStudyService} from 'app/modules/pilot-study/services/pilot-study.service';

@Component({
    selector: 'app-patient-component',
    templateUrl: './patient-component.component.html',
    styleUrls: ['./patient-component.component.scss']
})
export class PatientComponentComponent implements OnInit, OnDestroy {

    pilotStudyId: string;

    private subscriptions: Array<ISubscription>;

    constructor(
        private router: Router,
        private activeRouter: ActivatedRoute,
        private pilotStudyService: PilotStudyService) {
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.pilotStudyId = params.get('pilotstudy_id');
            this.router.navigate(['patients', this.pilotStudyId]);
        }));
    }

    newPatient() {
        this.router.navigate(['patients', this.pilotStudyId, 'new']);
    }

    onBack() {
        this.router.navigate(['patients']);
    }

    ngOnDestroy(): void {
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
