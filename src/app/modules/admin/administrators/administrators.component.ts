import { AfterViewChecked, Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { AdminService } from '../services/admin.service';
import { Admin } from '../models/admin';
import { TranslateService } from '@ngx-translate/core';
import { GenericUser } from '../../../shared/shared.models/generic.user';
import { ConfigurationBasic } from '../../config.matpaginator'
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service'
import { LoadingService } from '../../../shared/shared.components/loading.component/service/loading.service'

const PaginatorConfig = ConfigurationBasic;


@Component({
    selector: 'app-administrators',
    templateUrl: './administrators.component.html',
    styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent implements AfterViewChecked {
    userEdit: GenericUser = new Admin();
    admins: Array<GenericUser> = [];
    errorCredentials = false;
    page: number;
    limit: number;
    length: number;
    search: string;

    constructor(
        private adminService: AdminService,
        private toastr: ToastrService,
        private modalService: ModalService,
        private loadinService: LoadingService,
        private translateService: TranslateService) {
        this.page = PaginatorConfig.page;
        this.limit = PaginatorConfig.limit;
        this.admins = new Array<GenericUser>();
        this.getAllAdministrators();
    }

    getAllAdministrators() {
        this.adminService.getAll(this.page, this.limit, this.search)
            .then(httpResponse => {
                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    this.admins = httpResponse.body;
                }
                this.loadinService.close();
            })
            .catch((errorResponse: HttpErrorResponse) => {
                if (errorResponse.status === 401) {
                    this.errorCredentials = true;
                }
                this.toastr.error(this.translateService.instant('TOAST-MESSAGES.NOT-LIST-ADMIN'));
            });

    }

    createAdmin(event) {
        this.adminService.create(event)
            .then(() => {
                this.getAllAdministrators();
                this.toastr.info(this.translateService.instant('TOAST-MESSAGES.ADMIN-CREATED'));
                this.modalService.close('modalUser');
                this.modalService.close('modalLoading');
            })
            .catch((errorResponse: HttpErrorResponse) => {
                if (errorResponse.status === 409 &&
                    errorResponse.error.code === 409 &&
                    errorResponse.error.message === 'A registration with the same unique data already exists!') {
                    this.toastr.error(this.translateService.instant('TOAST-MESSAGES.EMAIL-REGISTRED'));
                } else {
                    this.toastr.error(this.translateService.instant('TOAST-MESSAGES.NOT-CREATE-ADMIN'));
                }
                this.modalService.actionNotExecuted('modalUser', event, errorResponse.error);
                if (errorResponse.status === 401) {
                    this.errorCredentials = true;
                }
            });
    }

    editAdmin(event) {
        this.adminService.update(event)
            .then(() => {
                this.getAllAdministrators();
                this.toastr.info(this.translateService.instant('TOAST-MESSAGES.ADMIN-UPDATED'));
                this.modalService.close('modalUserEdit');
            })
            .catch((errorResponse: HttpErrorResponse) => {
                if (errorResponse.status === 409 &&
                    errorResponse.error.code === 409 &&
                    errorResponse.error.message === 'A registration with the same unique data already exists!') {
                    this.toastr.error(this.translateService.instant('TOAST-MESSAGES.EMAIL-REGISTRED'));
                } else {
                    this.toastr.error(this.translateService.instant('TOAST-MESSAGES.NOT-UPDATED-ADMIN'));
                }
                this.modalService.actionNotExecuted('modalUserEdit', event, errorResponse.error);
                if (errorResponse.status === 401) {
                    this.errorCredentials = true;
                }
            });
    }

    openModal() {
        this.modalService.open('modalUser');
        this.userEdit = new Admin();
    }

    editUser(event) {
        this.modalService.open('modalUserEdit');
        this.userEdit = event;
    }

    paginationEvent(event) {
        this.page = event.page;
        this.limit = event.limit;
        this.search = event.search;
        this.getAllAdministrators();
    }

    ngAfterViewChecked() {
        this.loadinService.close();
    }

}
