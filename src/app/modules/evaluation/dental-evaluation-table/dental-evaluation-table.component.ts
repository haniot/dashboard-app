import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';

import {PageEvent} from '@angular/material';
import {ToastrService} from 'ngx-toastr';

import {EvaluationService} from '../services/evaluation.service';
import {ModalService} from 'app/shared/shared-components/haniot-modal/service/modal.service';
import {OdontologicEvaluation} from '../models/odontologic-evaluation';
import {DentalEvaluationService} from '../services/dental-evaluation.service';
import {PilotStudy} from "../../pilot-study/models/pilot.study";

@Component({
    selector: 'dental-evaluation-table',
    templateUrl: './dental-evaluation-table.component.html',
    styleUrls: ['./dental-evaluation-table.component.scss']
})
export class DentalEvaluationTableComponent implements OnInit, OnChanges {

    // MatPaginator Inputs
    pageSizeOptions: number[] = [5, 10, 25, 100];

    // MatPaginator Output
    pageEvent: PageEvent;

    /* Controles de paginação */
    page: number = 1;
    limit: number = 5;
    length: number;

    listOfEvaluations: Array<OdontologicEvaluation>;
    search: string;
    searchTime;

    @Input() pilotStudy: PilotStudy;

    cacheIdEvaluationRemove: string;

    lastEvaluation: OdontologicEvaluation;

    generatingEvaluantion: boolean = false;

    listOfEvaluationsIsEmpty: boolean;

    constructor(
        private evaluationService: EvaluationService,
        private dentalEvaluation: DentalEvaluationService,
        private dentalService: DentalEvaluationService,
        private toastService: ToastrService,
        private modalService: ModalService
    ) {
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
                    .catch(errorResponse => {
                        console.log('Erro ao buscar avaliações do pacientes: ', errorResponse);
                    });
            }, 200);
        }
    }

    getAllNutritionEvaluations() {
        if (this.pilotStudy && this.pilotStudy.id) {
            this.dentalService.getAllByPilotstudy(this.pilotStudy.id, this.page, this.limit, this.search)
                .then(dentalsEvaluations => {
                    this.listOfEvaluations = dentalsEvaluations;
                    this.calcLenghtNutritionEvaluations();
                    this.lastEvaluation = dentalsEvaluations[0];
                    if (dentalsEvaluations.length) {
                        this.listOfEvaluationsIsEmpty = false;
                    } else {
                        this.listOfEvaluationsIsEmpty = true;
                    }
                })
                .catch(errorResponse => {
                    this.listOfEvaluationsIsEmpty = true;
                    // console.log('Erro ao buscar avaliações do pacientes: ', errorResponse);
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
        if (this.pilotStudy && this.pilotStudy.id) {
            this.dentalService.getAllByPilotstudy(this.pilotStudy.id, undefined, undefined, this.search)
                .then(nutritionEvaluations => {
                    this.length = nutritionEvaluations.length;
                })
                .catch(errorResponse => {
                    // console.log('Não foi possível buscar todos as avaliações do pacientes',errorResponse);
                });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.pilotStudy.currentValue != changes.pilotStudy.previousValue) {
            this.getAllNutritionEvaluations();
            this.calcLenghtNutritionEvaluations();
        }
    }

    generateEvaluation() {
        const user_id = atob(localStorage.getItem('user'));
        this.generatingEvaluantion = true;
        this.dentalService.generateNewEvaluation(this.pilotStudy, user_id)
            .then(odontologicalEvaluation => {
                this.lastEvaluation = odontologicalEvaluation;
                this.dentalEvaluationGenerated();
            })
            .catch(error => {
                    if (error.code === 404 && error.message === 'PILOTSTUDY NOT FOUND') {
                        this.toastService.error('Estudo não encontrado');
                    } else if (error.code === 404 && error.message === 'HEALTHPROFESSIONALID NOT FOUND') {
                        this.toastService.error('Profissional não encontrado');
                    } else if (error.code === 400 && error.message === 'PILOTSTUDY EMPTY') {
                        this.toastService.error('O estudo selecionado não possui pacientes!');
                    } else {
                        this.toastService.error('Não foi possível gerar avaliação!');
                    }
                    console.log('Não foi possível gerar avaliação!', error)
                }
            )
    }

    dentalEvaluationGenerated() {
        this.modalService.open('dentalEvaluation');
    }

    closeModalDentalEvaluation() {
        this.modalService.close('dentalEvaluation');
    }

}
