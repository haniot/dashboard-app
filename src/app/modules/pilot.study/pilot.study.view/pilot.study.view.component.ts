import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PageEvent } from '@angular/material'

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { PilotStudyService } from '../services/pilot.study.service';
import { PilotStudy } from '../models/pilot.study';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { SelectPilotStudyService } from '../../../shared/shared.components/select.pilotstudy/service/select.pilot.study.service'
import { Patient } from '../../patient/models/patient'
import { HealthProfessional } from '../../admin/models/health.professional'
import { ConfigurationBasic } from '../../config.matpaginator'
import { AuthService } from '../../../security/auth/services/auth.service'

const PaginatorConfig = ConfigurationBasic;

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
    professionalsAssociated: Array<HealthProfessional>;
    patientsAssociated: Array<Patient>;
    userHealthArea: string;
    private subscriptions: Array<ISubscription>;
    /* pagging settings*/
    patientPageSizeOptions: number[];
    patientPageEvent: PageEvent;
    patientPage: number;
    patientLimit: number;
    patientLength: number;
    /* pagging settings*/
    professionalPageSizeOptions: number[];
    professionalPageEvent: PageEvent;
    professionalPage: number;
    professionalLimit: number;
    professionalLength: number;

    constructor(
        private fb: FormBuilder,
        private pilotStudyService: PilotStudyService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private _location: Location,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private selectPilotService: SelectPilotStudyService,
        private authService: AuthService
    ) {
        this.pilotStudy = new PilotStudy();
        this.subscriptions = new Array<ISubscription>();
        this.professionalsAssociated = new Array<HealthProfessional>();
        this.patientsAssociated = new Array<Patient>();
        this.patientPage = PaginatorConfig.page;
        this.patientPageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.patientLimit = PaginatorConfig.limit;
        this.professionalPage = PaginatorConfig.page;
        this.professionalPageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.professionalLimit = PaginatorConfig.limit;
    }

    ngOnInit() {
        this.loadUserHealthArea();
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.pilotStudyId = params.get('pilotStudyId');
            if (this.pilotStudyId) {
                this.createForm();
                this.getPilotStudy();
                this.selectPilotStudy();
            }
        }));
        if (!this.pilotStudyId) {
            this.createForm();
            this.getPilotStudy();
        }
    }

    selectPilotStudy(): void {
        const userId = this.localStorageService.getItem('user');
        if (userId) {
            this.localStorageService.setItem(userId, this.pilotStudyId);
            this.selectPilotService.pilotStudyHasUpdated(this.pilotStudyId);
        }
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
                    this.loadHealthProfessionals();
                    this.loadPatients();
                }).catch(() => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-FIND'));
            })
        }
    }

    loadHealthProfessionals(): void {
        this.pilotStudyService.getHealthProfessionalsByPilotStudyId(this.pilotStudy.id, this.professionalPage, this.professionalLimit)
            .then((httpResponse => {
                this.professionalLength = parseInt(httpResponse.headers.get('x-total-count'), 10);
                this.professionalsAssociated = []
                if (httpResponse.body && httpResponse.body.length) {
                    this.professionalsAssociated = httpResponse.body;
                }
            }))
            .catch(() => {
            });
    }

    loadPatients(): void {
        this.pilotStudyService.getPatientsByPilotStudy(this.pilotStudy.id, this.patientPage, this.patientLimit)
            .then((httpResponse => {
                this.patientLength = parseInt(httpResponse.headers.get('x-total-count'), 10);
                this.patientsAssociated = []
                if (httpResponse.body && httpResponse.body.length) {
                    this.patientsAssociated = httpResponse.body;
                }
            }))
            .catch(() => {
            });
    }

    createForm() {
        if (this.pilotStudyId) {
            this.pilotStudyForm = this.fb.group({
                id: [''],
                created_at: [''],
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
                created_at: [''],
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

    clickProfessionalPagination(event): void {
        this.professionalPageEvent = event;
        this.professionalPage = event.pageIndex + 1;
        this.professionalLimit = event.pageSize;
        this.loadHealthProfessionals()
    }

    clickPatientPagination(event) {
        this.patientPageEvent = event;
        this.patientPage = event.pageIndex + 1;
        this.patientLimit = event.pageSize;
        this.loadPatients()
    }

    editHealthProfessional(healthProfessionalId: string): void {
        if (this.authService.decodeToken().sub_type === 'admin') {
            this.router.navigate(['/app/admin/healthprofessionals', healthProfessionalId]);
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
