import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ISubscription } from 'rxjs-compat/Subscription';

import { AdminService } from '../services/admin.service';
import { HealthProfessionalService } from '../services/health.professional.service';
import { ModalService } from 'app/shared/shared.components/haniot.modal/service/modal.service';
import { HealtArea } from '../models/health.professional';
import { LanguagesConfiguration } from '../../../../assets/i18n/config'
import { TranslateService } from '@ngx-translate/core'

const languagesConfig = LanguagesConfiguration;

@Component({
    selector: 'app-modal-user',
    templateUrl: './modal.user.component.html',
    styleUrls: ['./modal.user.component.scss']
})
export class ModalUserComponent implements OnInit, OnChanges, OnDestroy {
    @Input() title: string;
    @Input() subtitle: string;
    @Output() onsubmit: EventEmitter<any>;
    @Input() typeUser: string;
    userForm: FormGroup;
    @Input() userId: string;
    name: string;
    email: string;
    password: string;
    health_area: HealtArea;
    healthAreaOptions = Object.keys(HealtArea);
    passwordNotMatch: boolean;
    icon_password = 'visibility_off';
    typeInputPassword = 'password';
    icon_password_confirm = 'visibility_off';
    typeInputPassword_confirm = 'password';
    languages = languagesConfig;
    listOfLanguages: Array<String>;
    private subscriptions: Array<ISubscription>;
    validateTimer: any;
    matchTimer: any;

    constructor(
        private fb: FormBuilder,
        private activeRouter: ActivatedRoute,
        private adminService: AdminService,
        private healthService: HealthProfessionalService,
        private modalService: ModalService,
        private translateService: TranslateService
    ) {
        this.name = '';
        this.email = '';
        this.password = ''
        this.onsubmit = new EventEmitter();
        this.listOfLanguages = new Array<String>();
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.createForm();
        this.loadUserInForm();
        this.subscriptions.push(
            this.modalService.eventActionNotExecuted.subscribe((res) => {
                if (res && res.error && res.error.code === 409) {
                    this.userForm.get('email').setErrors({ 'incorrect': true });
                }
                this.createFormForUser(res.user);
                this.userForm.setValue(res.user);
            }));
        this.listOfLanguages = this.translateService.getLangs();
    }

    onSubmit() {
        const form = this.userForm.getRawValue();
        let dateFormat = form.birth_date.toISOString()
        dateFormat = dateFormat.split('T')[0];
        form.birth_date = dateFormat;
        const password = form.password;
        const password_confirm = form.password_confirm;
        if (password === password_confirm) {
            this.onsubmit.emit(form);
            this.userForm.reset();
            this.userId = undefined;
        } else {
            this.passwordNotMatch = true;
        }
    }

    createForm() {
        this.userForm = this.fb.group({
            id: [''],
            name: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.required],
            password_confirm: ['', Validators.required],
            birth_date: ['', Validators.required],
            phone_number: [''],
            language: [''],
            total_pilot_studies: [''],
            total_patients: [''],
            health_area: ['', Validators.required]
        });
        if (this.typeUser === 'Admin') {
            this.userForm.removeControl('health_area');
            this.userForm.removeControl('name');
        }
        if (this.userId) {
            this.userForm.removeControl('password');
            this.userForm.removeControl('password_confirm');
        }
    }

    createFormForUser(user: any) {
        this.userId = user.id;
        this.createForm();
    }

    loadUserInForm() {
        if (this.userId) {
            switch (this.typeUser) {
                case 'Admin':
                    this.adminService.getById(this.userId)
                        .then(admin => {
                            this.userForm.setValue(admin);
                        })
                        .catch();
                    break;
                case 'HealthProfessional':
                    this.healthService.getById(this.userId)
                        .then(healthprofessional => {
                            this.userForm.setValue(healthprofessional);
                        })
                        .catch();
                    break;
            }
        }
    }

    close() {
        if (!this.userId) {
            this.userForm.reset();
        }
        this.passwordNotMatch = false;
    }

    clickVisibilityPassword(): void {
        this.icon_password = this.icon_password === 'visibility_off' ? 'visibility' : 'visibility_off';
        this.typeInputPassword = this.icon_password === 'visibility_off' ? 'password' : 'text';
    }

    clickVisibilityPasswordConfirm(): void {
        this.icon_password_confirm = this.icon_password_confirm === 'visibility_off' ? 'visibility' : 'visibility_off';
        this.typeInputPassword_confirm = this.icon_password_confirm === 'visibility_off' ? 'password' : 'text';
    }

    validatePassword(): void {
        clearTimeout(this.validateTimer);
        this.validateTimer = setTimeout(() => {
            const pass = '' + this.userForm.get('password').value;
            const len = pass.length;
            const letter = pass.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').length;
            const num = pass.replace(/[^\d]+/g, '').length;
            const sym = pass.replace(/[A-Za-z0-9_]/gi, '').length;

            if (len < 6 || letter <= 0 || num <= 0 || sym <= 0) {
                this.userForm.get('password').setErrors({ 'incorrect': true });
            }
        }, 200);
        if (this.userForm.get('password_confirm').value) {
            this.matchPassword();
        }
    }

    matchPassword(): void {
        clearTimeout(this.matchTimer);
        this.matchTimer = setTimeout(() => {
            if (this.userForm.get('password').value !== this.userForm.get('password_confirm').value) {
                this.userForm.get('password_confirm').setErrors({ 'incorrect': true });
            }
        }, 200);
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges() {
        this.createForm();
        this.loadUserInForm();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
