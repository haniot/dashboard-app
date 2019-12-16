import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core'
import { ToastrService } from 'ngx-toastr'

import { Patient } from '../../patient/models/patient'
import { PatientService } from '../../patient/services/patient.service'
import { PageEvent } from '@angular/material'
import { NutritionEvaluation } from '../models/nutrition-evaluation'
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { NutritionEvaluationService } from '../services/nutrition.evaluation.service'
import { DateRange } from '../../pilot.study/models/range-date'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'evaluation-component',
    templateUrl: './evaluation.component.html',
    styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponentComponent implements OnInit, OnChanges, OnDestroy {
    @Input() patientId: string;
    patient: Patient;
    private subscriptions: Array<ISubscription>;
    /* Paging Settings */
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    listOfEvaluations: Array<NutritionEvaluation>;
    search: DateRange;
    maxDate: Date;
    searchTime;
    cacheIdEvaluationRemove: string;
    listOfEvaluationsIsEmpty: boolean;

    constructor(
        private patientService: PatientService,
        private paginatorService: PaginatorIntlService,
        private modalService: ModalService,
        private nutritionService: NutritionEvaluationService,
        private activeRouter: ActivatedRoute,
        private location: Location,
        private toastService: ToastrService,
        private translateService: TranslateService
    ) {
        this.patient = new Patient('');
        this.search = new DateRange();
        this.maxDate = new Date();
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.listOfEvaluationsIsEmpty = false;
        this.listOfEvaluations = new Array<NutritionEvaluation>();
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patient_id');
            this.loadPatient();
        }));
    }

    getAllNutritionEvaluations() {
        if (this.patientId) {
            this.listOfEvaluations = new Array<NutritionEvaluation>();
            this.nutritionService.getAllByPatientWithFilters(this.patientId, this.page, this.limit, this.search)
                .then(httpResponse => {
                    this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                    if (httpResponse.body && httpResponse.body.length) {
                        const nutritionsEvaluations = httpResponse.body
                        this.listOfEvaluations = nutritionsEvaluations;
                    }
                    this.listOfEvaluationsIsEmpty = !(this.listOfEvaluations && this.listOfEvaluations.length);
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

    loadPatient(): void {
        if (this.patientId) {
            this.patientService.getById(this.patientId)
                .then(patient => {
                    this.patient = patient;
                    this.getAllNutritionEvaluations();
                })
                .catch(() => {
                    this.listOfEvaluationsIsEmpty = true;
                });
        }
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
        if (this.search && this.search.begin && this.search.end) {
            return null;
        }
        return this.paginatorService.getIndex(this.pageEvent, this.limit, index);
    }

    trackById(index, item) {
        return item.id;
    }

    onBack(): void {
        this.location.back();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.loadPatient();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
