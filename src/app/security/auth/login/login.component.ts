import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from './../services/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

import * as $ from 'jquery';
import {ISubscription} from 'rxjs/Subscription';

import {ToastrService} from 'ngx-toastr';
import {LoadingService} from 'app/shared/shared-components/loading-component/service/loading.service';


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
        private loadinService: LoadingService
    ) {
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        $('body').css('background-color', '#00a594')

        this.f = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]]
        });
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
                    this.toastr.error('Dados inválidos', 'Não foi possível entar');
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
