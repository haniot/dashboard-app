import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PilotStudy } from 'app/modules/pilot-study/models/pilot.study';
import { PilotStudyService } from 'app/modules/pilot-study/services/pilot-study.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';

@Component({
  selector: 'mypilotstudies',
  templateUrl: './mypilotstudies.component.html',
  styleUrls: ['./mypilotstudies.component.scss']
})
export class MypilotstudiesComponent implements OnInit {
  userId: string;
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

  cacheStudyIdRemove: string;

  constructor(
    private pilotStudyService: PilotStudyService,
    private modalService: ModalService,
    private activeRouter: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      this.getAllPilotStudies();
      this.getLengthPilotStudies();
    });
    this.getAllPilotStudies();
    this.getLengthPilotStudies();
  }

  getAllPilotStudies() {
    this.userId = atob(localStorage.getItem('user'));
    this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit, this.search)
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
      this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit, this.search)
        .then(studies => {
          this.list = studies;
          this.getLengthPilotStudies();
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
    if (this.userId) {
      this.pilotStudyService.getAllByUserId(this.userId, undefined, undefined, this.search)
        .then(studies => {
          this.length = studies.length;
        })
        .catch(error => {
          console.log('Erro ao buscar pilot-studies: ', error);
        });
    } else {
      this.pilotStudyService.getAll()
        .then(studies => {
          this.length = studies.length;
        })
        .catch(error => {
          console.log('Erro ao buscar pilot-studies: ', error);
        });
    }
  }

}
