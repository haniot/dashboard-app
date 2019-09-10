import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import * as $ from 'jquery'
import { TranslateService } from '@ngx-translate/core'
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../services/auth.service'
import { Title } from '@angular/platform-browser'

@Component({
    selector: 'app-forgot.password',
    templateUrl: './forgot.password.component.html',
    styleUrls: ['./forgot.password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    loading: boolean;
    f: FormGroup;
    showEmailSent: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router,
        private titleService: Title,
        private translateService: TranslateService) {
        this.loading = false;
        this.showEmailSent = false;
    }

    ngOnInit() {
        $('body').css('background-color', '#00a594');
        this.titleService.setTitle(this.translateService.instant('SECURITY.FORGOT.TITLE'));
        this.f = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]]
        });

    }

    onSubmit() {
        this.loading = true;
        const email = this.f.get('email').value;
        this.authService.forgot(email)
            .then(() => {
                this.loading = false;
                const message = `${this.translateService.instant('SECURITY.FORGOT.RECOVERY-SUCCESS')} ${email}.`
                // this.toastr.info(message)
                this.showEmailSent = true;
                this.f.reset();
            })
            .catch(errorResponse => {
                this.loading = false;
                switch (errorResponse.status) {
                    case 429:
                        this.toastr.error(
                            this.translateService.instant('SECURITY.FORGOT.TRY-AGAIN'),
                            this.translateService.instant('SECURITY.FORGOT.TOO-MANY-ATTEMPTS'));
                        break;

                    case 400:
                        this.toastr.error(this.translateService.instant('SECURITY.FORGOT.RECOVERY-ERROR'))
                        break;

                    default:
                        this.toastr.error(this.translateService.instant('SECURITY.FORGOT.RECOVERY-ERROR'))
                        break;
                }

            })
    }

    gotoLogin() {
        this.router.navigate(['/'])
    }

    ngOnDestroy(): void {
        /* reset color*/
        $('body').css('background-color', '#ececec');
    }

}
