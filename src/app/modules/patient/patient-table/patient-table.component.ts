import { Component, OnInit, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { PilotStudyService } from 'app/modules/pilot-study/services/pilot-study.service';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';

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
  
  cacheIdPatientRemove: string;

  constructor(
    private patientService: PatientService,
    private pilotstudyService: PilotStudyService,
    private toastService: ToastrService,
    private modalService: ModalService
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
        .catch(errorResponse => {
          console.log('Erro ao buscar pacientes: ', errorResponse);
        });
    }, 200);
  }

  getAllPacients() {
    this.patientService.getAll(this.pilotStudyId, this.page, this.limit)
      .then(patients => {
        this.listOfPatients = patients;
      })
      .catch(errorResponse => {
        console.log('Erro ao buscar pacientes: ', errorResponse);
      });
  }

  clickPagination(event) {
    this.pageEvent = event;
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getAllPacients();
  }

  openModalConfirmation(pilotstudy_id: string, patientId: string){
    this.cacheIdPatientRemove = patientId;
    this.pilotStudyId = pilotstudy_id;
    this.modalService.open('modalConfirmation');
  }

  closeModalComfimation(){
    this.cacheIdPatientRemove = '';
    this.modalService.close('modalConfirmation');
  }

  removePatient() {
    this.patientService.remove(this.pilotStudyId,this.cacheIdPatientRemove)
      .then(() => {
        this.getAllPacients();
        this.calcLengthPatients();
        this.toastService.info('Paciente removido com suecesso!');
        this.closeModalComfimation();
      })
      .catch(errorResponse => {
        this.toastService.error('Não foi possível remover usuário!');
        //console.log('Não foi possível remover paciente!', errorResponse);
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
      .catch(errorResponse => {
        //console.log('Não foi possível buscar todos os pacientes',errorResponse);
      });
  }

}
