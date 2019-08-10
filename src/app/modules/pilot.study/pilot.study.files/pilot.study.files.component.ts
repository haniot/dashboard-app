import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { PilotStudy } from '../models/pilot.study';
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service';
import { PilotStudyService } from '../services/pilot.study.service';
import { DateRange } from '../models/range-date';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { Data, DataResponse } from '../../evaluation/models/data'
import { MeasurementService } from '../../measurement/services/measurement.service'
import { MeasurementType } from '../../measurement/models/measurement.types'
import { NutritionalQuestionnairesService } from '../../habits/services/nutritional.questionnaires.service'
import { QuestionnaireType } from '../../habits/models/questionnaire.type'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'pilot-study-files',
    templateUrl: './pilot.study.files.component.html',
    styleUrls: ['./pilot.study.files.component.scss']
})
export class PilotStudyFilesComponent implements OnInit, OnChanges {
    @Input() pilotStudy: PilotStudy;
    /* Paging Settings */
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    listOfFiles: Array<Data>;
    search: DateRange;
    searchTime;
    cacheIdFileRemove: string;
    lastFile: Data;
    generatingFile: boolean;
    listOfFilesIsEmpty: boolean;
    removingFile: boolean;
    dataResponse: DataResponse;
    measurementsTypeOptions: Array<MeasurementType>
    questionnaireTypeOptions: QuestionnaireType;
    checkSelectMeasurementTypeAll: boolean;
    listCheckMeasurementTypes: Array<boolean>;
    checkSelectQuestionnaireTypeAll: boolean;
    listCheckQuestionnaireNutritionalTypes: Array<boolean>;
    listCheckQuestionnaireOdontologicalTypes: Array<boolean>;

    constructor(
        private pilotService: PilotStudyService,
        private paginatorService: PaginatorIntlService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private sanitizer: DomSanitizer,
        private measurementService: MeasurementService,
        private questionnaireService: NutritionalQuestionnairesService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.generatingFile = false;
        this.pilotStudy = new PilotStudy();
        this.listOfFiles = new Array<Data>();
        this.listOfFilesIsEmpty = false;
        this.search = new DateRange();
        this.removingFile = false;
        this.dataResponse = new DataResponse();
        this.checkSelectMeasurementTypeAll = false;
        this.listCheckMeasurementTypes = new Array<boolean>();
        this.questionnaireTypeOptions = new QuestionnaireType();
        this.listCheckQuestionnaireNutritionalTypes = new Array<boolean>();
        this.listCheckQuestionnaireOdontologicalTypes = new Array<boolean>();
    }

    ngOnInit() {
        this.getAllFiles();
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
            this.listOfFiles = [];
            this.pilotService.getAllFiles(this.pilotStudy.id, this.page, this.limit, this.search)
                .then(files => {
                    this.listOfFiles = files;
                    // this.calcLenghtFiles();
                    this.lastFile = files[0];
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
            this.pilotService.getAllFiles(this.pilotStudy.id, undefined, undefined, this.search)
                .then(files => {
                    this.length = files.length;
                })
                .catch();
        }
    }

    generateFile() {
        this.loadMeasurementsTypes();
        const user_id = this.localStorageService.getItem('user');
        this.generatingFile = true;
        this.pilotService.generateNewFile(this.pilotStudy, user_id)
            .then(response => {
                this.dataResponse = response;
                setTimeout(() => {
                    this.openModalFileInProcessing();
                    this.generatingFile = false;
                    this.getAllFiles();
                }, 3000)
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

    openModalFileConfig() {
        this.loadMeasurementsTypes()
            .then(() => {
                this.modalService.open('modalFileConfig');
            })
            .catch();
        this.loadQuestionnaireTypes();

    }

    closeModalFileConfig() {
        this.modalService.close('modalFileConfig');
    }

    openModalFileInProcessing() {
        this.modalService.open('modalFileInProcessing');
    }

    closeModalFileInProcessing() {
        this.modalService.close('modalFileInProcessing');
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

    loadMeasurementsTypes(): Promise<any> {
        return this.measurementService.getAllTypes()
            .then(types => {
                this.measurementsTypeOptions = types;
                this.measurementsTypeOptions.forEach(() => {
                    this.listCheckMeasurementTypes.push(false);
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    loadQuestionnaireTypes(): void {
        this.questionnaireService.getAllTypes()
            .then(types => {
                this.questionnaireTypeOptions = types;
                this.questionnaireTypeOptions.odontological.forEach(() => {
                    this.listCheckQuestionnaireOdontologicalTypes.push(false);
                })
                this.questionnaireTypeOptions.nutritional.forEach(() => {
                    this.listCheckQuestionnaireNutritionalTypes.push(false);
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    clickCheckMeasurementTypeAll() {
        this.listCheckMeasurementTypes.forEach((item, index) => {
            this.listCheckMeasurementTypes[index] = !this.checkSelectMeasurementTypeAll;
        });
    }

    clickCheckQuestionnaireTypeAll() {
        this.listCheckQuestionnaireNutritionalTypes.forEach((item, index) => {
            this.listCheckQuestionnaireNutritionalTypes[index] = !this.checkSelectQuestionnaireTypeAll;
        });
        this.listCheckQuestionnaireOdontologicalTypes.forEach((item, index) => {
            this.listCheckQuestionnaireOdontologicalTypes[index] = !this.checkSelectQuestionnaireTypeAll;
        });
    }

    changeMeasurementTypeCheck(): void {
        const typesSelected = this.listCheckMeasurementTypes.filter(item => item === true);
        this.checkSelectMeasurementTypeAll = this.listCheckMeasurementTypes.length === typesSelected.length;
    }

    changeQuestionnaireTypeCheck(): void {
        const typesNutritionalSelected = this.listCheckQuestionnaireNutritionalTypes.filter(item => item === true);
        const typesOdontologicalSelected = this.listCheckQuestionnaireOdontologicalTypes.filter(item => item === true);

        this.checkSelectQuestionnaireTypeAll =
            (this.listCheckQuestionnaireNutritionalTypes.length + this.listCheckQuestionnaireOdontologicalTypes.length)
            === (typesNutritionalSelected.length + typesOdontologicalSelected.length)
    }

    trackById(index, item) {
        return item.id;
    }

    getTrustedUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.pilotStudy.currentValue !== changes.pilotStudy.previousValue) {
            this.getAllFiles();
            this.calcLenghtFiles();
        }
    }

}
