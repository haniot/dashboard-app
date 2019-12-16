import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ISubscription } from 'rxjs-compat/Subscription';

import { AdminService } from '../services/admin.service';
import { HealthProfessionalService } from '../services/health.professional.service';
import { HealtAreaType, HealthProfessional } from '../models/health.professional';
import { LanguagesConfiguration } from '../../../../assets/i18n/config'
import { TranslateService } from '@ngx-translate/core'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { GenericUser, UserType } from '../../../shared/shared.models/generic.user'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from '../../../security/auth/services/auth.service'
import { Admin } from '../models/admin'

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
    @Output() onclose: EventEmitter<any>;
    @Input() typeUser: UserType;
    @Input() userId: string;
    userForm: FormGroup;
    name: string;
    email: string;
    password: string;
    health_area: HealtAreaType;
    healthAreaOptions = Object.keys(HealtAreaType);
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
    user: Admin | HealthProfessional | GenericUser;
    passwordGenerated: string;
    errorConflitEmail: boolean;
    UserType = UserType;

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.close()
        }
    }

    constructor(
        private fb: FormBuilder,
        private adminService: AdminService,
        private healthService: HealthProfessionalService,
        private modalService: ModalService,
        private authService: AuthService,
        private toastr: ToastrService,
        private translateService: TranslateService
    ) {
        this.name = '';
        this.email = '';
        this.password = ''
        this.onsubmit = new EventEmitter();
        this.onclose = new EventEmitter();
        this.listOfLanguages = new Array<String>();
        this.subscriptions = new Array<ISubscription>();
        this.maxBirthDate = new Date();
    }

    ngOnInit() {
        this.createForm();
        this.loadUserInForm();
        this.subscriptions.push(
            this.modalService.eventActionNotExecuted.subscribe((res) => {
                switch (this.typeUser) {
                    case UserType.ADMIN:
                        this.loadAdminInForm(res.user);
                        break;

                    case UserType.HEALTH_PROFESSIONAL:
                        this.loadHealthProfessionalInForm(res.user);
                        break;
                }
                if (res && res.error && res.error.code === 409) {
                    this.errorConflitEmail = true;
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
            this.cleanEmailConflit();
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
            language: [this.translateService.defaultLang],
            health_area: ['', Validators.required],
            password: ['', Validators.required],
            password_confirm: ['', Validators.required]
        });
        if (this.typeUser === UserType.ADMIN) {
            this.userForm.removeControl('health_area');
        }
        if (this.userId) {
            this.userForm.removeControl('password');
            this.userForm.removeControl('password_confirm');
            this.userForm.removeControl('total_health_professionals');
        }
    }

    loadAdminInForm(user: Admin) {
        this.userId = user.id;
        this.userForm = this.fb.group({
            id: [user.id],
            name: [user.name, Validators.required],
            email: [user.email, Validators.compose([Validators.required, Validators.email])],
            birth_date: [user.birth_date, Validators.required],
            phone_number: [user.phone_number],
            language: [user.language],
            password: [''],
            password_confirm: ['']
        });
    }

    loadHealthProfessionalInForm(user: HealthProfessional) {
        this.userId = user.id;
        this.userForm = this.fb.group({
            id: [user.id],
            name: [user.name, Validators.required],
            email: [user.email, Validators.compose([Validators.required, Validators.email])],
            birth_date: [user.birth_date, Validators.required],
            phone_number: [user.phone_number],
            language: [user.language],
            health_area: [user.health_area, Validators.required],
            password: [''],
            password_confirm: ['']
        });
    }

    loadUserInForm() {
        if (this.userId) {
            console.log('Carregando usuário com id: ', this.userId)
            switch (this.typeUser) {
                case UserType.ADMIN:
                    console.log('Admin')
                    this.adminService.getById(this.userId)
                        .then(admin => {
                            this.user = admin;
                            this.loadAdminInForm(admin);
                        })
                        .catch(() => {
                        });
                    break;
                case UserType.HEALTH_PROFESSIONAL:
                    console.log('Healthprofessional')
                    this.healthService.getById(this.userId)
                        .then(healthprofessional => {
                            this.user = healthprofessional;
                            this.loadHealthProfessionalInForm(healthprofessional);
                        })
                        .catch(() => {
                        });
                    break;
            }
        }
    }

    close() {
        this.typeUser = undefined;
        this.userForm.reset();
        this.user = new GenericUser('');
        this.passwordNotMatch = false;
        this.errorConflitEmail = false;
        this.onclose.emit();
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

    generatePassword(): void {
        this.passwordGenerated = this.authService.generatePassword();
        this.userForm.get('password').patchValue(this.passwordGenerated);
        this.userForm.get('password_confirm').patchValue(this.passwordGenerated);
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

    cleanEmailConflit(): void {
        this.errorConflitEmail = false;
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges() {
        if (this.userId && this.userId !== 'FLAG') {
            this.createForm();
            this.loadUserInForm();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.close();
    }
}
