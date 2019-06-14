import {Component, OnInit} from '@angular/core';

import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {AdminService} from '../services/admin.service';
import {HealthProfessionalService} from '../services/health-professional.service';
import {IUser, HealtArea} from '../models/users';
import {UserService} from '../services/users.service';
import {AuthService} from 'app/security/auth/services/auth.service';
import {LocalStorageService} from "../../../shared/shared-services/localstorage.service";

@Component({
    selector: 'app-myprofile',
    templateUrl: './myprofile.component.html',
    styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
    userId: string;

    visibilityButtonSave: boolean;
    disabledButtonEdit: boolean;
    user: IUser;
    typeUser: string;// Admin or HealthProfessional
    healthAreaOptions = Object.keys(HealtArea);

    email: string;
    password: string;

    old_password: string;
    new_password: string;

    icon_password = 'visibility_off';

    typeInputPassword = 'password';

    icon_password_confirm = 'visibility_off';

    typeInputPassword_confirm = 'password';

    passwordIsValid: boolean;

    constructor(
        private adminService: AdminService,
        private healthService: HealthProfessionalService,
        private userService: UserService,
        private authService: AuthService,
        private toastr: ToastrService,
        private localStorageService: LocalStorageService
    ) {
        this.passwordIsValid = true;
    }

    ngOnInit() {
        this.typeUser = this.authService.decodeToken().sub_type;
        this.getUser();
    }

    getUser() {
        this.userId = atob(localStorage.getItem('user'));
        switch (this.typeUser) {
            case 'admin':
                this.adminService.getById(this.userId)
                    .then(admin => this.user = admin)
                    .catch(HttpError => {
                        // console.log('Não foi possível carregar usuário logado!', HttpError);
                    });
                break;
            case 'health_professional':
                this.healthService.getById(this.userId)
                    .then(healthprofessional => this.user = healthprofessional)
                    .catch(HttpError => {
                        // console.log('Não foi possível carregar usuário logado!', HttpError);
                    });
                break;
        }

    }

    enabledEdit() {
        this.disabledButtonEdit = true;
        this.visibilityButtonSave = true;
    }

    onSubmit(form) {
        switch (this.typeUser) {
            case 'admin':
                const admin = form.value;
                admin.id = atob(localStorage.getItem('user'));
                this.adminService.update(admin)
                    .then((userAdmin) => {
                        this.user = userAdmin;
                        this.toastr.info('Informações atualizadas!');
                        this.visibilityButtonSave = false;
                        this.disabledButtonEdit = false;
                    })
                    .catch((errorResponse: HttpErrorResponse) => {
                        this.toastr.error('Não foi possível atualizar informações!');
                    });
                break;
            case 'health_professional':
                const healthProfessional = form.value;
                healthProfessional.id = atob(localStorage.getItem('user'));
                this.healthService.update(healthProfessional)
                    .then((healthprofesional) => {
                        this.user = healthprofesional;
                        this.localStorageService.setItem('health_area', this.user.health_area);
                        this.toastr.info('Informações atualizadas!');
                        this.visibilityButtonSave = false;
                        this.disabledButtonEdit = false;
                    })
                    .catch((errorResponse: HttpErrorResponse) => {
                        this.toastr.error('Não foi possível atualizar informações!');
                    });
                break;
        }
    }

    onChangePassword(form) {
        this.userService.changePassword(this.userId, form.value)
            .then(() => {
                this.toastr.info('Senha modificada com sucesso!');
                form.reset();
            })
            .catch(HttpError => {
                // console.log('Não foi possível mudar a senha!', HttpError);
                this.toastr.error('Não foi posível mudar sua senha!');
                if (HttpError.error.code == 400 && HttpError.error.message == "Password does not match") {
                    form.controls['old_password'].setErrors({'incorrect': true});
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

    trackById(index, item) {
        return item.id;
    }

    validetorPassword(): void {
        const pass = '' + this.new_password;

        const len = pass.length;

        const letter = pass.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').length;
        const num = pass.replace(/[^\d]+/g, '').length;
        const sym = pass.replace(/[A-Za-z0-9_]/gi, '').length;


        if (len >= 6 && letter > 0 && num > 0 && sym > 0) {
            this.passwordIsValid = true;
        } else {
            this.passwordIsValid = false;
        }

    }
}
