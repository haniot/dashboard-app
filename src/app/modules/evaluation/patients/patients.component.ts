import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Patient } from 'app/modules/patient/models/patient';
import { PatientService } from 'app/modules/patient/services/patient.service';
import { PilotStudyService } from 'app/modules/pilot-study/services/pilot-study.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';

@Component({
  selector: 'patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit, OnChanges {

  listClass: Array<string>;
  @Output() selected = new EventEmitter();
  // MatPaginator Inputs
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  /* Controles de paginação */
  page: number = 1;
  limit: number = 5;
  length: number;

  listOfPatientsIsEmpty: boolean = false;

  listOfPatients = new Array<Patient>();
  search: string;
  searchTime;

  @Input() pilotStudyId;

  cacheIdPatientRemove: string;

  constructor(
    private patientService: PatientService,
    private pilotstudyService: PilotStudyService,
    private toastService: ToastrService,
    private modalService: ModalService
  ) {
    this.listClass = new Array<string>();
  }

  ngOnInit() {

  }

  searchOnSubmit() {
    clearInterval(this.searchTime);
    this.searchTime = setTimeout(() => {
      this.patientService.getAll(this.pilotStudyId, this.page, this.limit, this.search)
        .then(patients => {
          this.listOfPatients = patients;
          this.calcLengthPatients();
        })
        .catch(errorResponse => {
          console.log('Erro ao buscar pacientes: ', errorResponse);
        });
    }, 200);
  }

  getAllPacients() {
    this.patientService.getAll(this.pilotStudyId, this.page, this.limit, this.search)
      .then(patients => {
        this.listOfPatients = patients;
        this.calcLengthPatients();
        if (patients.length == 0) {
          this.listOfPatientsIsEmpty = true;
        } else {
          this.listOfPatientsIsEmpty = false;
        }
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

  openModalConfirmation(pilotstudy_id: string, patientId: string) {
    this.cacheIdPatientRemove = patientId;
    this.pilotStudyId = pilotstudy_id;
    this.modalService.open('modalConfirmation');
  }

  closeModalComfimation() {
    this.cacheIdPatientRemove = '';
    this.modalService.close('modalConfirmation');
  }

  removePatient() {
    this.patientService.remove(this.pilotStudyId, this.cacheIdPatientRemove)
      .then(() => {
        this.getAllPacients();
        this.calcLengthPatients();
        this.toastService.info('Paciente removido com sucesso!');
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
    this.patientService.getAll(this.pilotStudyId, undefined, undefined, this.search)
      .then(patients => {
        this.length = patients.length;
      })
      .catch(errorResponse => {
        //console.log('Não foi possível buscar todos os pacientes',errorResponse);
      });
  }

  selectPatient(patient_id: string) {
    this.listClass = new Array<string>();
    let local_index = 0;
    this.selected.emit(patient_id);
    this.listOfPatients.forEach((patient, index) => {
      if (patient.id == patient_id) {
        local_index = index;
        return;
      }
    });
    this.listClass[local_index] = 'tr-selected';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pilotStudyId.currentValue != '' && changes.pilotStudyId.currentValue != changes.pilotStudyId.previousValue) {
      this.getAllPacients();
      this.calcLengthPatients();
    }
  }
}
