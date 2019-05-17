import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PilotStudyService } from '../services/pilot-study.service';
import { PilotStudy } from '../models/pilot.study';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';

@Component({
  selector: 'pilot-study-table',
  templateUrl: './pilot-study-table.component.html',
  styleUrls: ['./pilot-study-table.component.scss']
})
export class PilotStudyTableComponent implements OnInit {
  pilotStudy_id: string;
  // MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  /* Controles de paginação */
  page: number = 1;
  limit: number = 5;
  length: number;

  list: Array<PilotStudy>;
  search: string;
  searchTime;

  cacheStudyIdRemove; string;

  listOfpilotsIsEmpty: boolean = false;

  constructor(
    private pilotStudyService: PilotStudyService,
    private toastService: ToastrService,
    private modalService: ModalService
  ) {
    this.list = new Array<PilotStudy>();
  }

  ngOnInit() {
    this.getAllPilotStudies();
    this.calcLengthEstudies();
  }

  getAllPilotStudies() {
    this.pilotStudyService.getAll(this.page, this.limit)
      .then(studies => {
        this.list = studies;
        if (this.list.length == 0) {
          this.listOfpilotsIsEmpty = true;
        } else {
          this.listOfpilotsIsEmpty = false;
        }
      })
      .catch(error => {
        console.log('Erro ao buscar pilot-studies: ', error);
      });
  }
  searchOnSubmit() {
    clearInterval(this.searchTime);
    this.searchTime = setTimeout(() => {
      this.pilotStudyService.getAll(this.page, this.limit, this.search)
        .then(studies => {
          this.list = studies;
          this.calcLengthEstudies();
        })
        .catch(error => {
          console.log('Erro ao buscar pilot-studies: ', error);
        });
    }, 200);
  }

  clickPagination(event) {
    this.pageEvent = event;
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getAllPilotStudies();
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

  removeStudy() {
    if (this.cacheStudyIdRemove) {
      this.pilotStudyService.remove(this.cacheStudyIdRemove)
        .then(() => {
          this.toastService.info('Estudo removido com sucesso!');
          this.getAllPilotStudies();
          this.calcLengthEstudies();
          this.closeModalConfirmation();
        })
        .catch(error => {
          this.toastService.error('Não foi possível remover estudo!');
        });
    } else {
      this.toastService.error('Não foi possível remover estudo!');
    }
  }

  calcLengthEstudies() {
    if (this.search && this.search != '') {
      this.pilotStudyService.getAll(undefined, undefined, this.search)
        .then(pilots => {
          this.length = pilots.length;
        })
        .catch();
    } else {
      this.pilotStudyService.getAll()
        .then(pilots => {
          this.length = pilots.length;
        })
        .catch();
    }
  }

  openModalhealthProfessionals(pilotStudy_id: string) {
    this.pilotStudy_id = pilotStudy_id;
    this.modalService.open('healthProfessionals');
  }

  openModalConfirmation(id: string) {
    this.cacheStudyIdRemove = id;
    this.modalService.open('modalConfirmation');
  }

  closeModalConfirmation() {
    this.cacheStudyIdRemove = '';
    this.modalService.close('modalConfirmation');
  }

}
