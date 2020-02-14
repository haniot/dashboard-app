import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { UserService } from '../../admin/services/users.service';
import { AuthService } from '../../../security/auth/services/auth.service'
import { Gender, Patient } from '../models/patient'
import { PatientService } from '../services/patient.service'
import { FormBuilder, FormGroup } from '@angular/forms'
import { VerifyScopeService } from '../../../security/services/verify.scope.service'

@Component({
    selector: 'health-professional-configurations',
    templateUrl: './configurations.component.html',
    styleUrls: ['./configurations.component.scss']
})
export class PatientConfigComponent implements OnInit {
    patientForm: FormGroup;
    optionsGender: Array<string> = Object.keys(Gender);
    min_birth_date: Date;
    max_birth_date: Date;
    userId: string;
    visibilityButtonSave: boolean;
    disabledButtonEdit: boolean;
    user: Patient;
    email: string;
    password: string;
    visibilityExternalServices: boolean;

    constructor(
        private fb: FormBuilder,
        private patietnService: PatientService,
        private userService: UserService,
        private authService: AuthService,
        private toastr: ToastrService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private verifyScopeService: VerifyScopeService
    ) {
        this.min_birth_date = new Date();
        this.user = new Patient('');
        this.max_birth_date = new Date();
    }

    ngOnInit() {
        this.patientForm = this.fb.group({
            id: [''],
            created_at: [''],
            name: [''],
            birth_date: [''],
            gender: [''],
            email: [''],
            phone_number: [''],
            last_login: [''],
            last_sync: [''],
            selected_pilot_study: [''],
            language: [''],
            password: [''],
            password_confirm: ['']
        });
        this.getUser();
        this.verifyScopes();
    }

    calMinBirthDate(): void {
        const today = new Date();
        this.min_birth_date.setFullYear(today.getFullYear() - 10, today.getMonth(), today.getDate());
    }

    createForm(patient: Patient) {
        this.patientForm = this.fb.group({
            id: [patient.id],
            created_at: [patient.created_at],
            name: [patient.name],
            birth_date: [patient.birth_date],
            gender: [patient.gender],
            email: [patient.email],
            phone_number: [patient.phone_number],
            last_login: [patient.last_login],
            // last_sync: [patient.last_sync],
            selected_pilot_study: [patient.selected_pilot_study],
            language: [patient.language],
            password: [''],
            password_confirm: ['']
        });
        this.calMinBirthDate();
    }

    getUser() {
        this.userId = this.localStorageService.getItem('user');
        this.patietnService.getById(this.userId)
            .then(patient => {
                this.user = patient;
                this.createForm(this.user);
                this.localStorageService.selectedPatient(patient);
            })
            .catch(() => {
                this.toastr.error(this.translateService.instant('TOAST-MESSAGES.NOT-FIND-USER'));
            });

    }

    applyMaskPhoneNumber() {
        let number: string;
        number = this.patientForm.get('phone_number').value;

        number = number.replace(/\D/g, '');
        number = number.replace(/^(\d{2})(\d)/g, '($1) $2');
        number = number.replace(/(\d)(\d{4})$/, '$1-$2');

        this.patientForm.get('phone_number').patchValue(number);
    }

    enabledEdit() {
        this.disabledButtonEdit = true;
        this.visibilityButtonSave = true;
    }

    verifyScopes(): void {
        this.visibilityExternalServices = this.verifyScopeService.verifyScopes(['external:sync']);
    }


    onSubmit(form) {
        const patient = form.value;
        patient.id = this.localStorageService.getItem('user');
        this.patietnService.update(patient)
            .then((healthprofesional) => {
                this.user = healthprofesional;
                this.toastr.info(this.translateService.instant('TOAST-MESSAGES.INFO-UPDATED'));
                this.visibilityButtonSave = false;
                this.disabledButtonEdit = false;
            })
            .catch(() => {
                this.toastr.error(this.translateService.instant('TOAST-MESSAGES.NOT-UPDATED-INFO'));
            });
    }
}
