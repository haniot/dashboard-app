import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import * as $ from 'jquery';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {


    f: FormGroup;
    errorCredentials = false;
    redirect_link;

    loading: boolean = false;

    icon_password = 'visibility_off';

    typeInputPassword = 'password';

    icon_password_confirm = 'visibility_off';

    typeInputPassword_confirm = 'password';

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {

    }

    ngOnInit() {
        $('body').css('background-color', '#00a594')

        this.f = this.formBuilder.group({
            old_password: [null, [Validators.required]],
            new_password: [null, [Validators.required]]
        });


        this.route
            .queryParams
            .subscribe(params => {
                this.redirect_link = params['redirect_link'];
            });
    }

    onSubmit() {
        this.loading = true;
        this.errorCredentials = false;
        this.authService.changePassowrd(this.f.value, this.redirect_link).subscribe(
            (resp) => {
                this.loading = false;
                this.toastr.info("Senha alterada com sucesso!");
            },
            (errorResponse: HttpErrorResponse) => {
                // console.log(errorResponse)
                if (errorResponse.status === 400 && errorResponse.error.code === 400
                    && errorResponse.error.message
                    === 'Password does not match!') {
                    this.toastr.error("Senha antiga informada incorreta!");
                } else {
                    this.toastr.error("Não foi possível mudar a senha!");
                }
                this.loading = false;
            }
        );
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

    validetorPassword(): void {
        const pass = '' + this.f.get('new_password').value;

        const len = pass.length;

        const letter = pass.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').length;
        const num = pass.replace(/[^\d]+/g, '').length;
        const sym = pass.replace(/[A-Za-z0-9_]/gi, '').length;


        if (len < 6 || letter <= 0 || num <= 0 || sym <= 0) {
            this.f.get('new_password').setErrors({'incorrect': true});
        }

    }

}
