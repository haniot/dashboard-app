import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { PatientService } from '../services/patient.service';
import { PilotStudyService } from 'app/modules/pilot.study/services/pilot.study.service';
import { Gender, Patient } from '../models/patient';
import { PilotStudy } from 'app/modules/pilot.study/models/pilot.study';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { SocioDemographicRecordService } from '../../habits/services/socio.demographic.record.service'
import { NutritionalQuestionnaire } from '../../habits/models/nutritional.questionnaire'
import { NutritionalQuestionnairesService } from '../../habits/services/nutritional.questionnaires.service'
import { OdontologicalQuestionnaire } from '../../habits/models/odontological.questionnaire'
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service'
import { OdontologicalQuestionnairesService } from '../../habits/services/odontological.questionnaires.service'
import { PageEvent } from '@angular/material'
import { ConfigurationBasic } from '../../config.matpaginator'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'app-view-habits',
    templateUrl: './view.habits.component.html',
    styleUrls: ['./view.habits.component.scss']
})
export class ViewHabitsComponent implements OnInit, OnDestroy {
    patientForm: FormGroup;
    optionsGender: Array<string> = Object.keys(Gender);
    listPilots: Array<PilotStudy>;
    patientId: string;
    userHealthArea: string;
    showMeasurements: boolean;
    configVisibility = {
        weight: false,
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
    }
    odontologicalQuestionnaireOptions: {
        page: number, limit: number, pageSizeOptions: number[], length: number, pageEvent: PageEvent
    }
    removingQuestionnaire: boolean;
    loadingQuestionnaire: boolean;


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
        private socioDemographicService: SocioDemographicRecordService,
        private nutritionalQuestionnaireService: NutritionalQuestionnairesService,
        private odontologicalQuestionnaireService: OdontologicalQuestionnairesService
    ) {
        this.subscriptions = new Array<ISubscription>();
        this.showMeasurements = false;
        this.nutritionalQuestionnaire = new NutritionalQuestionnaire();
        this.odontologicalQuestionnaire = new OdontologicalQuestionnaire();
        this.nutritionalQuestionnaireOptions = {
            page: PaginatorConfig.page,
            pageSizeOptions: PaginatorConfig.pageSizeOptions,
            limit: 1,
            length: 10,
            pageEvent: undefined
        };
        this.odontologicalQuestionnaireOptions = {
            page: PaginatorConfig.page,
            pageSizeOptions: PaginatorConfig.pageSizeOptions,
            limit: 1,
            length: 10,
            pageEvent: undefined
        };
        this.removingQuestionnaire = false;
        this.loadingQuestionnaire = false;
    }


    ngOnInit() {
        this.loadUserHealthArea();
        this.createPatientFormInit();
        this.getAllPilotStudies();
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.patientService.getById(this.patientId)
                .then(patient => {
                    this.createPatientForm(patient);
                })
                .catch(errorResponse => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-FIND'));
                });
        }));
        this.getQuestionnaires();
    }


    loadUserHealthArea(): void {
        this.userHealthArea = this.localStorageService.getItem('health_area');
    }


    createPatientFormInit() {
        this.patientForm = this.fb.group({
            id: [''],
            pilotstudy_id: [{ value: '', disabled: true }],
            name: [{ value: '', disabled: true }],
            email: [{ value: '', disabled: true }],
            phone_number: [{ value: '', disabled: true }],
            gender: [{ value: '', disabled: true }],
            birth_date: [{ value: '', disabled: true }]
        });
    }

    createPatientForm(patient: Patient) {
        this.patientForm = this.fb.group({
            id: [patient.id],
            pilotstudy_id: [patient.selected_pilot_study],
            name: [{ value: patient.name, disabled: true }],
            email: [{ value: patient.email, disabled: true }],
            phone_number: [{ value: patient.phone_number, disabled: true }],
            gender: [{ value: patient.gender, disabled: true }],
            birth_date: [{ value: patient.birth_date, disabled: true }]
        });
    }


    getAllPilotStudies() {
        const userId = this.localStorageService.getItem('user');

        if (this.localStorageService.getItem('health_area') === 'admin') {
            this.pilotStudiesService.getAll()
                .then(pilots => {
                    this.listPilots = pilots;
                })
                .catch();
        } else {
            this.pilotStudiesService.getAllByUserId(userId)
                .then(pilots => {
                    this.listPilots = pilots;
                })
                .catch();
        }

    }

    openModalConfirmationRemoveQuestionnaire(): void {
        this.modalService.open('modalConfirmation');
    }

    closeModalConfirmationQuestionnaire(): void {
        this.modalService.close('modalConfirmation');
    }

    nutritionalQuestionnairePageEvent(pageEvent: PageEvent): void {
        this.loadingQuestionnaire = true;
        this.nutritionalQuestionnaireOptions.page = pageEvent.pageIndex;
        this.nutritionalQuestionnaireOptions.limit = pageEvent.pageSize;
        this.getAllNutritionalQuestionnaires();
    }

    getAllNutritionalQuestionnaires(): void {
        this.nutritionalQuestionnaireService
            .getAll(this.patientId, this.nutritionalQuestionnaireOptions.page, this.nutritionalQuestionnaireOptions.limit)
            .then(nutritionalQuestionnaires => {
                if (nutritionalQuestionnaires.length) {
                    this.nutritionalQuestionnaire = new NutritionalQuestionnaire();
                    if (nutritionalQuestionnaires.length) {
                        this.nutritionalQuestionnaire = nutritionalQuestionnaires[0];
                    }
                }
                this.loadingQuestionnaire = false;
            })
            .catch(() => {
                this.loadingQuestionnaire = false;
            })
    }

    removeNutritionalQuestionnaires(): void {
        this.removingQuestionnaire = true;
        this.closeModalConfirmationQuestionnaire();
        this.nutritionalQuestionnaireService
            .remove(this.patientId, this.nutritionalQuestionnaire.id)
            .then(() => {
                setTimeout(() => {
                    this.removingQuestionnaire = false;
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-DELETED'));
                }, 3000)
            })
            .catch((errorResponse => {
                this.removingQuestionnaire = false;

                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-NOT-DELETED'));
            }))
    }

    odontologicalQuestionnairePageEvent(pageEvent: PageEvent): void {
        this.odontologicalQuestionnaireOptions.page = pageEvent.pageIndex;
        this.odontologicalQuestionnaireOptions.limit = pageEvent.pageSize;
        this.getAllOdontologicalQuestionnaires();
    }

    getAllOdontologicalQuestionnaires(): void {
        this.odontologicalQuestionnaireService
            .getAll(this.patientId, this.odontologicalQuestionnaireOptions.page, this.odontologicalQuestionnaireOptions.limit)
            .then(odontologicalQuestionnaires => {
                this.odontologicalQuestionnaire = new OdontologicalQuestionnaire();
                if (odontologicalQuestionnaires.length) {
                    this.odontologicalQuestionnaire = odontologicalQuestionnaires[0];
                }
            })
            .catch()
    }

    removeOdontologicalQuestionnaires(): void {
        this.odontologicalQuestionnaireService
            .remove(this.patientId, this.odontologicalQuestionnaire.id)
            .then(() => {
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-DELETED'));
            })
            .catch((errorResponse => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-NOT-DELETED'));
            }))
    }

    clickOnMatTab(event) {
        this.showMeasurements = true;
        if (event.index === 1) {
            this.configVisibility = {
                weight: true,
                height: true,
                fat: true,
                circumference: true,
                temperature: true,
                glucose: true,
                pressure: true,
                heartRate: true
            };
        }
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
        if (this.userHealthArea === 'dentistry' || this.userHealthArea === 'admin') {
            this.getAllOdontologicalQuestionnaires();
        }
    }

}
