import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { HealthProfessional } from 'app/shared/shared-models/users.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PilotStudyService } from '../services/pilot-study.service';
import { HealthProfessionalService } from 'app/modules/admin/services/health-professional.service';

@Component({
  selector: 'pilot-study-form',
  templateUrl: './pilot-study-form.component.html',
  styleUrls: ['./pilot-study-form.component.scss']
})
export class PilotStudyFormComponent implements OnInit, OnChanges {

  pilotStudyForm: FormGroup;
  listProf: Array<HealthProfessional>;
  multiSelectProfissionais: Array<any> = new Array<any>();
  multiSelectProfissionaisSelected: Array<any> = new Array<any>();
  color = 'accent';
  checked = false;
  disabled = false;

  @Input() pilotStudyId: string; 

  constructor(
    private fb: FormBuilder,
    private pilotStudyService: PilotStudyService,
    private healthService: HealthProfessionalService,
    private toastService: ToastrService,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {
    this.getListProfissonals();
  }

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((params) => {
      this.pilotStudyId = params.get('pilotStudyId');
      this.createForm();
      this.getPilotStudy();
    });
    this.createForm();
    this.getPilotStudy();
  }

  getPilotStudy() {
    if (this.pilotStudyId) {
      this.pilotStudyService.getById(this.pilotStudyId)
        .then(res => {
          this.pilotStudyForm.setValue(res);
        }).catch(error => {
          console.error('Não foi possível buscar estudo piloto!',error);
        })
    }
  }

  createForm() {
    this.pilotStudyForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      health_professionals_id: ['', Validators.required],
      is_active: [true, Validators.required]
    });
  }

  onSubimt() {
    const form = this.pilotStudyForm.getRawValue();
    if (!this.pilotStudyId) {
      this.pilotStudyService.create(form)
        .then(pilotStudy => {
          this.pilotStudyForm.reset();
          this.toastService.info('Estudo Piloto criado!');
        })
        .catch(error => {
          this.toastService.error('Não foi possível criar estudo piloto!');
        });
    } else {
      this.pilotStudyService.update(form)
        .then(pilotStudy => {
          this.toastService.info('Estudo Piloto atualizado!');
        })
        .catch(error => {
          this.toastService.error('Não foi possível atualizar estudo piloto!');
        });
    }
  }

  ngOnChanges() {//Caso o componente recba o id ele carrega o form com o estudo piloto correspondente.
    this.createForm();
    this.getPilotStudy();
  }

  onBack() {
    this.router.navigate(['pilotstudies']);
  }

  getListProfissonals() {
    this.healthService.getAll()
      .then(healthProfessionals => {
        this.listProf = healthProfessionals;
      })
      .catch(error => {
        console.log('Erro ao carregar lista de profisionais!', error);
      });
  }

}
