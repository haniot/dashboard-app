import {AfterViewChecked, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LoadingService} from "../../../shared/shared-components/loading-component/service/loading.service";
import {NutritionEvaluation} from "../../evaluation/models/nutrition-evaluation";
import {PageEvent} from "@angular/material";
import {EvaluationService} from "../../evaluation/services/evaluation.service";
import {NutritionEvaluationService} from "../../evaluation/services/nutrition-evaluation.service";
import {ToastrService} from "ngx-toastr";
import {ModalService} from "../../../shared/shared-components/haniot-modal/service/modal.service";

@Component({
    selector: 'app-myevaluations',
    templateUrl: './myevaluations.component.html',
    styleUrls: ['./myevaluations.component.scss']
})
export class MyevaluationsComponent implements OnInit, OnChanges, AfterViewChecked {

    // MatPaginator Inputs
    pageSizeOptions: number[] = [10, 25, 100];

    // MatPaginator Output
    pageEvent: PageEvent;

    /* Controles de paginação */
    page: number = 1;
    limit: number = 10;
    length: number;

    listOfEvaluations: Array<NutritionEvaluation>;
    search: string;
    searchTime;

    cacheIdEvaluationRemove: string;

    listOfEvaluationsIsEmpty: boolean = false;

    /* id utilizado para deletar uma avaliação*/
    patientId: string;

    // id do profissional logado
    userId: string;

    constructor(
        private evaluationService: EvaluationService,
        private nutritionService: NutritionEvaluationService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private loadingService: LoadingService
    ) {
        this.listOfEvaluations = new Array<NutritionEvaluation>();
    }

    ngOnInit() {
        this.getAllNutritionEvaluations();
        this.calcLenghtNutritionEvaluations();
    }

    loadUserId() {
        this.userId = atob(localStorage.getItem('user'));
    }

    searchOnSubmit() {
        if (!this.userId) {
            this.loadUserId();
        }
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.nutritionService.getAllByHealthprofessional(this.userId, this.page, this.limit, this.search)
                .then(nutritionsEvaluations => {
                    this.listOfEvaluations = nutritionsEvaluations;
                    this.calcLenghtNutritionEvaluations();
                })
                .catch(errorResponse => {
                    console.log('Erro ao buscar avaliações do pacientes: ', errorResponse);
                });
        }, 200);

    }

    getAllNutritionEvaluations() {
        if (!this.userId) {
            this.loadUserId();
        }
        this.nutritionService.getAllByHealthprofessional(this.userId, this.page, this.limit, this.search)
            .then(nutritionsEvaluations => {
                this.listOfEvaluations = nutritionsEvaluations;
                this.calcLenghtNutritionEvaluations();
                if (nutritionsEvaluations && nutritionsEvaluations.length) {
                    this.listOfEvaluationsIsEmpty = false;
                } else {
                    this.listOfEvaluationsIsEmpty = true;
                }
            })
            .catch(errorResponse => {
                this.listOfEvaluationsIsEmpty = true;
                console.log('Erro ao buscar avaliações do pacientes: ', errorResponse);
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
                    this.calcLenghtNutritionEvaluations();
                    this.toastService.info('Paciente removido com sucesso!');
                    this.closeModalComfimation();
                })
                .catch(errorResponse => {
                    this.toastService.error('Não foi possível remover usuário!');
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

    calcLenghtNutritionEvaluations() {
        if (!this.userId) {
            this.loadUserId();
        }
        this.nutritionService.getAllByHealthprofessional(this.userId, undefined, undefined, this.search)
            .then(nutritionEvaluations => {
                this.length = nutritionEvaluations.length;
            })
            .catch(errorResponse => {
                // console.log('Não foi possível buscar todos as avaliações do pacientes',errorResponse);
            });

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.patientId.currentValue != undefined && changes.patientId.previousValue == undefined) {
            this.getAllNutritionEvaluations();
            this.calcLenghtNutritionEvaluations();
        }
    }

    ngAfterViewChecked() {
        this.loadingService.close();
    }
}
