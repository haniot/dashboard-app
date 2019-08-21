import { Component, Input, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../admin/services/users.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'access-settings',
    templateUrl: './access.settings.component.html',
    styleUrls: ['./access.settings.component.scss']
})
export class AccessSettingsComponent implements OnInit {
    passwordForm: FormGroup;
    @Input() userId: string;
    icon_password = 'visibility_off';
    typeInputPassword = 'password';
    icon_password_confirm = 'visibility_off';
    typeInputPassword_confirm = 'password';
    passwordIsValid: boolean;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private localStorageService: LocalStorageService,
        protected translate: TranslateService,
        private toastr: ToastrService
    ) {
        this.passwordIsValid = true;
    }

    ngOnInit(): void {
        this.createForm();
    }

    createForm() {
        this.passwordForm = this.fb.group({
            old_password: ['', Validators.required],
            new_password: ['', Validators.required]
        });
    }

    onChangePassword(form) {
        const userLogged = JSON.parse(this.localStorageService.getItem('userLogged'));
        const body = Object.assign({ email: userLogged.email }, form.value)
        this.userService.changePassword(body)
            .then(() => {
                this.toastr.info(this.translate.instant('TOAST-MESSAGES.PASSWORD-UPDATED'));
                form.reset();
            })
            .catch(httpError => {
                switch (httpError.error.code) {
                    case 403:
                        this.toastr.error(this.translate.instant('TOAST-MESSAGES.PASSWORD-NOT-UPDATED'));
                        this.passwordForm.get('old_password').setErrors({ 'incorrect': true });
                        break;

                    case 429:
                        this.toastr.error(
                            this.translate.instant('TOAST-MESSAGES.TRY-AGAIN'),
                            this.translate.instant('TOAST-MESSAGES.TOO-MANY-ATTEMPTS'));
                        break;

                    default:
                        this.toastr.error(this.translate.instant('TOAST-MESSAGES.PASSWORD-NOT-UPDATED'));
                        break;
                }
            });
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

    validatePassword(): void {
        const pass = this.passwordForm.get('new_password').value;
        const len = pass.length;
        const letter = pass.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').length;
        const num = pass.replace(/[^\d]+/g, '').length;
        const sym = pass.replace(/[A-Za-z0-9_]/gi, '').length;
        this.passwordIsValid = (len >= 6 && letter > 0 && num > 0 && sym > 0);
    }

}
