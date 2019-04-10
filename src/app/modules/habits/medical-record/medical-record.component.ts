import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MedicalRecord, ChronicDisease } from '../models/medical-record';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MedicalRecordService } from '../services/medical-record.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.scss']
})
export class MedicalRecordComponent implements OnInit {

  listMedical: Array<MedicalRecord>;
  medicalForm: FormGroup;
  @Input() patientId: string;
  index: number;

  constructor(
    private fb: FormBuilder,
    private medcalService: MedicalRecordService,
    private toastService: ToastrService
  ) {
    this.index = 0;
    this.listMedical = new Array<MedicalRecord>();
  }

  ngOnInit() {
    this.createMedicalFormInit();
  }

  /**Create form MedicalRecord */
  createMedicalFormInit() {
    this.medicalForm = this.fb.group({
      id: [''],
      created_at: [{ value: '', disabled: true }],
      chronic_diseases: this.fb.array([])   
    });
  }

  createMedicalForm(medicalRecord: MedicalRecord) {
    this.medicalForm = this.fb.group({
      id: [{value: medicalRecord.id}],
      created_at: [{ value: medicalRecord.created_at, disabled: true }],
      chronic_diseases: [{ value: medicalRecord.chronic_diseases, disabled: true }]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.patientId && changes.patientId.currentValue != changes.patientId.previousValue) {
      this.medcalService.getAll(this.patientId)
        .then(medicalRecords => {
          this.listMedical = medicalRecords;
          const mock: MedicalRecord = {
            "id": "5c9137f29293b51a067711c8",
            "created_at": "2018-11-19T14:40:00",
            "chronic_diseases": [
              {
                "type": "hipertension",
                "disease_history": "yes"
              }
            ]
          }
          this.createMedicalForm(mock);// FIXME: Remover
          //this.createMedicalForm(medicalRecords[0]);// FIXME: Aqui estou pegando apenas o primeiro registro 
        })
        .catch(errorResponse => {
          this.toastService.error('Não foi possível buscar histórico de doenças!');
          console.log('Não foi possível buscar histórico de doenças!', errorResponse);
        });
    }
  }

  prev() {
    if (this.index) {
      this.index--;
    }
    this.createMedicalForm(this.listMedical[this.index]);
  }
  next() {
    this.index++;
    this.createMedicalForm(this.listMedical[this.index]);
  }

}
