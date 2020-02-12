import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { Gender, Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { LanguagesConfiguration } from '../../../../assets/i18n/config';
import { PilotStudy } from '../../pilot.study/models/pilot.study';
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service';
import { AuthService } from '../../../security/auth/services/auth.service';
import { FitbitStatusPipe } from '../../../shared/shared.pipes/pipes/fitbit.status.pipe'
import { VerifyScopeService } from '../../../security/services/verify.scope.service'

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
    icon_password = 'visibility_off';
    typeInputPassword = 'password';
    icon_password_confirm = 'visibility_off';
    typeInputPassword_confirm = 'password';
    min_birth_date: Date;
    max_birth_date: Date;
    languages = languagesConfig;
    listOfLanguages: Array<String>;
    validateTimer: any;
    matchTimer: any;
    errorEmailConflit: boolean;
    passwordGenerated: string;
    visibilityExternalServices: boolean;
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
        private translateService: TranslateService,
        private datePipe: DatePipe,
        private fitbitStatusPipe: FitbitStatusPipe,
        private verifyScopeService: VerifyScopeService
    ) {
        this.min_birth_date = new Date();
        this.subscriptions = new Array<ISubscription>();
        this.listPilots = new Array<PilotStudy>();
        this.listOfLanguages = this.translateService.getLangs();
        this.max_birth_date = new Date();
    }

    ngOnInit() {
        this.subscriptions.push(
            this.activeRouter.paramMap.subscribe((params) => {
                this.patientId = params.get('patientId');
                this.createForm();
                this.loadPatientInForm();
                this.verifyScopes();
            })
        );
        if (!this.patientId) {
            this.calMinBirthDate();
            this.createForm();
            this.getAllPilotStudies();
        }
    }

    calMinBirthDate(): void {
        const today = new Date();
        this.min_birth_date.setFullYear(today.getFullYear() - 10, today.getMonth(), today.getDate());
    }

    createForm() {
        this.patientForm = this.fb.group({
            id: [''],
            created_at: [''],
            name: ['', Validators.required],
            birth_date: ['', Validators.required],
            gender: ['', Validators.required],
            email: ['', Validators.compose([Validators.email])],
            phone_number: [''],
            address: [''],
            selected_pilot_study: [''],
            language: [this.translateService.defaultLang],
            password: [''],
            password_confirm: [''],
            last_login: [''],
            external_services: this.fb.group({
                fitbit_status: [{ value: '', disabled: true }],
                fitbit_last_sync: [{ value: '', disabled: true }]
            })
        });
    }

    setPatientInForm(patient: Patient) {
        this.patientForm = this.fb.group({
            id: [patient.id],
            created_at: [patient.created_at],
            name: [patient.name],
            birth_date: [patient.birth_date],
            gender: [patient.gender],
            email: [patient.email],
            phone_number: [patient.phone_number],
            address: [patient.address],
            selected_pilot_study: [patient.selected_pilot_study],
            language: [patient.language],
            password: [''],
            password_confirm: [''],
            last_login: [patient.last_login],
            external_services: this.fb.group({
                fitbit_status: [patient.external_services.fitbit_status],
                fitbit_last_sync: [patient.external_services.fitbit_last_sync]
            })
        });
    }

    loadPatientInForm() {
        if (this.patientId) {
            this.patientService.getById(this.patientId)
                .then(patient => {
                    patient.password = '';
                    patient.password_confirm = '';
                    this.setPatientInForm(patient);
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-FIND'));
                });
        }
    }

    onSubimt() {
        const form = this.patientForm.getRawValue();
        const regexDate = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
        if (!regexDate.test(form.birth_date)) {
            let dateFormat = new Date(form.birth_date).toISOString();
            dateFormat = dateFormat.split('T')[0];
            form.birth_date = dateFormat;
        }
        delete form.last_login;
        delete form.last_sync;
        if (!this.patientId) {
            this.patientService.create(form)
                .then(async (user) => {
                    const pilotId = this.patientForm.get('selected_pilot_study').value;
                    try {
                        await this.pilotStudiesService.addPatientToPilotStudy(pilotId, user.id);
                    } catch (e) {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.UNASSOCIATED-PATIENT'));
                    }
                    this.patientForm.reset();
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PATIENT-CREATED'));
                    this.cleanEmailConflit();
                })
                .catch((httpResponse) => {
                    if (httpResponse.error && httpResponse.error.code === 409) {
                        this.errorEmailConflit = true;
                    }
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-CREATED'));
                });
        } else {
            if (!this.patientForm.get('email').touched || !this.patientForm.get('email').dirty) {
                delete form.email;
            }
            delete form.password;
            delete form.password_confirm;
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
                    if (httpResponse.body && httpResponse.body.length) {
                        this.listPilots = httpResponse.body;
                    }

                })
                .catch();
        } else {
            const userId = this.localStorageService.getItem('user');
            this.pilotStudiesService.getAllByUserId(userId)
                .then(httpResponse => {
                    if (httpResponse.body && httpResponse.body.length) {
                        this.listPilots = httpResponse.body;
                    }

                })
                .catch();
        }
    }

    validatePassword(): void {
        clearTimeout(this.validateTimer);
        this.validateTimer = setTimeout(() => {
            const pass = '' + this.patientForm.get('password').value;
            const len = pass.length;
            const letter = pass.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').length;
            const num = pass.replace(/[^\d]+/g, '').length;
            const sym = pass.replace(/[A-Za-z0-9_]/gi, '').length;

            if (len < 6 || letter <= 0 || num <= 0 || sym <= 0) {
                this.patientForm.get('password').setErrors({ 'incorrect': true });
            }
        }, 500);
        if (this.patientForm.get('password_confirm').value) {
            this.matchPassword();
        }
    }

    matchPassword(): void {
        clearTimeout(this.matchTimer);
        this.matchTimer = setTimeout(() => {
            if (this.patientForm.get('password').value !== this.patientForm.get('password_confirm').value) {
                this.patientForm.get('password_confirm').setErrors({ 'incorrect': true });
            }
        }, 500);
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

    generatePassword(): void {
        this.passwordGenerated = this.authService.generatePassword();
        this.patientForm.get('password').patchValue(this.passwordGenerated);
        this.patientForm.get('password_confirm').patchValue(this.passwordGenerated);
    }

    verifyScopes(): void {
        this.visibilityExternalServices = this.verifyScopeService.verifyScopes(['external:sync']);
    }

    cleanEmailConflit(): void {
        this.errorEmailConflit = false;
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
