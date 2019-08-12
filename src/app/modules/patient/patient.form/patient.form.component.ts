import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { Gender, Patient } from '../models/patient';
import { PilotStudy } from 'app/modules/pilot.study/models/pilot.study';
import { PilotStudyService } from 'app/modules/pilot.study/services/pilot.study.service';
import { PatientService } from '../services/patient.service';
import { AuthService } from 'app/security/auth/services/auth.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { LanguagesConfiguration } from '../../../../assets/i18n/config';

const languagesConfig = LanguagesConfiguration;

@Component({
    selector: 'patient-form',
    templateUrl: './patient.form.component.html',
    styleUrls: ['./patient.form.component.scss']
})
export class PatientFormComponent implements OnInit, AfterViewChecked, OnDestroy {
    patientForm: FormGroup;
    optionsGender: Array<string> = Object.keys(Gender);
    listPilots: Array<PilotStudy>;
    patientId: string;
    pilotStudyId: string;
    matchPasswordStatus;
    matchPasswordTime;
    icon_password = 'visibility_off';
    typeInputPassword = 'password';
    icon_password_confirm = 'visibility_off';
    typeInputPassword_confirm = 'password';
    min_birth_date: Date;
    languages = languagesConfig;
    listOfLanguages: Array<String>;
    private subscriptions: Array<ISubscription>;

    constructor(
        private fb: FormBuilder,
        private patientService: PatientService,
        private pilotStudiesService: PilotStudyService,
        private toastService: ToastrService,
        private activeRouter: ActivatedRoute,
        private location: Location,
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService
    ) {
        this.min_birth_date = new Date();
        this.subscriptions = new Array<ISubscription>();
        this.listOfLanguages = this.translateService.getLangs();
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.pilotStudyId = params.get('pilotstudy_id');
            this.createForm();
            this.loadPatientInForm();
            this.getAllPilotStudies();
        }));
        this.calMinBirthDate();
        this.createForm();
        this.getAllPilotStudies();
    }

    calMinBirthDate(): void {
        const today = new Date();
        this.min_birth_date.setFullYear(today.getFullYear() - 10, today.getMonth(), today.getDate());
    }

    createForm() {
        this.patientForm = this.fb.group({
            id: [''],
            name: ['', Validators.required],
            birth_date: ['', Validators.required],
            gender: ['', Validators.required],
            email: ['', Validators.compose([Validators.email])],
            phone_number: [''],
            last_login: [''],
            last_sync: [''],
            selected_pilot_study: [''],
            language: [''],
            password: [''],
            password_confirm: [''],
        });
    }

    setPatientInForm(patient: Patient) {
        this.patientForm = this.fb.group({
            id: [patient.id],
            name: [patient.name],
            birth_date: [patient.birth_date],
            gender: [patient.gender],
            email: [patient.email],
            phone_number: [patient.phone_number],
            last_login: [patient.last_login],
            last_sync: [patient.last_sync],
            selected_pilot_study: [patient.selected_pilot_study],
            language: [patient.language],
            password: [''],
            password_confirm: ['']
        });
    }

    loadPatientInForm() {
        if (this.patientId) {
            this.patientService.getById(this.patientId)
                .then(patient => {
                    patient.password = '';
                    patient.password_confirm = '';
                    this.verifyMatchPassword();
                    this.setPatientInForm(patient);
                })
                .catch();
        }
    }

    onSubimt() {
        const form = this.patientForm.getRawValue();
        form.birth_date = new Date(form.birth_date).toISOString().split('T')[0];
        if (!this.patientId) {
            this.patientService.create(form)
                .then(() => {
                    this.patientForm.reset();
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PATIENT-CREATED'));
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-CREATED'));
                });
        } else {
            delete form.password;
            delete form.password_confirm;
            delete form.pilotstudy_id;
            this.patientService.update(form)
                .then(() => {
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PATIENT-UPDATED'));
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-UPDATED'));
                });
        }
    }

    onBack() {
        this.location.back();
    }

    getAllPilotStudies() {
        if (this.authService.decodeToken().sub_type === 'admin') {

            this.pilotStudiesService.getAll()
                .then(httpResponse => {
                    this.listPilots = httpResponse.body;
                })
                .catch();
        } else {
            const userId = this.localStorageService.getItem('user');
            this.pilotStudiesService.getAllByUserId(userId)
                .then(httpResponse => {
                    this.listPilots = httpResponse.body;
                })
                .catch();
        }
    }

    passwordMatch(): boolean {
        return this.patientForm.get('password').value === this.patientForm.get('password_confirm').value;
    }

    verifyMatchPassword() {
        clearTimeout(this.matchPasswordTime);

        this.matchPasswordTime = setTimeout(() => {
            this.matchPasswordStatus = this.passwordMatch();
        }, 200);
    }

    clickVisibilityPassword(): void {
        this.icon_password = this.icon_password === 'visibility_off' ? 'visibility' : 'visibility_off';
        if (this.icon_password === 'visibility_off') {
            this.typeInputPassword = 'password';
        } else {
            this.typeInputPassword = 'text';
        }
    }

    clickVisibilityPasswordConfirm(): void {
        this.icon_password_confirm = this.icon_password_confirm === 'visibility_off' ? 'visibility' : 'visibility_off';
        if (this.icon_password_confirm === 'visibility_off') {
            this.typeInputPassword_confirm = 'password';
        } else {
            this.typeInputPassword_confirm = 'text';
        }
    }

    applyMaskPhoneNumber() {
        let number: string;
        number = this.patientForm.get('phone_number').value;

        number = number.replace(/\D/g, '');
        number = number.replace(/^(\d{2})(\d)/g, '($1) $2');
        number = number.replace(/(\d)(\d{4})$/, '$1-$2');

        this.patientForm.get('phone_number').patchValue(number);
    }

    trackById(index, item) {
        return item.id;
    }

    ngAfterViewChecked(): void {
        this.calMinBirthDate();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
