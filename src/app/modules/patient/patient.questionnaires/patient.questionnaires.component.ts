import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import { PilotStudy } from '../../pilot.study/models/pilot.study'
import { ISubscription } from 'rxjs/Subscription'
import { NutritionalQuestionnaire } from '../../habits/models/nutritional.questionnaire'
import { OdontologicalQuestionnaire } from '../../habits/models/odontological.questionnaire'
import { PatientService } from '../services/patient.service'
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service'
import { ToastrService } from 'ngx-toastr'
import { ActivatedRoute, Router } from '@angular/router'
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'
import { TranslateService } from '@ngx-translate/core'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { NutritionalQuestionnairesService } from '../../habits/services/nutritional.questionnaires.service'
import { OdontologicalQuestionnairesService } from '../../habits/services/odontological.questionnaires.service'
import { Patient } from '../models/patient'
import { PageEvent } from '@angular/material/paginator'
import { ConfigurationBasic } from '../../config.matpaginator'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'patient-questionnaires',
    templateUrl: './patient.questionnaires.component.html',
    styleUrls: ['../shared.style/shared.style.scss']
})
export class PatientQuestionnairesComponent implements OnInit, OnDestroy {

    patientForm: FormGroup;
    pilotStudy: PilotStudy;
    patientId: string;
    showMeasurements: boolean;
    showLogMeasurements: boolean;
    configVisibility = {
        weight: true,
        height: false,
        fat: false,
        circumference: false,
        temperature: false,
        glucose: false,
        pressure: false,
        heartRate: false
    };
    private subscriptions: Array<ISubscription>;
    nutritionalQuestionnaire: NutritionalQuestionnaire;
    odontologicalQuestionnaire: OdontologicalQuestionnaire;
    nutritionalQuestionnaireOptions: {
        page: number, limit: number, pageSizeOptions: number[], length: number, pageEvent: PageEvent
    };
    odontologicalQuestionnaireOptions: {
        page: number, limit: number, pageSizeOptions: number[], length: number, pageEvent: PageEvent
    };
    removingQuestionnaire: boolean;
    loadingNutritionalQuestionnaire: boolean;
    loadingOdontologicalQuestionnaire: boolean;
    fadeInNutritioalQuestionnaire: string;
    fadeInOdontologicalQuestionnaire: string;

    constructor(
        private fb: FormBuilder,
        private patientService: PatientService,
        private pilotStudiesService: PilotStudyService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private modalService: ModalService,
        private nutritionalQuestionnaireService: NutritionalQuestionnairesService,
        private odontologicalQuestionnaireService: OdontologicalQuestionnairesService
    ) {
        this.subscriptions = new Array<ISubscription>();
        this.showMeasurements = false;
        this.showLogMeasurements = false;
        this.nutritionalQuestionnaire = new NutritionalQuestionnaire();
        this.odontologicalQuestionnaire = new OdontologicalQuestionnaire();
        this.nutritionalQuestionnaireOptions = {
            page: PaginatorConfig.page,
            pageSizeOptions: [1],
            limit: 1,
            length: 0,
            pageEvent: undefined
        };
        this.odontologicalQuestionnaireOptions = {
            page: PaginatorConfig.page,
            pageSizeOptions: [1],
            limit: 1,
            length: 0,
            pageEvent: undefined
        };
        this.removingQuestionnaire = false;
        this.loadingNutritionalQuestionnaire = true;
        this.loadingOdontologicalQuestionnaire = true;
    }


    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.getPatient();
        }));
        this.createPatientFormInit();
    }

    createPatientFormInit() {
        this.patientForm = this.fb.group({
            id: [''],
            created_at: [''],
            selected_pilot_study: [{ value: '', disabled: true }],
            name: [{ value: '', disabled: true }],
            email: [{ value: '', disabled: true }],
            phone_number: [{ value: '', disabled: true }],
            gender: [{ value: '', disabled: true }],
            birth_date: [{ value: '', disabled: true }],
            last_login: [{ value: '', disabled: true }]
            // last_sync: [{ value: '', disabled: true }]
        });
    }

    createPatientForm(patient: Patient) {
        this.patientForm = this.fb.group({
            id: [patient.id],
            created_at: [patient.created_at],
            selected_pilot_study: [patient.selected_pilot_study],
            name: [{ value: patient.name, disabled: true }],
            email: [{ value: patient.email, disabled: true }],
            phone_number: [{ value: patient.phone_number, disabled: true }],
            gender: [{ value: patient.gender, disabled: true }],
            birth_date: [{ value: patient.birth_date, disabled: true }],
            last_login: [{ value: patient.last_login, disabled: true }]
            // last_sync: [{ value: patient.last_sync, disabled: true }]
        });
    }

    getPatient(): void {
        const patientLocal = JSON.parse(this.localStorageService.getItem('patientSelected'));
        if (this.patientId !== patientLocal.id) {
            this.patientService.getById(this.patientId)
                .then(patient => {
                    this.localStorageService.selectedPatient(patient);
                    this.createPatientForm(patient);
                    this.getQuestionnaires();
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-FIND'));
                });
        } else {
            this.localStorageService.selectedPatient(patientLocal);
            this.createPatientForm(patientLocal);
            this.getQuestionnaires();
        }
    }

    openModalConfirmationRemoveNutritionalQuestionnaire(): void {
        this.modalService.open('confirmationRemoveNutritionalQuestionnaire');
    }

    closeModalConfirmationNutritionalQuestionnaire(): void {
        this.modalService.close('confirmationRemoveNutritionalQuestionnaire');
    }

    nutritionalQuestionnairePageEvent(pageEvent: PageEvent): void {
        this.loadingNutritionalQuestionnaire = true;
        /* + 1 because pageIndex starts at 0*/
        this.nutritionalQuestionnaireOptions.page = pageEvent.pageIndex + 1;
        this.nutritionalQuestionnaireOptions.limit = pageEvent.pageSize;
        this.getAllNutritionalQuestionnaires();
    }

    getAllNutritionalQuestionnaires(): void {
        this.nutritionalQuestionnaireService
            .getAll(this.patientId, this.nutritionalQuestionnaireOptions.page, this.nutritionalQuestionnaireOptions.limit)
            .then(httpResponse => {
                this.nutritionalQuestionnaire = new NutritionalQuestionnaire();
                this.nutritionalQuestionnaireOptions.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    const nutritionalQuestionnaires = httpResponse.body;
                    this.nutritionalQuestionnaire = nutritionalQuestionnaires[0];
                    this.fadeInNutritioalQuestionnaire = 'fadeIn';
                    this.cleanFadeIn();
                }
                this.loadingNutritionalQuestionnaire = false;
            })
            .catch(() => {
                this.loadingNutritionalQuestionnaire = false;
            })
    }

    removeNutritionalQuestionnaires(): void {
        this.removingQuestionnaire = true;
        this.closeModalConfirmationNutritionalQuestionnaire();
        this.nutritionalQuestionnaireService
            .remove(this.patientId, this.nutritionalQuestionnaire.id)
            .then(() => {
                this.getAllNutritionalQuestionnaires();
                this.removingQuestionnaire = false;
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-DELETED'));
            })
            .catch((errorResponse => {
                this.removingQuestionnaire = false;

                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-NOT-DELETED'));
            }))
    }

    openModalConfirmationRemoveOdontologicalQuestionnaire(): void {
        this.modalService.open('confirmationRemoveOdontologicalQuestionnaire');
    }

    closeModalConfirmationOdontologicalQuestionnaire(): void {
        this.modalService.close('confirmationRemoveOdontologicalQuestionnaire');
    }

    odontologicalQuestionnairePageEvent(pageEvent: PageEvent): void {
        this.loadingOdontologicalQuestionnaire = true;
        /* + 1 because pageIndex starts at 0*/
        this.odontologicalQuestionnaireOptions.page = pageEvent.pageIndex + 1;
        this.odontologicalQuestionnaireOptions.limit = pageEvent.pageSize;
        this.getAllOdontologicalQuestionnaires();
    }

    getAllOdontologicalQuestionnaires(): void {
        this.odontologicalQuestionnaireService
            .getAll(this.patientId, this.odontologicalQuestionnaireOptions.page, this.odontologicalQuestionnaireOptions.limit)
            .then(httpResponse => {
                this.odontologicalQuestionnaire = new OdontologicalQuestionnaire();
                this.odontologicalQuestionnaireOptions.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    const odontologicalQuestionnaires = httpResponse.body;
                    this.odontologicalQuestionnaire = odontologicalQuestionnaires[0];
                    this.fadeInOdontologicalQuestionnaire = 'fadeIn';
                    this.cleanFadeIn();
                }
                this.loadingOdontologicalQuestionnaire = false;
            })
            .catch(() => {
                this.loadingOdontologicalQuestionnaire = false;
            })
    }

    removeOdontologicalQuestionnaires(): void {
        this.removingQuestionnaire = true;
        this.closeModalConfirmationOdontologicalQuestionnaire();
        this.odontologicalQuestionnaireService
            .remove(this.patientId, this.odontologicalQuestionnaire.id)
            .then(() => {
                this.getAllOdontologicalQuestionnaires();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-DELETED'));
                this.removingQuestionnaire = false;
            })
            .catch((() => {
                this.removingQuestionnaire = false;
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-NOT-DELETED'));
            }))
    }

    clickOnMatTab(event) {
        switch (event.index) {
            case 2:
                this.showMeasurements = true;
                break;
            case 3:
                this.showLogMeasurements = true;
                break;
        }
    }

    cleanFadeIn(): void {
        setTimeout(() => {
            this.fadeInNutritioalQuestionnaire = '';
            this.fadeInOdontologicalQuestionnaire = '';
        }, 1000);
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    getQuestionnaires(): void {
        this.getAllNutritionalQuestionnaires();
        this.getAllOdontologicalQuestionnaires();
    }

}
