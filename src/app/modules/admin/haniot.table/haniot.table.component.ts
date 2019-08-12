import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

import { TranslateService } from '@ngx-translate/core';
import { GenericUser } from '../../../shared/shared.models/generic.user';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { AuthService } from '../../../security/auth/services/auth.service'
import { AdminService } from '../services/admin.service'
import { HealthProfessionalService } from '../services/health.professional.service'
import { UserService } from '../services/users.service'
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'haniot-table',
    templateUrl: './haniot.table.component.html',
    styleUrls: ['./haniot.table.component.scss']
})
export class HaniotTableComponent implements OnInit {
    @Input() length: number;
    @Input() pageSize: number;
    @Input() list: Array<GenericUser>;
    @Output() onremove = new EventEmitter();
    @Input() userType: string;
    @Output() onedit = new EventEmitter();
    @Output() pagination = new EventEmitter();
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    search: string;
    searchTime;
    cacheIdRemove: string;
    listOfUserIsEmpty: boolean;

    constructor(
        private authService: AuthService,
        private adminService: AdminService,
        private healthService: HealthProfessionalService,
        private userService: UserService,
        private paginatorService: PaginatorIntlService,
        private toastr: ToastrService,
        private modalService: ModalService,
        private translateService: TranslateService) {
        this.list = new Array<GenericUser>();
        this.listOfUserIsEmpty = false;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
    }

    ngOnInit() {
        this.updateStateOfList();
    }

    verifySameUser(user: any): boolean {
        return user.id === this.authService.decodeToken().sub;
    }

    openModalConfirmRemove(id: string) {
        this.cacheIdRemove = id;
        this.modalService.open('modalConfirmation');
    }

    closeModalConfirmRemove() {
        this.cacheIdRemove = '';
        this.modalService.close('modalConfirmation');
    }

    removeUser() {
        this.userService.removeUser(this.cacheIdRemove)
            .then(() => {
                this.onremove.emit();
                this.toastr.info(this.translateService.instant('TOAST-MESSAGES.USER-DELETED'));
                this.closeModalConfirmRemove();
            })
            .catch(() => {
                this.toastr.error(this.translateService.instant('TOAST-MESSAGES.NOT-USER-DELETED'));
            });

    }

    editUser(id: string) {

        const not_find_user = this.translateService.instant('TOAST-MESSAGES.NOT-FIND-USER');

        switch (this.userType) {
            case 'Admin':
                this.adminService.getById(id)
                    .then((user) => {
                        this.onedit.emit(user);
                    })
                    .catch(() => {
                        this.toastr.error(not_find_user);
                    });
                break;

            case 'HealthProfessional':
                this.healthService.getById(id)
                    .then((user) => {
                        this.onedit.emit(user);
                    })
                    .catch(() => {
                        this.toastr.error(not_find_user);
                    });
                break;
        }
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            const page = this.pageEvent && this.pageEvent.pageIndex ? this.pageEvent.pageIndex : 0;
            const limit = this.pageEvent && this.pageEvent.pageSize ? this.pageEvent.pageSize : 5;
            switch (this.userType) {
                case 'Admin':
                    if (this.search && this.search !== '') {
                        this.adminService.getAll(page + 1, limit, this.search)
                            .then(httpResponse => {
                                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                                if (httpResponse.body && httpResponse.body.length) {
                                    this.list = httpResponse.body;
                                }
                            })
                            .catch();
                    } else {
                        this.adminService.getAll(page + 1, limit)
                            .then(httpResponse => {
                                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                                if (httpResponse.body && httpResponse.body.length) {
                                    this.list = httpResponse.body;
                                }
                            })
                            .catch();
                    }
                    break;
                case 'HealthProfessional':
                    if (this.search && this.search !== '') {
                        this.healthService.getAll(page + 1, limit, this.search)
                            .then(httpResponse => {
                                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                                if (httpResponse.body && httpResponse.body.length) {
                                    this.list = httpResponse.body;
                                }
                            })
                            .catch();
                    } else {
                        this.healthService.getAll(page + 1, limit)
                            .then(httpResponse => {
                                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                                if (httpResponse.body && httpResponse.body.length) {
                                    this.list = httpResponse.body;
                                }
                                this.updateStateOfList();
                            })
                            .catch();
                    }

                    break;
            }
            this.updateStateOfList();
        }, 200);
    }

    clickPagination(event) {
        this.pageEvent = event;
        const eventPagination = {
            page: this.pageEvent.pageIndex + 1,
            limit: this.pageEvent.pageSize,
            search: this.search
        };
        this.pagination.emit(eventPagination);
    }

    getIndex(index: number): number {
        if (this.search) {
            return null;
        }
        return this.paginatorService.getIndex(this.pageEvent, this.pageSize, index);
    }

    updateStateOfList(): void {
        this.listOfUserIsEmpty = this.list.length === 0;
    }

    trackById(index, item) {
        return item.id;
    }
}
