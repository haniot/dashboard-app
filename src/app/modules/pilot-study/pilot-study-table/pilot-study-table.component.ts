import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PilotStudyService } from '../services/pilot-study.service';
import { PilotStudy } from '../models/pilot.study';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'pilot-study-table',
  templateUrl: './pilot-study-table.component.html',
  styleUrls: ['./pilot-study-table.component.scss']
})
export class PilotStudyTableComponent implements OnInit {

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

  constructor(
    private pilotStudyService: PilotStudyService,
    private toastService: ToastrService
    ) { }

  ngOnInit() {
    this.getAllPilotStudies();
    this.calcLengthAdministrators();
  }

  getAllPilotStudies(){
    this.pilotStudyService.getAll(this.page, this.limit)
        .then(studies => {
          this.list = studies;
        })
        .catch(error => {
          console.log('Erro ao buscar pilot-studies: ', error);
        });
  }
  searchOnSubmit() {
    clearInterval(this.searchTime);
    this.searchTime = setTimeout(() => {
      this.pilotStudyService.getAll()
        .then(studies => {
          this.list = studies.filter((study) => {
            return study.name.search(this.search) != -1;
          });
        })
        .catch(error => {
          console.log('Erro ao buscar pilot-studies: ', error);
        });
    }, 200);
  }

  clickPagination(event){  
    this.pageEvent = event;
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getAllPilotStudies();
  }

  getIndex(index: number): number {
    if(this.search){
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

  removeStudy(id: string){
    this.pilotStudyService.remove(id)
      .then(() => {
        this.toastService.info('Estudo removido com sucesso!');
        this.getAllPilotStudies();
      })
      .catch(error => {
        this.toastService.error('Não foi possível remover estudo!');
      });
  }

  calcLengthAdministrators(){
    this.pilotStudyService.getAll()
      .then( pilots => {
        this.length = pilots.length;
      })
      .catch();
  }

}
