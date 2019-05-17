import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/shared-components/loading-component/service/loading.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-evaluation-list',
  templateUrl: './evaluation-list.component.html',
  styleUrls: ['./evaluation-list.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class EvaluationListComponent implements OnInit, AfterViewChecked {

  pilotForm: FormGroup;
  patientForm: FormGroup;

  pilotstudy_id: string;
  patient_id: string;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.createForms();
  }

  createForms() {
    this.pilotForm = this.formBuilder.group({
      pilotstudyId: ['', Validators.required]
    });
    this.patientForm = this.formBuilder.group({
      patientId: ['', Validators.required]
    });
  }

  selectStudy(pilotstudy_id) {
    this.patientForm.reset();
    this.pilotForm.get('pilotstudyId').setValue(pilotstudy_id);
    this.pilotstudy_id = pilotstudy_id;
  }

  selectPatient(patient_id) {
    this.patientForm.get('patientId').setValue(patient_id);
    this.patient_id = patient_id;
  }

  ngAfterViewChecked() {
    this.loadingService.close();
  }
}
