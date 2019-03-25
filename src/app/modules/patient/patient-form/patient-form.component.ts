import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { Gender } from '../models/patient';
import { Router, ActivatedRoute } from '@angular/router';
import { PilotStudy } from 'app/modules/pilot-study/models/pilot.study';
import { PilotStudyService } from 'app/modules/pilot-study/services/pilot-study.service';

@Component({
  selector: 'patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit, OnChanges {
  patientForm: FormGroup;
  optionsGender: Array<string> = Object.keys(Gender);
  listPilots: Array<PilotStudy>;

  @Input() patientId: string;
  @Input() pilotStudyId: string;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private pilotStudiesService: PilotStudyService,
    private toastService: ToastrService,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((params) => {
      this.patientId = params.get('patientId');
      this.pilotStudyId = params.get('pilotstudy_id');
      this.createForm();
      this.loadPatientInForm();
      this.getAllPilotStudies();
    });
    this.createForm();
    this.loadPatientInForm();
    this.getAllPilotStudies();
  }

  createForm() {
    this.patientForm = this.fb.group({
      id: [''],
      pilotstudy_id: [this.pilotStudyId, Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      gender: ['', Validators.required],
      birth_date: ['', Validators.required]
    });
  }

  loadPatientInForm() {
    if (this.patientId) {
      this.patientService.getById(this.pilotStudyId, this.patientId)
        .then(patient => {
          this.patientForm.setValue(patient);
        }).catch(error => {
          console.error('Não foi possível buscar paciente!', error);
        })
    }
  }

  ngOnChanges() {//Caso o componente recba o id ele carrega o form com o paciente correspondente.
    this.createForm();
    this.loadPatientInForm();
  }

  onSubimt() {
    const form = this.patientForm.getRawValue();
    form.birth_date = new Date(form.birth_date).toISOString().split('T')[0];
    console.log(form);
    if (!this.patientId) {
      this.patientService.create(form.pilotstudy_id, form)
        .then(patient => {
          this.patientForm.reset();
          this.toastService.info('Paciente criado!');
        })
        .catch(error => {
          this.toastService.error('Não foi possível criar paciente!');
        });
    } else {
      this.patientService.update(this.pilotStudyId, form)
        .then(patient => {
          this.toastService.info('Paciente atualizado!');
        })
        .catch(error => {
          this.toastService.error('Não foi possível atualizar paciente!');
        });
    }
  }

  onBack() {
    this.router.navigate(['patients', this.pilotStudyId]);
  }

  getAllPilotStudies() {
    this.pilotStudiesService.getAll()
      .then(pilots => {
        this.listPilots = pilots;
      })
      .catch(error => {
        console.log('Não foi possivel buscar estudos pilotos!', error);
      });
  }
}
