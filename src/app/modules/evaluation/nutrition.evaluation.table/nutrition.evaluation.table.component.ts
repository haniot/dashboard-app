import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { EvaluationService } from '../services/evaluation.service';
import { NutritionEvaluation } from '../models/nutrition-evaluation';
import { NutritionEvaluationService } from '../services/nutrition.evaluation.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'nutrition-evaluation-table',
    templateUrl: './nutrition.evaluation.table.component.html',
    styleUrls: ['./nutrition.evaluation.table.component.scss']
})
export class NutritionEvaluationTableComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    /* Paging Settings */
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    listOfEvaluations: Array<NutritionEvaluation>;
    search: string;
    searchTime;
    cacheIdEvaluationRemove: string;
    listOfEvaluationsIsEmpty: boolean;

    constructor(
        private evaluationService: EvaluationService,
        private nutritionService: NutritionEvaluationService,
        private paginatorService: PaginatorIntlService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private translateService: TranslateService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.listOfEvaluationsIsEmpty = false;
        this.listOfEvaluations = new Array<NutritionEvaluation>();
    }

    ngOnInit() {
        this.getAllNutritionEvaluations();
    }

    searchOnSubmit() {
        if (this.patientId) {
            clearInterval(this.searchTime);
            this.searchTime = setTimeout(() => {
                this.nutritionService.getAllByPatient(this.patientId, this.page, this.limit, this.search)
                    .then(httpResponse => {
                        this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                        this.listOfEvaluations = new Array<NutritionEvaluation>();
                        if (httpResponse.body && httpResponse.body.length) {
                            const nutritionsEvaluations = httpResponse.body
                            this.listOfEvaluations = nutritionsEvaluations;
                        }
                        this.listOfEvaluationsIsEmpty = !(this.listOfEvaluations && this.listOfEvaluations.length);
                    })
                    .catch(() => {
                        this.listOfEvaluationsIsEmpty = true;
                    });
            }, 500);
        }
    }

    getAllNutritionEvaluations() {
        if (this.patientId) {
            this.nutritionService.getAllByPatient(this.patientId, this.page, this.limit, this.search)
                .then(httpResponse => {
                    this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                    this.listOfEvaluations = new Array<NutritionEvaluation>();
                    if (httpResponse.body && httpResponse.body.length) {
                        const nutritionsEvaluations = httpResponse.body
                        this.listOfEvaluations = nutritionsEvaluations;
                    }
                    this.listOfEvaluationsIsEmpty = !(this.listOfEvaluations && this.listOfEvaluations.length);
                })
                .catch(() => {
                    this.listOfEvaluationsIsEmpty = true;
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.INFO-NOT-LOAD'));
                });
        }
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getAllNutritionEvaluations();
    }

    openModalConfirmation(patient_id: string, evaluation_id: string) {
        this.patientId = patient_id;
        this.cacheIdEvaluationRemove = evaluation_id;
        this.modalService.open('modalConfirmation');
    }

    closeModalComfimation() {
        this.cacheIdEvaluationRemove = '';
        this.modalService.close('modalConfirmation');
    }

    removeEvaluation() {
        if (this.patientId && this.cacheIdEvaluationRemove) {
            this.nutritionService.remove(this.patientId, this.cacheIdEvaluationRemove)
                .then(() => {
                    this.getAllNutritionEvaluations();
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.EVALUATION-REMOVED'));
                    this.closeModalComfimation();
                })
                .catch(errorResponse => {
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

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.patientId.currentValue !== undefined && changes.patientId.previousValue === undefined) {
            this.getAllNutritionEvaluations();
        }
    }
}
