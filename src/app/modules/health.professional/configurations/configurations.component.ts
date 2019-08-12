import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { HealtArea, HealthProfessional } from '../../admin/models/health.professional';
import { HealthProfessionalService } from '../../admin/services/health.professional.service';
import { UserService } from '../../admin/services/users.service';
import { AuthService } from '../../../security/auth/services/auth.service'

@Component({
    selector: 'health-professional-configurations',
    templateUrl: './configurations.component.html',
    styleUrls: ['./configurations.component.scss']
})
export class HealthProfessionalConfigComponent implements OnInit {
    userId: string;
    visibilityButtonSave: boolean;
    disabledButtonEdit: boolean;
    user: HealthProfessional;
    healthAreaOptions = Object.keys(HealtArea);
    email: string;
    password: string;

    constructor(
        private healthService: HealthProfessionalService,
        private userService: UserService,
        private authService: AuthService,
        private toastr: ToastrService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService
    ) {
        this.user = new HealthProfessional();
    }

    ngOnInit() {
        this.getUser();
    }

    getUser() {
        this.userId = this.localStorageService.getItem('user');
        this.healthService.getById(this.userId)
            .then(healthProfessional => this.user = healthProfessional)
            .catch();

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
                this.toastr.info(this.translateService.instant('TOAST-MESSAGES.INFO-UPDATED'));
                this.visibilityButtonSave = false;
                this.disabledButtonEdit = false;
            })
            .catch(() => {
                this.toastr.error(this.translateService.instant('TOAST-MESSAGES.NOT-UPDATED-INFO'));
            });
    }
}
