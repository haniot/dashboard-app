import {Component, OnInit, AfterViewInit, AfterViewChecked} from '@angular/core';
import {AuthService} from 'app/security/auth/services/auth.service';
import {PageEvent} from '@angular/material';
import {Patient} from '../models/patient';
import {PatientService} from '../services/patient.service';
import {ToastrService} from 'ngx-toastr';
import {ModalService} from 'app/shared/shared-components/haniot-modal/service/modal.service';
import {LoadingService} from 'app/shared/shared-components/loading-component/service/loading.service';
import {Router} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-patient-manager',
    templateUrl: './patient-manager.component.html',
    styleUrls: ['./patient-manager.component.scss']
})
export class PatientManagerComponent implements OnInit, AfterViewChecked {
    // MatPaginator Inputs
    pageSizeOptions: number[] = [5, 10, 25, 100];

    // MatPaginator Output
    pageEvent: PageEvent;

    /* Controles de paginação */
    page: number = 1;
    limit: number = 5;
    length: number;

    listOfPatientsIsEmpty: boolean = false;

    listOfPatients = new Array<Patient>();
    search: string;
    searchTime;

    cacheIdPatientRemove: string;

    constructor(
        private patientService: PatientService,
        private authService: AuthService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private loadinService: LoadingService,
        private router: Router,
        private translateService: TranslateService
    ) {
    }

    ngOnInit() {
        this.getAllPacients();
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
                    .catch(errorResponse => {
                        // console.log('Erro ao buscar pacientes: ', errorResponse);
                    });
            }, 200);
        }
    }

    getAllPacients() {
        if (this.IsAdmin()) {
            this.patientService.getAll(this.page, this.limit, this.search)
                .then(patients => {
                    this.listOfPatients = patients;
                    this.calcLengthPatients();
                    if (patients.length == 0) {
                        this.listOfPatientsIsEmpty = true;
                    } else {
                        this.listOfPatientsIsEmpty = false;
                    }
                })
                .catch(errorResponse => {
                    // console.log('Erro ao buscar pacientes: ', errorResponse);
                });
        }
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getAllPacients();
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
                this.getAllPacients();
                this.calcLengthPatients();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PATIENT-REMOVED'));
            })
            .catch(errorResponse => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-REMOVED'));
                // console.log('Não foi possível remover paciente!', errorResponse);
            });
    }

    getIndex(index: number): number {
        if (this.search) {
            return null;
        }
        const size = this.pageEvent && this.pageEvent.pageSize ? this.pageEvent.pageSize : this.limit;

        if (this.pageEvent && this.pageEvent.pageIndex) {
            return index + 1 + size * this.pageEvent.pageIndex;
        } else {
            return index + Math.pow(size, 1 - 1);
        }
    }

    calcLengthPatients() {
        if (this.IsAdmin()) {
            this.patientService.getAll(undefined, undefined, this.search)
                .then(patients => {
                    this.length = patients.length;
                })
                .catch(errorResponse => {
                    // console.log('Não foi possível buscar todos os pacientes',errorResponse);
                });
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
        this.loadinService.close();
    }
}
