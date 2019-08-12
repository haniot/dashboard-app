import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material';

import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { Patient } from '../../patient/models/patient'
import { PatientService } from '../../patient/services/patient.service'
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnChanges {
    @Input() pilotStudyId;
    @Output() selected = new EventEmitter();
    /*  */
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    listOfPatientsIsEmpty: boolean;
    listOfPatients = new Array<Patient>();
    search: string;
    searchTime;
    listClass: Array<string>;
    cacheIdPatientRemove: string;

    constructor(
        private patientService: PatientService,
        private paginatorService: PaginatorIntlService,
        private modalService: ModalService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.listOfPatientsIsEmpty = false;
        this.listOfPatients = new Array<Patient>();
        this.listClass = new Array<string>();
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.patientService.getAllByPilotStudy(this.pilotStudyId, this.page, this.limit, this.search)
                .then(httpResponse => {
                    this.length = parseInt(httpResponse.headers.get('x-total-count'), 10)
                    if (httpResponse.body && httpResponse.body.length) {
                        this.listOfPatients = httpResponse.body;
                    }
                    this.listOfPatientsIsEmpty = !(this.listOfPatients && this.listOfPatients.length);
                })
                .catch(() => {
                    this.listOfPatientsIsEmpty = true;
                });
        }, 200);
    }

    getAllPacients() {
        this.patientService.getAllByPilotStudy(this.pilotStudyId, this.page, this.limit, this.search)
            .then(httpResponse => {
                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10)
                this.listOfPatients = this.listOfPatients;
                this.listOfPatientsIsEmpty = !(this.listOfPatients && this.listOfPatients.length);
            })
            .catch(() => {
                this.listOfPatientsIsEmpty = true;
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

    getIndex(index: number): number {
        if (this.search) {
            return null;
        }
        return this.paginatorService.getIndex(this.pageEvent, this.limit, index);
    }

    selectPatient(patient_id: string) {
        this.listClass = new Array<string>();
        let local_index = 0;
        this.selected.emit(patient_id);
        this.listOfPatients.forEach((patient, index) => {
            if (patient.id === patient_id) {
                local_index = index;
                return;
            }
        });
        this.listClass[local_index] = 'tr-selected';
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.pilotStudyId.currentValue !== '' && changes.pilotStudyId.currentValue !== changes.pilotStudyId.previousValue) {
            this.getAllPacients();
        }
    }
}
