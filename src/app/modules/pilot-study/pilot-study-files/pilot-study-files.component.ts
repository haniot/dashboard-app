import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { OdontologicEvaluation } from '../../evaluation/models/odontologic-evaluation';
import { PilotStudy } from '../models/pilot.study';
import { ModalService } from '../../../shared/shared-components/haniot-modal/service/modal.service';
import { PilotStudyService } from '../services/pilot-study.service';
import { DateRange } from '../models/range-date';
import { LocalStorageService } from '../../../shared/shared-services/localstorage.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config-matpaginator'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'pilot-study-files',
    templateUrl: './pilot-study-files.component.html',
    styleUrls: ['./pilot-study-files.component.scss']
})
export class PilotStudyFilesComponent implements OnInit, OnChanges {
    @Input() pilotStudy: PilotStudy;
    /* Paging Settings */
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    listOfFiles: Array<OdontologicEvaluation>;
    search: DateRange;
    searchTime;
    cacheIdFileRemove: string;
    lastFiles: OdontologicEvaluation;
    generatingFile: boolean;
    listOfFilesIsEmpty: boolean;
    removingFile: boolean;

    constructor(
        private pilotService: PilotStudyService,
        private paginatorService: PaginatorIntlService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private sanitizer: DomSanitizer
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.generatingFile = false;
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
                        this.listOfFilesIsEmpty = !files.length;
                    })
                    .catch();
            }, 200);
        }
    }

    getAllFiles() {
        if (this.pilotStudy && this.pilotStudy.id) {
            this.pilotService.getAllFiles(this.pilotStudy.id, this.page, this.limit)// TODO: Adicionar this.search
                .then(files => {
                    this.listOfFiles = files;
                    this.calcLenghtFiles();
                    this.lastFiles = files[0];
                    this.listOfFilesIsEmpty = !files.length;
                })
                .catch(() => {
                    this.listOfFilesIsEmpty = true;
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
                .catch(() => {
                    this.removingFile = false;
                    this.openModalConfirmation(this.cacheIdFileRemove);
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.FILE-NOT-REMOVED'));
                });
        }
    }

    getIndex(index: number): number {
        if (this.search) {
            return null;
        }
        return this.paginatorService.getIndex(this.pageEvent, this.limit, index);
    }

    calcLenghtFiles() {
        if (this.pilotStudy && this.pilotStudy.id) {
            this.pilotService.getAllFiles(this.pilotStudy.id, undefined, undefined)// FIXME: Adicionar this.search
                .then(files => {
                    this.length = files.length;
                })
                .catch();
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

    getTrustedUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}
