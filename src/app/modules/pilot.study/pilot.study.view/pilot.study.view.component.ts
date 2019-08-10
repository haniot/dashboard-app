import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { PilotStudyService } from '../services/pilot.study.service';
import { PilotStudy } from '../models/pilot.study';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';

@Component({
    selector: 'app-pilot-study-view',
    templateUrl: './pilot.study.view.component.html',
    styleUrls: ['./pilot.study.view.component.scss']
})
export class PilotStudyViewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() pilotStudyId: string;
    pilotStudyForm: FormGroup;
    color = 'accent';
    checked = false;
    disabled = false;
    pilotStudy: PilotStudy;
    userHealthArea: string;
    private subscriptions: Array<ISubscription>;

    constructor(
        private fb: FormBuilder,
        private pilotStudyService: PilotStudyService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private _location: Location,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService
    ) {
        this.pilotStudy = new PilotStudy();
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.loadUserHealthArea();
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.pilotStudyId = params.get('pilotStudyId');
            if (this.pilotStudyId) {
                this.createForm();
                this.getPilotStudy();
            }
        }));

        this.createForm();
        this.getPilotStudy();
    }

    loadUserHealthArea(): void {
        this.userHealthArea = this.localStorageService.getItem('health_area');
    }

    getPilotStudy() {
        if (this.pilotStudyId) {
            this.pilotStudyService.getById(this.pilotStudyId)
                .then(res => {
                    this.pilotStudyForm.setValue(res);
                    this.pilotStudy = res;
                }).catch((err) => {
                console.log(err)
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-FIND'));
            })
        }
    }

    createForm() {
        if (this.pilotStudyId) {
            this.pilotStudyForm = this.fb.group({
                id: [''],
                name: [''],
                location: [''],
                start: [''],
                end: [''],
                total_health_professionals: [''],
                total_patients: [''],
                is_active: [{ value: true, disabled: true }]
            });
        } else {
            this.pilotStudyForm = this.fb.group({
                id: [''],
                name: [''],
                location: [''],
                start: [''],
                end: [''],
                total_health_professionals: [''],
                total_patients: [''],
                is_active: [{ value: true, disabled: true }]
            });
        }
    }


    trackById(index, item) {
        return item.id;
    }

    ngOnChanges() {
        this.createForm();
        this.getPilotStudy();
    }

    ngOnDestroy(): void {
        /* cancel all subscriptions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
