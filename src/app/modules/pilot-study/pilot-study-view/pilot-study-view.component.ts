import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HealthProfessional } from 'app/modules/admin/models/users';
import { PilotStudyService } from '../services/pilot-study.service';
import { HealthProfessionalService } from 'app/modules/admin/services/health-professional.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/security/auth/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pilot-study-view',
  templateUrl: './pilot-study-view.component.html',
  styleUrls: ['./pilot-study-view.component.scss']
})
export class PilotStudyViewComponent implements OnInit {

  pilotStudyForm: FormGroup;
  professionalsForm: FormGroup;

  listProf: Array<HealthProfessional> = [];
  professinalsNotAssociated: Array<HealthProfessional> = [];
  professinalsAssociated: Array<HealthProfessional> = [];

  multiSelectProfissionais: Array<any> = new Array<any>();
  multiSelectProfissionaisSelected: Array<any> = new Array<any>();
  color = 'accent';
  checked = false;
  disabled = false;

  @Input() pilotStudyId: string;
  healthprofessionalId: string;

  option1 = {
    xAxis: {
      type: 'category',
      data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }]
  };

  option2 = {
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['1', '2', '3', '4', '5']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['1', '2', '3', '4', '5', '6', '7']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '',
        type: 'line',
        stack: '总量',
        areaStyle: { normal: {} },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '',
        type: 'line',
        stack: '总量',
        areaStyle: { normal: {} },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '',
        type: 'line',
        stack: '总量',
        areaStyle: { normal: {} },
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: '',
        type: 'line',
        stack: '总量',
        areaStyle: { normal: {} },
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: '',
        type: 'line',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        areaStyle: { normal: {} },
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  };

  option3 = {
    xAxis: {
      type: 'category',
      data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [200, 170, 150, 199, 186, 188, 183],
      type: 'line'
    }]
  };

  option4 = {
    xAxis: {},
    yAxis: {},
    series: [{
      symbolSize: 20,
      data: [
        [10.0, 8.04],
        [8.0, 6.95],
        [13.0, 7.58],
        [9.0, 8.81],
        [11.0, 8.33],
        [14.0, 9.96],
        [6.0, 7.24],
        [4.0, 4.26],
        [12.0, 10.84],
        [7.0, 4.82],
        [5.0, 5.68]
      ],
      type: 'scatter'
    }]
  };

  constructor(
    private fb: FormBuilder,
    private pilotStudyService: PilotStudyService,
    private toastService: ToastrService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private _location: Location,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((params) => {
      this.pilotStudyId = params.get('pilotStudyId');
      if (this.pilotStudyId) {
        this.createForm();
        this.getPilotStudy();
      }
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
          this.toastService.error('Não foi possível buscar estudo piloto!');
          //console.error('Não foi possível buscar estudo piloto!', error);
        })
    }
  }

  createForm() {
    if (this.pilotStudyId) {// Caso seja a tela de edição
      this.pilotStudyForm = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        location: ['', Validators.required],
        start: ['', Validators.required],
        end: ['', Validators.required],
        health_professionals_id: ['', Validators.required],
        is_active: [true, Validators.required],
      });
    }
    else {//Caso seja a tela de inserção
      this.pilotStudyForm = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        location: [''],
        start: ['', Validators.required],
        end: [{ value: '', disabled: true }, Validators.required],
        health_professionals_id: ['', Validators.required],
        is_active: [true, Validators.required],
      });
    }
    this.professionalsForm = this.fb.group({
      health_professionals_id_add: ['', Validators.required],
    });

    this.pilotStudyForm.get('start').valueChanges.subscribe(val => {
      this.pilotStudyForm.get('end').enable();
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
        .then(() => {
          this.toastService.info('Estudo Piloto atualizado!');
        })
        .catch(error => {
          this.toastService.error('Não foi possível atualizar estudo piloto!');
          console.log('Não foi possível atualizar estudo!', error);
        });
    }
  }

  ngOnChanges() {//Caso o componente recba o id ele carrega o form com o estudo piloto correspondente.
    this.createForm();
    this.getPilotStudy();
  }

  onBack() {
    this._location.back();
  }
}
