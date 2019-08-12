import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { AdminService } from '../services/admin.service';
import { HealthProfessionalService } from '../services/health.professional.service';
import { Admin } from '../models/admin';
import { UserService } from '../services/users.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { GenericUser } from '../../../shared/shared.models/generic.user';
import { AuthService } from '../../../security/auth/services/auth.service'

@Component({
    selector: 'admin-configurations',
    templateUrl: './configurations.component.html',
    styleUrls: ['./configurations.component.scss']
})
export class AdminConfigurationsComponent implements OnInit {
    userId: string;
    visibilityButtonSave: boolean;
    disabledButtonEdit: boolean;
    user: GenericUser;
    email: string;
    password: string;

    constructor(
        private adminService: AdminService,
        private healthService: HealthProfessionalService,
        private userService: UserService,
        private authService: AuthService,
        private toastr: ToastrService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService
    ) {
        this.user = new Admin();
    }

    ngOnInit() {
        this.getUser();
    }

    getUser() {
        this.userId = this.localStorageService.getItem('user');
        this.adminService.getById(this.userId)
            .then(admin => this.user = admin)
            .catch();

    }

    enabledEdit() {
        this.disabledButtonEdit = true;
        this.visibilityButtonSave = true;
    }

    onSubmit(form) {
        const admin = form.value;
        admin.id = this.localStorageService.getItem('user');
        this.adminService.update(admin)
            .then((userAdmin) => {
                this.user = userAdmin;
                this.toastr.info(this.translateService.instant('TOAST-MESSAGES.INFO-UPDATED'));
                this.visibilityButtonSave = false;
                this.disabledButtonEdit = false;
            })
            .catch(() => {
                this.toastr.error(this.translateService.instant('TOAST-MESSAGES.NOT-UPDATED-INFO'));
            });
    }

}
