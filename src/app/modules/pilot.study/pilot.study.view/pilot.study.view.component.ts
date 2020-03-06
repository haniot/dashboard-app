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
export class PilotStudyViewComponent implements OnInit, OnDestroy {
    @Input() pilotStudyId: string;
    pilotStudyForm: FormGroup;
    color = 'accent';
    checked = false;
    disabled = false;
    pilotStudy: PilotStudy;
    professionalsAssociated: Array<HealthProfessional>;
    listOfProfessionalIsEmpty: boolean;
    patientsAssociated: Array<Patient>;
    listOfPatientsIsEmpty: boolean;
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
        this.patientLimit = 5;
        this.professionalPage = PaginatorConfig.page;
        this.professionalPageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.professionalLimit = 5;
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.pilotStudyId = params.get('pilotStudyId');
            if (this.pilotStudyId) {
                this.createForm();
                this.getPilotStudy();
            }
        }));
        this.createForm();
    }

    selectPilotStudy(): void {
        this.selectPilotService.pilotStudyHasUpdated(this.pilotStudyId);
    }

    getPilotStudy() {
        if (this.pilotStudyId) {
            this.pilotStudyService.getById(this.pilotStudyId)
                .then(res => {
                    this.pilotStudyForm.patchValue(res);
                    this.pilotStudy = res;
                    this.selectPilotStudy();
                    this.loadHealthProfessionals();
                    this.loadPatients();
                }).catch(() => {
                const userId = this.localStorageService.getItem('user');
                const localPilotSelected = this.localStorageService.getItem(userId);
                this.selectPilotService.pilotStudyHasUpdated(localPilotSelected);
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-FIND'));
                this.listOfProfessionalIsEmpty = true;
                this.listOfPatientsIsEmpty = true;
            })
        }
    }

    loadHealthProfessionals(): void {
        this.professionalsAssociated = []
        this.pilotStudyService.getHealthProfessionalsByPilotStudyId(this.pilotStudy.id, this.professionalPage, this.professionalLimit)
            .then((httpResponse => {
                this.professionalLength = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    this.professionalsAssociated = httpResponse.body;
                }
                this.listOfProfessionalIsEmpty = this.professionalsAssociated.length === 0;
            }))
            .catch(() => {
                this.listOfProfessionalIsEmpty = this.professionalsAssociated.length === 0;
            });
    }

    loadPatients(): void {
        this.patientsAssociated = []
        this.pilotStudyService.getPatientsByPilotStudy(this.pilotStudy.id, this.patientPage, this.patientLimit)
            .then((httpResponse => {
                this.patientLength = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    this.patientsAssociated = httpResponse.body;
                }
                this.listOfPatientsIsEmpty = this.patientsAssociated.length === 0;
            }))
            .catch(() => {
                this.listOfPatientsIsEmpty = this.patientsAssociated.length === 0;
            });
    }

    createForm() {
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

    // ngOnChanges() {
    //     this.createForm();
    //     this.getPilotStudy();
    // }

    ngOnDestroy(): void {
        /* cancel all subscriptions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
