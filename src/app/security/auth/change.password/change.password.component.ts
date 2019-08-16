import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import * as JWT_decode from 'jwt-decode';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../services/auth.service';
import { SessionStorageService } from '../../../shared/shared.services/session.storage.service'

@Component({
    selector: 'app-change-password',
    templateUrl: './change.password.component.html',
    styleUrls: ['./change.password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    f: FormGroup;
    errorCredentials = false;
    redirect_link;
    loading: boolean;
    icon_password = 'visibility_off';
    typeInputPassword = 'password';
    icon_password_confirm = 'visibility_off';
    typeInputPassword_confirm = 'password';
    token: string;
    private subscriptions: Array<ISubscription>;
    validateTimer: any;
    matchTimer: any;
    invalidToken: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private sessionService: SessionStorageService,
        private translateService: TranslateService
    ) {
        this.loading = false;
        this.subscriptions = new Array<ISubscription>();
        this.invalidToken = false;
    }

    ngOnInit() {
        $('body').css('background-color', '#00a594')

        this.f = this.formBuilder.group({
            email: [{ value: '', disabled: true }],
            new_password: [null, [Validators.required]],
            confirm_password: [null, [Validators.required]]
        });

        this.subscriptions.push(
            this.route.paramMap
                .subscribe(params => {
                    const language = params.get('language');
                    if (language) {
                        this.translateService.use(language);
                    }
                })
        );

        this.subscriptions.push(
            this.route.queryParams
                .filter(params => params.token)
                .subscribe(params => {
                    if (params.token) {
                        this.sessionService.setItem('temporaryToken', params.token);
                        const url = this.router.url.replace(new RegExp('\\?token=' + params.token), '');
                        this.router.navigate([url]);
                    }
                })
        );
        this.token = this.sessionService.getItem('temporaryToken');
        this.decodeToken()
    }

    decodeToken(): void {

        let decodedToken: {
            sub: string,
            sub_type: string,
            email: string,
            iss: string,
            exp: number,
            iat: number,
            scope: string,
            reset_password: boolean
        };
        try {
            decodedToken = JWT_decode(this.token);
        } catch (Error) {
            decodedToken = {
                sub: '',
                sub_type: '',
                email: '',
                iss: '',
                exp: 0,
                iat: 0,
                scope: '',
                reset_password: false
            };
            this.invalidToken = true;
        }

        this.f.get('email').patchValue(decodedToken.email);

        if (Date.now() >= decodedToken.exp * 1000) {
            // this.toastr.error(
            //     this.translateService.instant('SECURITY.CHANGE.RESET-PROCESS'),
            //     this.translateService.instant('SECURITY.CHANGE.INVALID-TOKEN'));
            this.f.reset();
            this.sessionService.clean();
            this.invalidToken = true;
        }

    }

    onSubmit() {
        this.loading = true;
        this.errorCredentials = false;
        this.authService.changePassword(this.f.getRawValue())
            .then(() => {
                this.loading = false;
                this.toastr.info(this.translateService.instant('TOAST-MESSAGES.PASSWORD-UPDATED'));
                this.router.navigate(['/app'])
            })
            .catch((errorResponse => {
                switch (errorResponse.status) {
                    case 401:
                        this.toastr.error(this.translateService.instant('TOAST-MESSAGES.INVALID-TOKEN'));
                        break;

                    case 429:
                        this.toastr.error(this.translateService.instant('TOAST-MESSAGES.TOO-MANY-REQUESTS'));
                        break;

                    default:
                        this.toastr.error(this.translateService.instant('TOAST-MESSAGES.PASSWORD-NOT-UPDATED'));
                        break;
                }
                this.loading = false;
            }))
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
        clearTimeout(this.validateTimer);
        this.validateTimer = setTimeout(() => {
            const pass = '' + this.f.get('new_password').value;
            const len = pass.length;
            const letter = pass.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').length;
            const num = pass.replace(/[^\d]+/g, '').length;
            const sym = pass.replace(/[A-Za-z0-9_]/gi, '').length;

            if (len < 6 || letter <= 0 || num <= 0 || sym <= 0) {
                this.f.get('new_password').setErrors({ 'incorrect': true });
            }
        }, 500);
        if (this.f.get('confirm_password').value) {
            this.matchPassword();
        }
    }

    matchPassword(): void {
        clearTimeout(this.matchTimer);
        this.matchTimer = setTimeout(() => {
            if (this.f.get('new_password').value !== this.f.get('confirm_password').value) {
                this.f.get('confirm_password').setErrors({ 'incorrect': true });
            }
        }, 500);
    }

    gotoLogin(): void {
        this.router.navigate(['/login']);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        /* reset color*/
        $('body').css('background-color', '#ececec');
    }


}
