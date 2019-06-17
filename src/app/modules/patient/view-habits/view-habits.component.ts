import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';

import {ToastrService} from 'ngx-toastr';
import {ISubscription} from 'rxjs/Subscription';

import {PatientService} from '../services/patient.service';
import {PilotStudyService} from 'app/modules/pilot-study/services/pilot-study.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Patient, Gender} from '../models/patient';
import {PilotStudy} from 'app/modules/pilot-study/models/pilot.study';
import {FeedingRecordService} from '../../habits/services/feeding-record.service';
import {LocalStorageService} from "../../../shared/shared-services/localstorage.service";

@Component({
    selector: 'app-view-habits',
    templateUrl: './view-habits.component.html',
    styleUrls: ['./view-habits.component.scss']
})
export class ViewHabitsComponent implements OnInit, OnDestroy {

    patientForm: FormGroup;

    optionsGender: Array<string> = Object.keys(Gender);

    listPilots: Array<PilotStudy>;

    patientId: string;
    pilotStudyId: string;

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

    constructor(
        private fb: FormBuilder,
        private patientService: PatientService,
        private pilotStudiesService: PilotStudyService,
        private feedingService: FeedingRecordService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private localStorageService: LocalStorageService
    ) {
        this.subscriptions = new Array<ISubscription>();
        this.showMeasurements = false;
    }


    ngOnInit() {
        this.loaduserHealthArea();
        this.createPatientFormInit();
        this.getAllPilotStudies();

        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.pilotStudyId = params.get('pilotstudy_id');
            this.patientService.getById(this.patientId)
                .then(patient => {
                    this.createPatientForm(patient);
                })
                .catch(errorResponse => {
                    this.toastService.error('Não foi possível buscar paciente!');
                    // console.log('Não foi possível buscar paciente!',errorResponse);
                });
        }));
    }

    loaduserHealthArea(): void {
        this.userHealthArea = this.localStorageService.getItem('health_area');
    }


    createPatientFormInit() {
        this.patientForm = this.fb.group({
            id: [''],
            pilotstudy_id: [{value: '', disabled: true}],
            name: [{value: '', disabled: true}],
            email: [{value: '', disabled: true}],
            phone_number: [{value: '', disabled: true}],
            gender: [{value: '', disabled: true}],
            birth_date: [{value: '', disabled: true}]
        });
    }

    createPatientForm(patient: Patient) {
        this.patientForm = this.fb.group({
            id: [patient.id],
            pilotstudy_id: [this.pilotStudyId],
            name: [{value: patient.name, disabled: true}],
            email: [{value: patient.email, disabled: true}],
            phone_number: [{value: patient.phone_number, disabled: true}],
            gender: [{value: patient.gender, disabled: true}],
            birth_date: [{value: patient.birth_date, disabled: true}]
        });
    }


    getAllPilotStudies() {
        const userId = atob(localStorage.getItem('user'));

        if (this.localStorageService.getItem('health_area') === 'admin') {
            this.pilotStudiesService.getAll()
                .then(pilots => {
                    this.listPilots = pilots;
                })
                .catch(errorResponse => {
                    // console.log('Não foi possivel buscar estudos pilotos!', errorResponse);
                });
        } else {
            this.pilotStudiesService.getAllByUserId(userId)
                .then(pilots => {
                    this.listPilots = pilots;
                })
                .catch(errorResponse => {
                    // console.log('Não foi possivel buscar estudos pilotos!', errorResponse);
                });
        }

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
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }


}
