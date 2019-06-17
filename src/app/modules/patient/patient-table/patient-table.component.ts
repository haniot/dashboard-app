import {AfterViewChecked, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';

import {ToastrService} from 'ngx-toastr';
import {ISubscription} from 'rxjs/Subscription';
import {ModalService} from 'app/shared/shared-components/haniot-modal/service/modal.service';
import {LoadingService} from "../../../shared/shared-components/loading-component/service/loading.service";
import {SelectPilotStudyService} from "../../../shared/shared-components/select-pilotstudy/service/select-pilot-study.service";
import {Patient} from '../models/patient';
import {PatientService} from '../services/patient.service';

@Component({
    selector: 'patient-table',
    templateUrl: './patient-table.component.html',
    styleUrls: ['./patient-table.component.scss']
})
export class PatientTableComponent implements OnInit, AfterViewChecked, OnChanges, OnDestroy {
    // MatPaginator Inputs
    pageSizeOptions: number[] = [10, 25, 100];

    // MatPaginator Output
    pageEvent: PageEvent;

    /* Controles de paginação */
    page = 1;
    limit = 10;
    length: number;

    listOfPatientsIsEmpty = false;

    listOfPatients = new Array<Patient>();
    search: string;
    searchTime;

    @Input() pilotStudyId;

    cacheIdPatientRemove: string;

    userId: string;

    private subscriptions: Array<ISubscription>;

    constructor(
        private patientService: PatientService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private loadinService: LoadingService,
        private selectStudyService: SelectPilotStudyService
    ) {
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.subscriptions.push(this.selectStudyService.pilotStudyUpdated.subscribe(() => {
            this.loadPilotSelected();
            this.getAllPacients();
        }));
    }

    loadUser(): void {
        this.userId = atob(localStorage.getItem('user'));
    }

    loadPilotSelected(): void {
        if (!this.userId) {
            this.loadUser();
        }
        const pilotselected = localStorage.getItem(this.userId);
        if (pilotselected) {
            this.pilotStudyId = pilotselected;
        }
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.patientService.getAllByPilotStudy(this.pilotStudyId, this.page, this.limit, this.search)
                .then(patients => {
                    this.listOfPatients = patients;
                    this.calcLengthPatients();
                    if (this.listOfPatients.length === 0) {
                        this.listOfPatientsIsEmpty = true;
                    } else {
                        this.listOfPatientsIsEmpty = false;
                    }
                })
                .catch(errorResponse => {
                    // console.log('Erro ao buscar pacientes: ', errorResponse);
                });
        }, 200);
    }

    getAllPacients() {
        this.patientService.getAllByPilotStudy(this.pilotStudyId, this.page, this.limit, this.search)
            .then(patients => {
                this.listOfPatients = patients;
                this.calcLengthPatients();
                if (this.listOfPatients.length === 0) {
                    this.listOfPatientsIsEmpty = true;
                } else {
                    this.listOfPatientsIsEmpty = false;
                }
            })
            .catch(errorResponse => {
                // console.log('Erro ao buscar pacientes: ', errorResponse);
            });
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getAllPacients();
    }

    openModalConfirmation(pilotstudy_id: string, patientId: string) {
        this.cacheIdPatientRemove = patientId;
        this.pilotStudyId = pilotstudy_id;
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
                this.toastService.info('Paciente removido com sucesso!');
                this.closeModalComfimation();
            })
            .catch(errorResponse => {
                this.toastService.error('Não foi possível remover usuário!');
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
        this.patientService.getAllByPilotStudy(this.pilotStudyId, undefined, undefined, this.search)
            .then(patients => {
                this.length = patients.length;
            })
            .catch(errorResponse => {
                // console.log('Não foi possível buscar todos os pacientes',errorResponse);
            });
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((this.pilotStudyId && changes.pilotStudyId.currentValue !== changes.pilotStudyId.previousValue)) {
            this.getAllPacients();
        }
    }

    ngAfterViewChecked() {
        this.loadinService.close();
    }

    ngOnDestroy(): void {
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
