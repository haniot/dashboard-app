import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { PageEvent } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { EvaluationService } from '../services/evaluation.service';
import { OdontologicEvaluation } from '../models/odontologic-evaluation';
import { DentalEvaluationService } from '../services/dental.evaluation.service';
import { PilotStudy } from '../../pilot.study/models/pilot.study';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'dental-evaluation-table',
    templateUrl: './dental.evaluation.table.component.html',
    styleUrls: ['./dental.evaluation.table.component.scss']
})
export class DentalEvaluationTableComponent implements OnInit, OnChanges {
    @Input() pilotStudy: PilotStudy;
    /* Paging Settings */
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    listOfEvaluations: Array<OdontologicEvaluation>;
    search: string;
    searchTime;
    cacheIdEvaluationRemove: string;
    lastEvaluation: OdontologicEvaluation;
    generatingEvaluantion: boolean;
    listOfEvaluationsIsEmpty: boolean;

    constructor(
        private evaluationService: EvaluationService,
        private dentalEvaluation: DentalEvaluationService,
        private dentalService: DentalEvaluationService,
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
        this.generatingEvaluantion = false;
        this.pilotStudy = new PilotStudy();
        this.listOfEvaluations = new Array<OdontologicEvaluation>();
        this.listOfEvaluationsIsEmpty = false;
    }

    ngOnInit() {
        this.getAllNutritionEvaluations();
        this.calcLenghtNutritionEvaluations();
    }

    searchOnSubmit() {
        if (this.pilotStudy && this.pilotStudy.id) {
            clearInterval(this.searchTime);
            this.searchTime = setTimeout(() => {
                this.dentalService.getAllByPilotstudy(this.pilotStudy.id, this.page, this.limit, this.search)
                    .then(dentalsEvaluations => {
                        this.listOfEvaluations = dentalsEvaluations;
                        this.calcLenghtNutritionEvaluations();
                    })
                    .catch();
            }, 500);
        }
    }

    getAllNutritionEvaluations() {
        if (this.pilotStudy && this.pilotStudy.id) {
            this.dentalService.getAllByPilotstudy(this.pilotStudy.id, this.page, this.limit, this.search)
                .then(dentalsEvaluations => {
                    this.listOfEvaluations = dentalsEvaluations;
                    this.calcLenghtNutritionEvaluations();
                    this.lastEvaluation = dentalsEvaluations[0];
                    this.listOfEvaluationsIsEmpty = !dentalsEvaluations.length;
                })
                .catch(() => {
                    this.listOfEvaluationsIsEmpty = true;
                });
        }
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getAllNutritionEvaluations();
    }

    openModalConfirmation(evaluation_id: string) {
        this.cacheIdEvaluationRemove = evaluation_id;
        this.modalService.open('modalConfirmation');
    }

    closeModalComfimation() {
        this.cacheIdEvaluationRemove = '';
        this.modalService.close('modalConfirmation');
    }

    removeEvaluation() {
        if (this.pilotStudy && this.pilotStudy.id) {
            this.dentalEvaluation.remove(this.pilotStudy.id, this.cacheIdEvaluationRemove)
                .then(() => {
                    this.getAllNutritionEvaluations();
                    this.calcLenghtNutritionEvaluations();
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.EVALUATION-REMOVED'));
                    this.closeModalComfimation();
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.EVALUATION-NOT-REMOVED'));
                });
        }
    }

    getIndex(index: number): number {
        if (this.search) {
            return null;
        }
        return this.paginatorService.getIndex(this.pageEvent, this.limit, index);
    }

    calcLenghtNutritionEvaluations() {
        if (this.pilotStudy && this.pilotStudy.id) {
            this.dentalService.getAllByPilotstudy(this.pilotStudy.id, undefined, undefined, this.search)
                .then(nutritionEvaluations => {
                    this.length = nutritionEvaluations.length;
                })
                .catch();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.pilotStudy.currentValue !== changes.pilotStudy.previousValue) {
            this.getAllNutritionEvaluations();
            this.calcLenghtNutritionEvaluations();
        }
    }

    generateEvaluation() {
        const user_id = this.localStorageService.getItem('user');
        this.generatingEvaluantion = true;
        this.dentalService.generateNewEvaluation(this.pilotStudy, user_id)
            .then(odontologicalEvaluation => {
                this.lastEvaluation = odontologicalEvaluation;
                this.dentalEvaluationGenerated();
                this.generatingEvaluantion = false;
            })
            .catch(error => {
                    this.generatingEvaluantion = false;
                    if (error.code === 404 && error.message === 'PILOTSTUDY NOT FOUND') {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-FOUND'));
                    } else if (error.code === 404 && error.message === 'HEALTHPROFESSIONALID NOT FOUND') {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONALS-NOTFOUND'));
                    } else if (error.code === 400 && error.message === 'PILOTSTUDY EMPTY') {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-EMPTY'));
                    } else if (error.code === 400) {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-ERROR'));
                    } else {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.DATA-NOT-SOLICITED'));
                    }
                }
            )
    }

    dentalEvaluationGenerated() {
        this.modalService.open('dentalEvaluation');
    }

    closeModalDentalEvaluation() {
        this.modalService.close('dentalEvaluation');
    }

    trackById(index, item) {
        return item.id;
    }

    getTrustedUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}
