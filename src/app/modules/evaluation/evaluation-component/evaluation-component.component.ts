import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'app/modules/patient/models/patient';
import { PatientService } from 'app/modules/patient/services/patient.service';

@Component({
  selector: 'evaluation-component',
  templateUrl: './evaluation-component.component.html',
  styleUrls: ['./evaluation-component.component.scss']
})
export class EvaluationComponentComponent implements OnInit, OnChanges {

  @Input() patientId: string;
  @Input() pilotStudyId: string;

  patient: Patient;

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) { }

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((params) => {
      this.patientId = params.get('patient_id');
      this.pilotStudyId = params.get('pilostudy_id');
      this.loadPatient();
    });
    this.loadPatient();
  }

  loadPatient(): void {
    if (this.pilotStudyId && this.patientId) {
      this.patientService.getById(this.pilotStudyId, this.patientId)
        .then(patient => this.patient = patient)
        .catch(errorResponse => {
          //console.log('Não foi possível buscar paciente!', errorResponse);
        });
    }
  }

  onBack() {
    this.router.navigate(['']);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadPatient();
  }

}
