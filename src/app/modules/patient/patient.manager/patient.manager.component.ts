import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { HttpResponse } from '@angular/common/http'
import { AuthService } from '../../../security/auth/services/auth.service'
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service'
import { LoadingService } from '../../../shared/shared.components/loading.component/service/loading.service'
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'app-patient-manager',
    templateUrl: './patient.manager.component.html',
    styleUrls: ['./patient.manager.component.scss']
})
export class PatientManagerComponent implements OnInit, AfterViewChecked {
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    listOfPatientsIsEmpty: boolean;
    listOfPatients: Array<Patient>;
    search: string;
    searchTime;
    cacheIdPatientRemove: string;

    constructor(
        private patientService: PatientService,
        private authService: AuthService,
        private paginatorService: PaginatorIntlService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private loadingService: LoadingService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private translateService: TranslateService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.listOfPatientsIsEmpty = false;
        this.listOfPatients = new Array<Patient>();
    }

    ngOnInit() {
        this.getAllPatients();
    }

    searchOnSubmit() {
        if (this.IsAdmin()) {
            clearInterval(this.searchTime);
            this.searchTime = setTimeout(() => {
                const userId = this.localStorageService.getItem('user');
                const studyId = this.localStorageService.getItem(userId);
                this.listOfPatients = [];
                this.patientService.getAllByPilotStudy(studyId, this.page, this.limit, this.search)
                    .then(httpResponse => {
                        this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                        if (httpResponse.body) {
                            this.listOfPatients = httpResponse.body;
                        }
                    })
                    .catch(() => {
                        this.listOfPatientsIsEmpty = this.listOfPatients.length === 0;
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.INFO-NOT-LOAD'));
                    });
            }, 500);
        }
    }

    getAllPatients() {
        if (this.IsAdmin()) {
            const userId = this.localStorageService.getItem('user');
            const studyId = this.localStorageService.getItem(userId);
            this.listOfPatients = [];
            this.patientService.getAllByPilotStudy(studyId, this.page, this.limit, this.search)
                .then((httpResponse: HttpResponse<any>) => {
                    this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                    if (httpResponse.body) {
                        this.listOfPatients = httpResponse.body;
                    }
                    this.listOfPatientsIsEmpty = (this.listOfPatients.length === 0);
                })
                .catch(() => {
                    this.listOfPatientsIsEmpty = this.listOfPatients.length === 0;
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.INFO-NOT-LOAD'));
                });
        }
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getAllPatients();
    }

    openModalConfirmation(patientId: string) {
        this.cacheIdPatientRemove = patientId;
        this.modalService.open('modalConfirmation');
    }

    closeModalComfimation() {
        this.cacheIdPatientRemove = '';
        this.modalService.close('modalConfirmation');
    }

    removePatient() {
        this.patientService.remove(this.cacheIdPatientRemove)
            .then(() => {
                this.getAllPatients();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PATIENT-REMOVED'));
                this.closeModalComfimation();
            })
            .catch(errorResponse => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-REMOVED'));
            });
    }

    getIndex(index: number): number {
        if (this.search) {
            return null;
        }
        return this.paginatorService.getIndex(this.pageEvent, this.limit, index);
    }

    IsAdmin(): boolean {
        return this.authService.decodeToken().sub_type === 'admin';
    }

    newPatient() {
        this.router.navigate(['/app/patients', 'new']);
    }

    trackById(index, item) {
        return item.id;
    }

    ngAfterViewChecked() {
        this.loadingService.close();
    }
}
