import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from './../services/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

import * as $ from 'jquery';
import {ISubscription} from 'rxjs/Subscription';

import {ToastrService} from 'ngx-toastr';
import {LoadingService} from 'app/shared/shared-components/loading-component/service/loading.service';
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewChecked, OnDestroy {

    f: FormGroup;
    loading: boolean = false;

    icon_password = 'visibility_off';

    typeInputPassword = 'password';

    private subscriptions: Array<ISubscription>;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService,
        private loadinService: LoadingService,
        private translateService: TranslateService
    ) {
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        $('body').css('background-color', '#00a594')

        this.f = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]]
        });

        this.configLanguage();
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
                }
                this.loading = false;
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
