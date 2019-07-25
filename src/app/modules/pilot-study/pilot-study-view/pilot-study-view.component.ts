import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { HealthProfessional } from 'app/modules/admin/models/users';
import { PilotStudyService } from '../services/pilot-study.service';
import { PilotStudy } from '../models/pilot.study';
import { LocalStorageService } from '../../../shared/shared-services/localstorage.service';

@Component({
    selector: 'app-pilot-study-view',
    templateUrl: './pilot-study-view.component.html',
    styleUrls: ['./pilot-study-view.component.scss']
})
export class PilotStudyViewComponent implements OnInit, OnChanges, OnDestroy {
    @Input() pilotStudyId: string;
    pilotStudyForm: FormGroup;
    professionalsForm: FormGroup;
    listProf: Array<HealthProfessional> = [];
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
                }).catch(() => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-FIND'));
            })
        }
    }

    createForm() {
        if (this.pilotStudyId) {
            this.pilotStudyForm = this.fb.group({
                id: [''],
                name: ['', Validators.required],
                location: ['', Validators.required],
                start: ['', Validators.required],
                end: ['', Validators.required],
                health_professionals_id: ['', Validators.required],
                is_active: [true, Validators.required]
            });
        } else {
            this.pilotStudyForm = this.fb.group({
                id: [''],
                name: ['', Validators.required],
                location: [''],
                start: ['', Validators.required],
                end: [{ value: '', disabled: true }, Validators.required],
                health_professionals_id: ['', Validators.required],
                is_active: [true, Validators.required]
            });
        }
        this.professionalsForm = this.fb.group({
            health_professionals_id_add: ['', Validators.required]
        });

        this.subscriptions.push(this.pilotStudyForm.get('start').valueChanges.subscribe(val => {
            this.pilotStudyForm.get('end').enable();
        }));
    }

    onSubimt() {
        const form = this.pilotStudyForm.getRawValue();
        if (!this.pilotStudyId) {
            this.pilotStudyService.create(form)
                .then(pilotStudy => {
                    this.pilotStudyForm.reset();
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.STUDY-CREATED'));
                })
                .catch(error => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-CREATED'));
                });
        } else {
            this.pilotStudyService.update(form)
                .then(() => {
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.STUDY-UPDATED'));
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-UPDATED'));
                });
        }
    }

    trackById(index, item) {
        return item.id;
    }

    onBack() {
        this._location.back();
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
