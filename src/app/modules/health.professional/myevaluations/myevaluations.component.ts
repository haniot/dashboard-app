import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { PageEvent } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NutritionEvaluation } from '../../evaluation/models/nutrition-evaluation';
import { EvaluationService } from '../../evaluation/services/evaluation.service';
import { NutritionEvaluationService } from '../../evaluation/services/nutrition.evaluation.service';
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'app-myevaluations',
    templateUrl: './myevaluations.component.html',
    styleUrls: ['./myevaluations.component.scss']
})
export class MyevaluationsComponent implements OnInit, OnChanges {
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
    patientId: string;
    userId: string;

    constructor(
        private evaluationService: EvaluationService,
        private nutritionService: NutritionEvaluationService,
        private paginatorService: PaginatorIntlService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.listOfEvaluationsIsEmpty = false;
        this.cacheIdEvaluationRemove = '';
        this.listOfEvaluations = new Array<NutritionEvaluation>();
    }

    ngOnInit() {
        this.getAllNutritionEvaluations();
    }

    loadUserId() {
        this.userId = this.localStorageService.getItem('user');
    }

    searchOnSubmit() {
        if (!this.userId) {
            this.loadUserId();
        }
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.listOfEvaluations = [];
            this.nutritionService.getAllByHealthprofessional(this.userId, null, this.limit, this.search)
                .then(httpResponse => {
                    this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                    this.listOfEvaluations = new Array<NutritionEvaluation>();
                    if (httpResponse.body && httpResponse.body.length) {
                        this.listOfEvaluations = httpResponse.body;
                    }
                    this.listOfEvaluationsIsEmpty = !(this.listOfEvaluations && this.listOfEvaluations.length);
                })
                .catch(() => {
                    this.listOfEvaluationsIsEmpty = true;
                });
        }, 500);

    }

    getAllNutritionEvaluations() {
        if (!this.userId) {
            this.loadUserId();
        }
        this.listOfEvaluations = [];
        this.nutritionService.getAllByHealthprofessional(this.userId, this.page, this.limit, this.search)
            .then(httpResponse => {
                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                this.listOfEvaluations = new Array<NutritionEvaluation>();
                if (httpResponse.body && httpResponse.body.length) {
                    this.listOfEvaluations = httpResponse.body
                }
                this.listOfEvaluationsIsEmpty = !(this.listOfEvaluations && this.listOfEvaluations.length);
            })
            .catch(() => {
                this.listOfEvaluationsIsEmpty = true;
            });

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

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.patientId.currentValue !== undefined && changes.patientId.previousValue === undefined) {
            this.getAllNutritionEvaluations();
        }
    }
}
