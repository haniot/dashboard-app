import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material';

import { NutritionEvaluation } from '../models/nutrition-evaluation';
import { NutritionEvaluationService } from '../services/nutrition-evaluation.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';
import { EvaluationService } from '../services/evaluation.service';
import { Patient } from 'app/modules/patient/models/patient';

@Component({
  selector: 'nutrition-evaluation-table',
  templateUrl: './nutrition-evaluation-table.component.html',
  styleUrls: ['./nutrition-evaluation-table.component.scss']
})
export class NutritionEvaluationTableComponent implements OnInit, OnChanges {

  // MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  /* Controles de paginação */
  page: number = 1;
  limit: number = 5;
  length: number;

  listOfEvaluations: Array<NutritionEvaluation>;
  search: string;
  searchTime;

  @Input() patient: Patient;

  cacheIdEvaluationRemove: string;

  constructor(
    private evaluationService: EvaluationService,
    private nutritionService: NutritionEvaluationService,
    private toastService: ToastrService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.getAllNutritionEvaluations();
    this.calcLenghtNutritionEvaluations();
  }

  searchOnSubmit() {
    if (this.patient && this.patient.id) {
      clearInterval(this.searchTime);
      this.searchTime = setTimeout(() => {
        this.nutritionService.getAllByPatient(this.patient.id, this.page, this.limit, this.search)
          .then(nutritionsEvaluations => {
            this.listOfEvaluations = nutritionsEvaluations;
            this.calcLenghtNutritionEvaluations();
          })
          .catch(errorResponse => {
            console.log('Erro ao buscar avaliações do pacientes: ', errorResponse);
          });
      }, 200);
    }
  }

  getAllNutritionEvaluations() {
    if (this.patient && this.patient.id) {
      this.nutritionService.getAllByPatient(this.patient.id, this.page, this.limit, this.search)
        .then(nutritionsEvaluations => {
          this.listOfEvaluations = nutritionsEvaluations;
          this.calcLenghtNutritionEvaluations();
        })
        .catch(errorResponse => {
          console.log('Erro ao buscar avaliações do pacientes: ', errorResponse);
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
    if (this.patient && this.patient.id) {
      this.evaluationService.remove(this.patient.id, this.cacheIdEvaluationRemove)
        .then(() => {
          this.getAllNutritionEvaluations();
          this.calcLenghtNutritionEvaluations();
          this.toastService.info('Paciente removido com sucesso!');
          this.closeModalComfimation();
        })
        .catch(errorResponse => {
          this.toastService.error('Não foi possível remover usuário!');
          //console.log('Não foi possível remover paciente!', errorResponse);
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
    }
    else {
      return index + Math.pow(size, 1 - 1);
    }
  }

  calcLenghtNutritionEvaluations() {
    if (this.patient && this.patient.id) {
      this.nutritionService.getAllByPatient(this.patient.id, undefined, undefined, this.search)
        .then(nutritionEvaluations => {
          this.length = nutritionEvaluations.length;
        })
        .catch(errorResponse => {
          //console.log('Não foi possível buscar todos as avaliações do pacientes',errorResponse);
        });
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.patient.currentValue != undefined && changes.patient.previousValue == undefined) {
      this.getAllNutritionEvaluations();
      this.calcLenghtNutritionEvaluations();
    }
  }
}
