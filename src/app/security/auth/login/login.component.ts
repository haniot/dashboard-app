import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import * as $ from 'jquery';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { RecaptchaComponent } from 'ng-recaptcha'

import { LoadingService } from 'app/shared/shared.components/loading.component/service/loading.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'
import { environment } from '../../../../environments/environment'

const ATTEMPTSSHOWCAPTCHA = 2;

class Attempt {
    user: string;
    attemptNumber: number;

    constructor() {
        this.user = '';
        this.attemptNumber = 0;
    }

}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewChecked, OnDestroy {
    /* reCaptcha config*/
    reCaptcha: RecaptchaComponent;
    site_key = environment.reCaptcha_siteKey;
    captchaResolved: boolean;
    showCaptcha: boolean;
    attemptUser: Attempt;
    f: FormGroup;
    loading: boolean;
    icon_password = 'visibility_off';
    typeInputPassword = 'password';
    private subscriptions: Array<ISubscription>;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService,
        private loadinService: LoadingService,
        private translateService: TranslateService,
        private localStorageService: LocalStorageService
    ) {
        this.loading = false;
        this.showCaptcha = false;
        this.subscriptions = new Array<ISubscription>();
        this.attemptUser = new Attempt();
        this.captchaResolved = false;
    }

    ngOnInit() {
        const token = this.localStorageService.getItem('token')
        if (token) {
            this.router.navigate(['/app'])
        }

        $('body').css('background-color', '#00a594');
        this.f = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]]
        });
        this.configReCaptcha();
    }

    configReCaptcha(): void {
        const local = this.localStorageService.getItem('listAttempts');
        let attemptsStorage: Array<Attempt> = new Array<Attempt>();
        if (local) {
            attemptsStorage = JSON.parse(local);
        }
        this.attemptUser = new Attempt();
        const find = attemptsStorage.find(item => {
            return item.user === this.f.get('email').value
        })
        if (find) {
            this.attemptUser = find;
        }
        this.verifyReCaptcha();
    }

    verifyReCaptcha(): void {
        this.showCaptcha = this.attemptUser.attemptNumber >= ATTEMPTSSHOWCAPTCHA;
    }

    resetCaptcha(): void {
        if (this.reCaptcha) {
            this.reCaptcha.reset();
            this.captchaResolved = false;
        }
    }

    updateAttempt(attemptUser: number): void {
        this.attemptUser.user = this.f.get('email').value;
        this.attemptUser.attemptNumber = attemptUser;

        const local = this.localStorageService.getItem('listAttempts');
        let attemptsStorage: Array<Attempt> = new Array<Attempt>();
        if (local) {
            attemptsStorage = JSON.parse(local);
        }
        attemptsStorage = attemptsStorage.filter(item => {
            return item.user !== this.attemptUser.user
        })

        attemptsStorage.push(this.attemptUser);

        this.localStorageService.setItem('listAttempts', JSON.stringify(attemptsStorage));
    }

    cleanAttempt(): void {
        const local = this.localStorageService.getItem('listAttempts');
        let attemptsStorage: Array<Attempt> = new Array<Attempt>();
        if (local) {
            attemptsStorage = JSON.parse(local);
        }
        attemptsStorage = attemptsStorage.filter(item => {
            return item.user !== this.attemptUser.user
        })
        this.localStorageService.setItem('listAttempts', JSON.stringify(attemptsStorage));
    }


    onSubmit() {
        this.loading = true;
        this.subscriptions.push(
            this.authService.login(this.f.value)
                .subscribe(
                    (resp) => {
                        this.cleanAttempt()
                        this.router.navigate(['/app']);
                        this.loading = false;
                    },
                    (error: HttpErrorResponse) => {
                        const rateLimit = parseInt(error.headers.get('x-ratelimit-limit'), 10);
                        const rateLimitRemaining = parseInt(error.headers.get('x-ratelimit-remaining'), 10);
                        switch (error.status) {
                            case 401:
                                this.toastr.error(this.translateService.instant('TOAST-MESSAGES.INVALID-DATA'),
                                    this.translateService.instant('TOAST-MESSAGES.NOT-LOGIN'));
                                this.updateAttempt(rateLimit - rateLimitRemaining);
                                break;
                            case 429:
                                this.toastr.error(this.translateService.instant('TOAST-MESSAGES.TRY-AGAIN'),
                                    this.translateService.instant('TOAST-MESSAGES.BLOCKED-USER'));
                                this.showCaptcha = false;
                                this.cleanAttempt();
                                break;
                        }
                        this.loading = false;
                        this.verifyReCaptcha();
                        this.resetCaptcha();
                    }
                ));
    };

    clickVisibilityPassword(): void {
        this.icon_password = this.icon_password === 'visibility_off' ? 'visibility' : 'visibility_off';
        if (this.icon_password === 'visibility_off') {
            this.typeInputPassword = 'password';
        } else {
            this.typeInputPassword = 'text';
        }
    }

    focusPassword(): void {
        this.configReCaptcha();
    }


    solveCaptcha(captchaResponse: string, reCaptcha: RecaptchaComponent) {
        this.reCaptcha = reCaptcha;
        this.authService.validateReCaptcha(captchaResponse)
            .then((response) => {
                this.captchaResolved = !!response.success;
                if (!response.success) {
                    this.resetCaptcha();
                }

            }).catch()
    }

    ngAfterViewChecked() {
        this.loadinService.close();
    }

    ngOnDestroy(): void {
        /* cancel all subscriptions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
