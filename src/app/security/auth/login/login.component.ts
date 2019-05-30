import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from './../services/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

import * as $ from 'jquery';
import {ToastrService} from 'ngx-toastr';
import {LoadingService} from 'app/shared/shared-components/loading-component/service/loading.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    f: FormGroup;
    loading: boolean = false;

    icon_password = 'visibility';

    typeInputPassword = 'password';

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService,
        private loadingService: LoadingService
    ) {
    }

    ngOnInit() {
        $('body').css('background-color', '#00a594')
        console.log()
        this.f = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]]
        });
    }

    onSubmit() {
        this.loading = true;
        this.authService.login(this.f.value).subscribe(
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
        );
    };

    clickVisibilityPassword(): void {
        this.icon_password = this.icon_password === 'visibility' ? 'visibility_off' : 'visibility';
        if (this.icon_password === 'visibility') {
            this.typeInputPassword = 'password';
        } else {
            this.typeInputPassword = 'text';
        }
    }

}
