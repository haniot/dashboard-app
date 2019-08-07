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
import { FeedingRecordService } from '../../habits/services/feeding.record.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { SleepHabitsRecord } from '../../habits/models/sleep'
import { PhysicalActivityHabitsRecord } from '../../habits/models/physical.activity'
import { MedicalRecord } from '../../habits/models/medical.record'
import { OralHealthRecord } from '../../habits/models/oral.health.record'
import { FeedingHabitsRecord } from '../../habits/models/feeding'
import { FamilyCohesionRecordService } from '../../habits/services/family.cohesion.record.service'
import { SocioDemographicRecord } from '../../habits/models/socio.demographic.record'
import { FamilyCohesionRecord } from '../../habits/models/family.cohesion.record'
import { PhysicalActivityRecordService } from '../../habits/services/physical.activity.record.service'
import { MedicalRecordService } from '../../habits/services/medical.record.service'
import { OralhealthRecordService } from '../../habits/services/oralhealth.record.service'
import { SleepRecordService } from '../../habits/services/sleep.record.service'
import { SocioDemographicRecordService } from '../../habits/services/socio.demographic.record.service'
import { NutritionalQuestionnaire } from '../../habits/models/nutritional.questionnaire'
import { NutritionalQuestionnairesService } from '../../habits/services/nutritional.questionnaires.service'

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
    sleepHabit: SleepHabitsRecord;
    feedingHabit: FeedingHabitsRecord;
    physicalHabit: PhysicalActivityHabitsRecord;
    medicalHabit: MedicalRecord;
    oralHealthHabit: OralHealthRecord;
    socioDemographic: SocioDemographicRecord;
    familyCohesion: FamilyCohesionRecord;
    nutritionalQuestionnaire: NutritionalQuestionnaire;
    private subscriptions: Array<ISubscription>;

    page: number;
    limit: number;

    constructor(
        private fb: FormBuilder,
        private patientService: PatientService,
        private pilotStudiesService: PilotStudyService,
        private feedingService: FeedingRecordService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private familyService: FamilyCohesionRecordService,
        private physicalActivityService: PhysicalActivityRecordService,
        private medicalService: MedicalRecordService,
        private oralHealthService: OralhealthRecordService,
        private sleepService: SleepRecordService,
        private socioDemographicService: SocioDemographicRecordService,
        private questionnaireService: NutritionalQuestionnairesService
    ) {
        this.subscriptions = new Array<ISubscription>();
        this.showMeasurements = false;
        this.nutritionalQuestionnaire = new NutritionalQuestionnaire();
        this.page = 1;
        this.limit = 1;
    }


    ngOnInit() {
        this.loaduserHealthArea();
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

    loaduserHealthArea(): void {
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

    prev(): void {
        this.page--;
        this.getAllNutritionalQuestionnaires();
    }

    next(): void {
        this.page++;
        this.getAllNutritionalQuestionnaires();
    }

    getAllNutritionalQuestionnaires(): void {
        this.questionnaireService.getAll(this.patientId, this.page, this.limit)
            .then(nutritionalQuestionnaire => {
                if (nutritionalQuestionnaire.length) {
                    this.nutritionalQuestionnaire = nutritionalQuestionnaire[0];
                }
            })
            .catch()
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
        // this.getFamilyCohesion();
        // this.getFeeding();
        // this.getPhysicalActivity();
        // this.getMedical();
        // this.getOralHealth();
        // this.getSleepHabit();
        // this.getSocioDemographic();
    }

    /* TODO: Remover os metodos abaixo*/

    getFamilyCohesion(): void {
        // this.familyService.getAll(this.patientId)
        //     .then(familyRecords => {
        //         if (familyRecords.length) {
        //             this.familyCohesion = familyRecords[0];
        //         }
        //     })
        //     .catch();
    }

    getFeeding(): void {
        this.feedingService.getAll(this.patientId)
            .then(feedingRecords => {
                if (feedingRecords.length) {
                    this.feedingHabit = feedingRecords[0];
                }

            })
            .catch();
    }

    getPhysicalActivity(): void {
        this.physicalActivityService.getAll(this.patientId)
            .then(physicalRecords => {
                if (physicalRecords.length) {
                    this.physicalHabit = physicalRecords[0];
                }
            })
            .catch();
    }

    getMedical(): void {
        this.medicalService.getAll(this.patientId)
            .then(medicalRecords => {
                if (medicalRecords.length) {
                    this.medicalHabit = medicalRecords[0];
                }
            })
            .catch();
    }

    getOralHealth(): void {
        this.oralHealthService.getAll(this.patientId)
            .then(oralhealthrecords => {
                if (oralhealthrecords.length) {
                    this.oralHealthHabit = oralhealthrecords[0];
                }
            })
            .catch();
    }

    getSleepHabit(): void {
        this.sleepService.getAll(this.patientId)
            .then(sleepRecords => {
                if (sleepRecords.length) {
                    this.sleepHabit = sleepRecords[0];
                }
            })
            .catch();
    }

    getSocioDemographic(): void {
        this.socioDemographicService.getAll(this.patientId)
            .then(sociodemographics => {
                if (sociodemographics.length) {
                    this.socioDemographic = sociodemographics[0];
                }
            })
            .catch();
    }
}
