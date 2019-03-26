import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PilotStudy } from 'app/modules/pilot-study/models/pilot.study';
import { PilotStudyService } from 'app/modules/pilot-study/services/pilot-study.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-pilotstudies',
  templateUrl: './list-pilotstudies.component.html',
  styleUrls: ['./list-pilotstudies.component.scss']
})
export class ListPilotstudiesComponent implements OnInit {

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
  ) { }

  ngOnInit() {
    this.getAllPilotStudies();
    this.getLengthPilotStudies();
  }

  getAllPilotStudies() {
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

  clickPagination(event) {
    this.pageEvent = event;
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getAllPilotStudies();
  }

  getLengthPilotStudies() {
    this.pilotStudyService.getAll()
      .then(studies => {
        this.length = studies.length;
      })
      .catch(error => {
        console.log('Erro ao buscar pilot-studies: ', error);
      });
  }

}
