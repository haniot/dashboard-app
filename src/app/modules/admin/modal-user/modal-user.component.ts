import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ISubscription } from 'rxjs-compat/Subscription';

import { AdminService } from '../services/admin.service';
import { HealthProfessionalService } from '../services/health-professional.service';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';
import { HealtArea } from '../models/users';

@Component({
    selector: 'app-modal-user',
    templateUrl: './modal-user.component.html',
    styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit, OnChanges, OnDestroy {
    @Input() title: string;
    @Input() subtitle: string;
    @Output() onsubmit: EventEmitter<any>;
    // Admin or HealthProfessional
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
    timerVerifyPassword;
    private subscriptions: Array<ISubscription>;

    constructor(
        private fb: FormBuilder,
        private activeRouter: ActivatedRoute,
        private adminService: AdminService,
        private healthService: HealthProfessionalService,
        private modalService: ModalService
    ) {
        this.name = '';
        this.email = '';
        this.password = ''
        this.onsubmit = new EventEmitter();
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.createForm();
        this.loadUserInForm();
        this.subscriptions.push(this.modalService.eventActionNotExecuted.subscribe((res) => {
            this.createFormForUser(res.user);
            this.userForm.setValue(res.user);
        }));
    }

    onSubmit() {
        const form = this.userForm.getRawValue();
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

    createForm(user?) {
        this.userForm = this.fb.group({
            id: [''],
            name: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.required],
            password_confirm: ['', Validators.required],
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
        this.typeUser = user.health_area ? 'HealthProfessional' : 'Admin';
        this.createForm(user);
    }

    loadUserInForm(user?: any) {
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

    verifyMatchPassword() {
        const form = this.userForm.getRawValue();
        const password = form.password;
        const password_confirm = form.password_confirm;
        if (password === password_confirm) {
            this.passwordNotMatch = false;
        } else {
            this.passwordNotMatch = true;
            this.userForm.setErrors({});
        }
        clearTimeout(this.timerVerifyPassword);
        this.timerVerifyPassword = setTimeout(() => {

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

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges() {
        this.createForm();
        this.loadUserInForm();
    }

    ngOnDestroy(): void {
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
