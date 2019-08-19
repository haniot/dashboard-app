import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ISubscription } from 'rxjs-compat/Subscription';

import { AdminService } from '../services/admin.service';
import { HealthProfessionalService } from '../services/health.professional.service';
import { HealtArea, HealthProfessional } from '../models/health.professional';
import { LanguagesConfiguration } from '../../../../assets/i18n/config'
import { TranslateService } from '@ngx-translate/core'
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service'
import { GenericUser } from '../../../shared/shared.models/generic.user'

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
    maxBirthDate: Date;

    constructor(
        private fb: FormBuilder,
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
        this.maxBirthDate = new Date();
    }

    ngOnInit() {
        this.createForm();
        this.loadUserInForm();
        this.subscriptions.push(
            this.modalService.eventActionNotExecuted.subscribe((res) => {
                if (res && res.error && res.error.code === 409) {
                    this.userForm.get('email').setErrors({ 'incorrect': true });
                }
                switch (this.typeUser) {
                    case 'Admin':
                        this.loadAdminInForm(res.user);
                        break;

                    case 'HealthProfessional':
                        this.loadHealthProfessinalInForm(res.user);
                        break;
                }
            }));
        this.listOfLanguages = this.translateService.getLangs();
    }

    onSubmit() {
        const form = this.userForm.getRawValue();
        const regexDate = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
        if (!regexDate.test(form.birth_date)) {
            let dateFormat = form.birth_date.toISOString();
            dateFormat = dateFormat.split('T')[0];
            form.birth_date = dateFormat;
        }
        if (!this.userForm.get('email').touched || !this.userForm.get('email').dirty) {
            delete form.email;
        }
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
            birth_date: ['', Validators.required],
            phone_number: [''],
            language: [''],
            health_area: ['', Validators.required],
            password: ['', Validators.required],
            password_confirm: ['', Validators.required]
        });
        if (this.typeUser === 'Admin') {
            this.userForm.removeControl('health_area');
        }
        if (this.userId) {
            this.userForm.removeControl('password');
            this.userForm.removeControl('password_confirm');
            this.userForm.removeControl('total_health_professionals');
        }
    }

    loadAdminInForm(user: GenericUser) {
        this.userId = user.id;
        this.userForm = this.fb.group({
            id: [user.id],
            name: [user.name, Validators.required],
            email: [user.email, Validators.compose([Validators.required, Validators.email])],
            birth_date: [user.birth_date, Validators.required],
            phone_number: [user.phone_number],
            language: [user.language]
        });
    }

    loadHealthProfessinalInForm(user: HealthProfessional) {
        this.userId = user.id;
        this.userForm = this.fb.group({
            id: [user.id],
            name: [user.name, Validators.required],
            email: [user.email, Validators.compose([Validators.required, Validators.email])],
            birth_date: [user.birth_date, Validators.required],
            phone_number: [user.phone_number],
            language: [user.language],
            health_area: [user.health_area, Validators.required]
        });
    }

    loadUserInForm() {
        if (this.userId) {
            switch (this.typeUser) {
                case 'Admin':
                    this.adminService.getById(this.userId)
                        .then(admin => {
                            this.loadAdminInForm(admin);
                        })
                        .catch();
                    break;
                case 'HealthProfessional':
                    this.healthService.getById(this.userId)
                        .then(healthprofessional => {
                            this.loadHealthProfessinalInForm(healthprofessional);
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
        }, 500);
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
        }, 500);
    }

    applyMaskPhoneNumber() {
        let number: string;
        number = this.userForm.get('phone_number').value;
        if (number) {
            number = number.replace(/\D/g, '');
            number = number.replace(/^(\d{2})(\d)/g, '($1) $2');
            number = number.replace(/(\d)(\d{4})$/, '$1-$2');
        }
        this.userForm.get('phone_number').patchValue(number);
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
