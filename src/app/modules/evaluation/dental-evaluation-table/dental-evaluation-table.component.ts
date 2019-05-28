import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PageEvent } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';

import { EvaluationService } from '../services/evaluation.service';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';
import { DentalEvaluation } from '../models/dental-evaluation';
import { DentalEvaluationService } from '../services/dental-evaluation.service';
@Component({
  selector: 'dental-evaluation-table',
  templateUrl: './dental-evaluation-table.component.html',
  styleUrls: ['./dental-evaluation-table.component.scss']
})
export class DentalEvaluationTableComponent implements OnInit {

  // MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  /* Controles de paginação */
  page: number = 1;
  limit: number = 5;
  length: number;

  listOfEvaluations: Array<DentalEvaluation>;
  search: string;
  searchTime;

  @Input() pilotStudyId: string;

  cacheIdEvaluationRemove: string;

  lastEvaluation: DentalEvaluation;

  generatingEvaluantion: boolean = false;

  constructor(
    private evaluationService: EvaluationService,
    private dentalService: DentalEvaluationService,
    private toastService: ToastrService,
    private modalService: ModalService,
    private _http: HttpClient
  ) { }

  ngOnInit() {
    this.getAllNutritionEvaluations();
    this.calcLenghtNutritionEvaluations();
  }

  searchOnSubmit() {
    if (this.pilotStudyId) {
      clearInterval(this.searchTime);
      this.searchTime = setTimeout(() => {
        this.dentalService.getAllByPilotstudy(this.pilotStudyId, this.page, this.limit, this.search)
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
    if (this.pilotStudyId) {
      this.dentalService.getAllByPilotstudy(this.pilotStudyId, this.page, this.limit, this.search)
        .then(dentalsEvaluations => {
          this.listOfEvaluations = dentalsEvaluations;
          this.calcLenghtNutritionEvaluations();
          this.lastEvaluation = dentalsEvaluations[0];
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
    if (this.pilotStudyId) {
      this.evaluationService.remove(this.pilotStudyId, this.cacheIdEvaluationRemove)
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
    if (this.pilotStudyId) {
      this.dentalService.getAllByPilotstudy(this.pilotStudyId, undefined, undefined, this.search)
        .then(nutritionEvaluations => {
          this.length = nutritionEvaluations.length;
        })
        .catch(errorResponse => {
          //console.log('Não foi possível buscar todos as avaliações do pacientes',errorResponse);
        });
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.pilotStudyId.currentValue != undefined && changes.pilotStudyId.previousValue == undefined) {
      this.getAllNutritionEvaluations();
      this.calcLenghtNutritionEvaluations();
    }
  }

  generateEvaluation() {
    this.generatingEvaluantion = true;
    setTimeout(() => {
      this.generatingEvaluantion = false;
      this.dentalEvaluationGenerated();
    }, 3000);
  }

  dentalEvaluationGenerated() {
    this.modalService.open('dentalEvaluation');
  }

  closeModalDentalEvaluation() {
    this.modalService.close('dentalEvaluation');
  }

  download(link: string) {
    this.dentalService
      .getAndDownloadFile(link)
      .toPromise()
      .then(data => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const fileName = 'YourFileName.csv';
        saveAs(blob, fileName);
        this.toastService.info('Arquivo baixado com sucesso!');
      })
      .catch(err => {
        console.log('Erro durante o download do arquivo!', err);
        this.toastService.error('Arquivo baixado com sucesso!');
      });
  }
}
