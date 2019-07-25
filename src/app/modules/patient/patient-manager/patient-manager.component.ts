import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';
import { LoadingService } from 'app/shared/shared-components/loading-component/service/loading.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config-matpaginator'
import { AuthService } from 'app/security/auth/services/auth.service';

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'app-patient-manager',
    templateUrl: './patient-manager.component.html',
    styleUrls: ['./patient-manager.component.scss']
})
export class PatientManagerComponent implements OnInit, AfterViewChecked {
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    listOfPatientsIsEmpty: boolean;
    listOfPatients = new Array<Patient>();
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
        private router: Router,
        private translateService: TranslateService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.listOfPatientsIsEmpty = false;
    }

    ngOnInit() {
        this.getAllPatients();
    }

    searchOnSubmit() {
        if (this.IsAdmin()) {
            clearInterval(this.searchTime);
            this.searchTime = setTimeout(() => {
                this.patientService.getAll(this.page, this.limit, this.search)
                    .then(patients => {
                        this.listOfPatients = patients;
                        this.calcLengthPatients();
                    })
                    .catch();
            }, 200);
        }
    }

    getAllPatients() {
        if (this.IsAdmin()) {
            this.patientService.getAll(this.page, this.limit, this.search)
                .then(patients => {
                    this.listOfPatients = patients;
                    this.calcLengthPatients();
                    this.listOfPatientsIsEmpty = (patients.length === 0);
                })
                .catch();
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
                this.calcLengthPatients();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PATIENT-REMOVED'));
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

    calcLengthPatients() {
        if (this.IsAdmin()) {
            this.patientService.getAll(undefined, undefined, this.search)
                .then(patients => {
                    this.length = patients.length;
                })
                .catch();
        }
    }

    IsAdmin(): boolean {
        return this.authService.decodeToken().sub_type === 'admin';
    }

    newPatient() {
        this.router.navigate(['patients', 'new']);
    }

    trackById(index, item) {
        return item.id;
    }

    ngAfterViewChecked() {
        this.loadingService.close();
    }
}
