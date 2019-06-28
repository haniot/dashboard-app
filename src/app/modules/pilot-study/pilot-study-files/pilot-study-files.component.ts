import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PageEvent} from "@angular/material";
import {OdontologicEvaluation} from "../../evaluation/models/odontologic-evaluation";
import {PilotStudy} from "../models/pilot.study";

import {ToastrService} from "ngx-toastr";
import {ModalService} from "../../../shared/shared-components/haniot-modal/service/modal.service";
import {PilotStudyService} from "../services/pilot-study.service";
import {DateRange} from "../models/range-date";
import {LocalStorageService} from "../../../shared/shared-services/localstorage.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'pilot-study-files',
    templateUrl: './pilot-study-files.component.html',
    styleUrls: ['./pilot-study-files.component.scss']
})
export class PilotStudyFilesComponent implements OnInit, OnChanges {

    // MatPaginator Inputs
    pageSizeOptions: number[] = [10, 25, 100];

    // MatPaginator Output
    pageEvent: PageEvent;

    /* Controles de paginação */
    page: number = 1;
    limit: number = 10;
    length: number;

    listOfFiles: Array<OdontologicEvaluation>;
    search: DateRange;
    searchTime;

    @Input() pilotStudy: PilotStudy;

    cacheIdFileRemove: string;

    lastFiles: OdontologicEvaluation;

    generatingFile: boolean = false;

    listOfFilesIsEmpty: boolean;

    removingFile: boolean;

    constructor(
        private pilotService: PilotStudyService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService
    ) {
        this.pilotStudy = new PilotStudy();
        this.listOfFiles = new Array<OdontologicEvaluation>();
        this.listOfFilesIsEmpty = false;
        this.search = new DateRange();
        this.removingFile = false;
    }

    ngOnInit() {
        this.getAllFiles();
        this.calcLenghtFiles();
    }

    searchOnSubmit() {
        if (this.pilotStudy && this.pilotStudy.id) {
            clearInterval(this.searchTime);
            this.searchTime = setTimeout(() => {
                this.pilotService.getAllFiles(this.pilotStudy.id, this.page, this.limit, this.search)
                    .then(files => {
                        this.listOfFiles = files;
                        this.calcLenghtFiles();
                        if (files.length) {
                            this.listOfFilesIsEmpty = false;
                        } else {
                            this.listOfFilesIsEmpty = true;
                        }
                    })
                    .catch(errorResponse => {
                        // console.log('Erro ao buscar avaliações do pacientes: ', errorResponse);
                    });
            }, 200);
        }
    }

    getAllFiles() {
        if (this.pilotStudy && this.pilotStudy.id) {
            this.pilotService.getAllFiles(this.pilotStudy.id, this.page, this.limit)// FIXME: Adicionar this.search
                .then(files => {
                    this.listOfFiles = files;

                    this.calcLenghtFiles();
                    this.lastFiles = files[0];
                    if (files.length) {
                        this.listOfFilesIsEmpty = false;
                    } else {
                        this.listOfFilesIsEmpty = true;
                    }
                })
                .catch(errorResponse => {
                    this.listOfFilesIsEmpty = true;
                    // console.log('Erro ao buscar avaliações do pacientes: ', errorResponse);
                });
        }
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getAllFiles();
    }

    openModalConfirmation(file_id: string) {
        this.cacheIdFileRemove = file_id
        this.modalService.open('modalConfirmation');
    }

    closeModalComfimation() {
        this.modalService.close('modalConfirmation');
    }

    removeFile() {
        this.removingFile = true;
        this.closeModalComfimation();
        if (this.pilotStudy && this.pilotStudy.id) {
            this.pilotService.removeFile(this.pilotStudy.id, this.cacheIdFileRemove)
                .then(() => {
                    this.getAllFiles();
                    this.calcLenghtFiles();
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.FILE-REMOVED'));
                    this.removingFile = false;
                    this.cacheIdFileRemove = '';
                })
                .catch(errorResponse => {
                    this.removingFile = false;
                    this.openModalConfirmation(this.cacheIdFileRemove);
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.FILE-NOT-REMOVED'));
                    // console.log('Não foi possível remover paciente!', errorResponse);
                });
        }
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

    calcLenghtFiles() {
        if (this.pilotStudy && this.pilotStudy.id) {
            this.pilotService.getAllFiles(this.pilotStudy.id, undefined, undefined)// FIXME: Adicionar this.search
                .then(files => {
                    this.length = files.length;
                })
                .catch(errorResponse => {
                    // console.log('Não foi possível buscar todos as avaliações do pacientes',errorResponse);
                });
        }
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.pilotStudy.currentValue !== changes.pilotStudy.previousValue) {
            this.getAllFiles();
            this.calcLenghtFiles();
        }
    }

    generateFile() {
        const user_id = this.localStorageService.getItem('user');
        this.generatingFile = true;
        this.pilotService.generateNewFile(this.pilotStudy, user_id)
            .then(newFile => {
                this.lastFiles = newFile;
                this.fileGenerated();
                this.generatingFile = false;
                this.getAllFiles();
            })
            .catch(error => {
                    this.generatingFile = false;
                    if (error.code === 404 && error.message === 'PILOTSTUDY NOT FOUND') {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-FOUND'));
                    } else if (error.code === 404 && error.message === 'HEALTHPROFESSIONALID NOT FOUND') {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONALS-NOTFOUND'));
                    } else if (error.code === 400 && error.message === 'PILOTSTUDY EMPTY') {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-EMPTY'));
                    } else if (error.code === 400) {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-ERROR'));
                    } else {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.EVALUATION-NOT-GENERATED'));
                    }
                    // console.log('Não foi possível gerar avaliação!', error)
                }
            )
    }

    fileGenerated() {
        this.modalService.open('modalFile');
    }

    closeModalFile() {
        this.modalService.close('modalFile');
    }

    cleanDateRange() {
        this.search = new DateRange();
        this.getAllFiles();
    }

    trackById(index, item) {
        return item.id;
    }

}
