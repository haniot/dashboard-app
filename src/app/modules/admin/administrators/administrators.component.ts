import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { AdminService } from '../services/admin.service';
import { Admin } from '../models/admin';
import { TranslateService } from '@ngx-translate/core';
import { GenericUser, UserType } from '../../../shared/shared.models/generic.user';
import { ConfigurationBasic } from '../../config.matpaginator'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { ActivatedRoute } from '@angular/router'

const PaginatorConfig = ConfigurationBasic;


@Component({
    selector: 'app-administrators',
    templateUrl: './administrators.component.html',
    styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent implements OnInit {
    typeUser: UserType;
    userEdit: GenericUser;
    admins: Array<GenericUser>;
    errorCredentials = false;
    page: number;
    limit: number;
    length: number;
    search: string;

    constructor(
        private adminService: AdminService,
        private toastr: ToastrService,
        private activeRouter: ActivatedRoute,
        private modalService: ModalService,
        private translateService: TranslateService) {
        this.userEdit = new Admin('');
        this.admins = [];
        this.page = PaginatorConfig.page;
        this.limit = PaginatorConfig.limit;
        this.admins = new Array<GenericUser>();
        this.typeUser = UserType.ADMIN;
        this.getAllAdministrators();
    }

    ngOnInit(): void {
        this.activeRouter.paramMap.subscribe((params) => {
            const administratorId = params.get('administratorId');
            if (administratorId) {
                this.adminService.getById(administratorId)
                    .then(user => {
                        this.editUser(user);
                    })
                    .catch(() => {
                        this.toastr.error(this.translateService.instant('TOAST-MESSAGES.NOT-FIND-USER'));
                    })
            }
        })
    }

    getAllAdministrators() {
        this.admins = [];
        this.adminService.getAll(this.page, this.limit, this.search)
            .then(httpResponse => {
                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    this.admins = httpResponse.body;
                }
                // this.loadinService.close();
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
        this.userEdit = new Admin('');
    }

    editUser(event) {
        this.modalService.open('modalUserEdit');
        this.userEdit = event;
    }

    cleanUser(): void {
        this.userEdit = new Admin('FLAG');
    }

    paginationEvent(event) {
        this.page = event.page;
        this.limit = event.limit;
        this.search = event.search;
        this.getAllAdministrators();
    }
}
