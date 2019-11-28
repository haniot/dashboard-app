import { AfterViewChecked, Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { HealthProfessionalService } from '../services/health.professional.service';
import { HealthProfessional } from '../models/health.professional';
import { GenericUser } from '../../../shared/shared.models/generic.user';
import { ConfigurationBasic } from '../../config.matpaginator'
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service'
import { LoadingService } from '../../../shared/shared.components/loading.component/service/loading.service'
import { ActivatedRoute } from '@angular/router'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'health-professionals',
    templateUrl: './health.professionals.component.html',
    styleUrls: ['./health.professionals.component.scss']
})
export class HealthProfessionalComponent implements OnInit, AfterViewChecked {
    userEdit: GenericUser = new HealthProfessional();
    healthProfessionals: Array<GenericUser> = [];
    page: number;
    limit: number;
    length: number;
    search: string;

    constructor(
        private healthService: HealthProfessionalService,
        private toastr: ToastrService,
        private modalService: ModalService,
        private activeRouter: ActivatedRoute,
        private loadinService: LoadingService,
        private translateService: TranslateService) {
        this.page = PaginatorConfig.page;
        this.limit = PaginatorConfig.limit;
        this.healthProfessionals = new Array<GenericUser>();
        this.getAllHealthProfessionals();
    }

    ngOnInit(): void {
        this.activeRouter.paramMap.subscribe((params) => {
            const healthprofessionalId = params.get('healthprofessionalId');
            if (healthprofessionalId) {
                this.healthService.getById(healthprofessionalId)
                    .then(user => {
                        this.editUser(user);
                    })
                    .catch(() => {
                        this.toastr.error(this.translateService.instant('TOAST-MESSAGES.NOT-FIND-USER'));
                    })
            }
        })
    }

    getAllHealthProfessionals() {
        this.healthProfessionals = [];
        this.healthService.getAll(this.page, this.limit, this.search)
            .then(httpResponse => {
                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    this.healthProfessionals = httpResponse.body;
                }
                this.loadinService.close();
            })
            .catch(() => {
                this.toastr.error(this.translateService.instant('TOAST-MESSAGES.NOT-LIST-HEALTHPROFESSIONALS'));
            });
    }

    createHealthProfessinal(event) {
        const email_registed = this.translateService.instant('TOAST-MESSAGES.EMAIL-REGISTRED');
        this.healthService.create(event)
            .then(date => {
                if (date) {
                    this.getAllHealthProfessionals();
                    this.toastr.info(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONAL-CREATED'));
                    this.modalService.close('modalUser');
                } else {
                    this.toastr.error(email_registed, this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONAL-NOT-CREATED'));
                    this.modalService.actionNotExecuted('modalUser', event);
                }
            })
            .catch(errorResponse => {
                if (errorResponse.status === 409 &&
                    errorResponse.error.code === 409 &&
                    errorResponse.error.message === 'A registration with the same unique data already exists!') {
                    this.toastr.error(email_registed);
                } else {
                    this.toastr.error(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONAL-NOT-CREATED'));
                }
                this.modalService.actionNotExecuted('modalUser', event, errorResponse.error);
            });
    }

    editHealthProfessinal(healthProfessional) {
        const email_registed = this.translateService.instant('TOAST-MESSAGES.EMAIL-REGISTRED');
        this.healthService.update(healthProfessional)
            .then(date => {
                if (date) {
                    this.getAllHealthProfessionals();
                    this.toastr.info(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONAL-UPDATED'));
                    this.modalService.close('modalUserEdit');
                } else {
                    this.toastr.error(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONAL-NOT-UPDATED'));
                    this.modalService.actionNotExecuted('modalUserEdit', healthProfessional);
                }
            })
            .catch(errorResponse => {
                if (errorResponse.status === 409 &&
                    errorResponse.error.code === 409 &&
                    errorResponse.error.message === 'A registration with the same unique data already exists!') {
                    this.toastr.error(email_registed);
                } else {
                    this.toastr.error(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONAL-NOT-UPDATED'));
                }
                this.modalService.actionNotExecuted('modalUserEdit', healthProfessional);
            });
    }

    openModal() {
        this.modalService.open('modalUser');
        this.userEdit = new HealthProfessional();
    }

    editUser(event) {
        this.modalService.open('modalUserEdit');
        this.userEdit = event;
    }

    paginationEvent(event) {
        this.page = event.page;
        this.limit = event.limit;
        this.search = event.search;
        this.getAllHealthProfessionals();
    }

    ngAfterViewChecked() {
        this.loadinService.close();
    }

}
