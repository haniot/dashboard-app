import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../services/auth.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-forgot.password',
    templateUrl: './forgot.password.component.html',
    styleUrls: ['./forgot.password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    loading: boolean;
    f: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private toastr: ToastrService,
        private translateService: TranslateService) {
        this.loading = false;
    }

    ngOnInit() {
        $('body').css('background-color', '#00a594');
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
                this.toastr.info(message)
                this.f.reset();
            })
            .catch(errorResponse => {
                this.loading = false;
                console.log(errorResponse)
                if (errorResponse.status === 429) {
                    this.toastr.error(
                        this.translateService.instant('SECURITY.FORGOT.TRY-AGAIN'),
                        this.translateService.instant('SECURITY.FORGOT.TOO-MANY-ATTEMPTS'));
                }
                this.toastr.error(this.translateService.instant('SECURITY.FORGOT.RECOVERY-ERROR'))
            })
    }

}
