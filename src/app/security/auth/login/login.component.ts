import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import * as $ from 'jquery';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { LoadingService } from 'app/shared/shared-components/loading-component/service/loading.service';
import { LocalStorageService } from '../../../shared/shared-services/localstorage.service'

const ATTEMPTSSHOWCAPTCHA = 2;
const ATTEMPTSBLOCKED = 5;
const BASE10 = 10;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewChecked, OnDestroy {
    /* reCaptcha config*/
    site_key = '6Ld1La8UAAAAAPG8l5pHQ4hEdT49pRH4Au0toPa_';
    attempt: number;
    captchaResolved: boolean;
    showCaptcha: boolean;
    blocked: boolean;

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
        this.attempt = 0;
        this.captchaResolved = false;
        this.blocked = false;
    }

    ngOnInit() {
        $('body').css('background-color', '#00a594');
        this.f = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]]
        });
        this.configLanguage();
        this.configReCaptcha();
    }

    configReCaptcha(): void {
        const attemptStoregae = this.localStorageService.getItem('attempt');
        if (attemptStoregae && !isNaN(Number(attemptStoregae))) {
            this.attempt = parseInt(attemptStoregae, BASE10);
        }
        this.verifyReCaptcha();
    }

    verifyReCaptcha(): void {
        this.showCaptcha = this.attempt >= ATTEMPTSSHOWCAPTCHA;
        this.blocked = this.attempt >= ATTEMPTSBLOCKED;
        if (this.blocked) {
            this.toastr.clear();
        }
    }

    resetCaptcha(): void {

    }

    onSubmit() {
        this.loading = true;
        this.subscriptions.push(this.authService.login(this.f.value).subscribe(
            (resp) => {
                this.router.navigate(['']);
                this.loading = false;
            },
            (error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.toastr.error(this.translateService.instant('TOAST-MESSAGES.INVALID-DATA'),
                        this.translateService.instant('TOAST-MESSAGES.NOT-LOGIN'));
                    this.attempt++;
                    this.localStorageService.setItem('attempt', this.attempt.toString());
                }
                this.loading = false;
                this.verifyReCaptcha();
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

    configLanguage() {
        const browserLang = this.translateService.getBrowserLang();
        switch (browserLang) {
            case 'en':
                this.translateService.use('en-US');
                break;
            case 'pt':
                this.translateService.use('pt-BR');
                break;
            default:
                this.translateService.use('en-US');
                break;
        }

    }

    solveCaptcha(captchaResponse: string) {
        console.log(`Resolved captcha with response: ${captchaResponse}`);
        this.captchaResolved = true;
    }

    ngAfterViewChecked() {
        this.loadinService.close();
    }

    ngOnDestroy(): void {
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
