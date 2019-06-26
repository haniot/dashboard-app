import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'app/security/auth/services/auth.service';
import { LocalStorageService } from "../../../shared/shared-services/localstorage.service";
import { HealtArea, HealthProfessional, IUser } from "../../admin/models/users";
import { HealthProfessionalService } from "../../admin/services/health-professional.service";
import { UserService } from "../../admin/services/users.service";


@Component({
    selector: 'health-professional-configurations',
    templateUrl: './configurations.component.html',
    styleUrls: ['./configurations.component.scss']
})
export class HealthprofessionalConfigComponent implements OnInit {

    userId: string;

    visibilityButtonSave: boolean;
    disabledButtonEdit: boolean;
    user: IUser;
    healthAreaOptions = Object.keys(HealtArea);

    email: string;
    password: string;

    constructor(
        private healthService: HealthProfessionalService,
        private userService: UserService,
        private authService: AuthService,
        private toastr: ToastrService,
        private localStorageService: LocalStorageService,

    ) {
        this.user = new HealthProfessional();
    }

    ngOnInit() {
        this.getUser();
    }

    getUser() {
        this.userId = this.localStorageService.getItem('user');
        this.healthService.getById(this.userId)
            .then(healthprofessional => this.user = healthprofessional)
            .catch(HttpError => {
                // console.log('Não foi possível carregar usuário logado!', HttpError);
            });

    }

    enabledEdit() {
        this.disabledButtonEdit = true;
        this.visibilityButtonSave = true;
    }

    onSubmit(form) {
        const healthProfessional = form.value;
        healthProfessional.id = this.localStorageService.getItem('user');
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
    }
}
