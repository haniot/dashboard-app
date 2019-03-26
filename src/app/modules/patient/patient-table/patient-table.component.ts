import { Component, OnInit, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { PilotStudyService } from 'app/modules/pilot-study/services/pilot-study.service';

@Component({
  selector: 'patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss']
})
export class PatientTableComponent implements OnInit {
  // MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  /* Controles de paginação */
  page: number = 1;
  limit: number = 5;
  length: number;

  listOfPatients: Array<Patient>;
  search: string;
  searchTime;

  @Input() pilotStudyId;

  constructor(
    private patientService: PatientService,
    private pilotstudyService: PilotStudyService,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    this.getAllPacients();
    this.calcLengthPatients();
  }

  searchOnSubmit() {
    clearInterval(this.searchTime);
    this.searchTime = setTimeout(() => {
      this.patientService.getAll(this.pilotStudyId, this.page, this.limit)
        .then(patients => {
          const pacientsReturned = patients.filter((patient) => {
            return patient.first_name.search(this.search) != -1 || patient.last_name.search(this.search) != -1;
          });
          this.listOfPatients = pacientsReturned;
        })
        .catch(error => {
          console.log('Erro ao buscar pacientes: ', error);
        });
    }, 200);
  }

  getAllPacients() {
    this.patientService.getAll(this.pilotStudyId, this.page, this.limit)
      .then(patients => {
        this.listOfPatients = patients;
      })
      .catch(error => {
        console.log('Erro ao buscar pacientes: ', error);
      });
  }

  clickPagination(event) {
    this.pageEvent = event;
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getAllPacients();
  }

  removePatient(pilotstudy_id: string, patientId: string) {
    this.patientService.remove(pilotstudy_id, patientId)
      .then(() => {
        this.getAllPacients();
      })
      .catch(error => {
        console.log('Não foi possível remover paciente!', error);
      });
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

  calcLengthPatients() {
    this.patientService.getAll(this.pilotStudyId)
      .then(patients => {
        this.length = patients.length;
      })
      .catch();
  }

}
