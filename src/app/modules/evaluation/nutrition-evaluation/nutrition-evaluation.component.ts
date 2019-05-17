import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

import { NutritionEvaluationService } from '../services/nutrition-evaluation.service';
import { NutritionEvaluation, NutritionalCouncil } from '../models/nutrition-evaluation';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';
import { EvaluationStatus } from '../models/evaluation';
import { GraphService } from 'app/shared/shared-services/graph.service';
import { PatientService } from 'app/modules/patient/services/patient.service';
import { Patient } from 'app/modules/patient/models/patient';

@Component({
  selector: 'app-nutrition-evaluation',
  templateUrl: './nutrition-evaluation.component.html',
  styleUrls: ['./nutrition-evaluation.component.scss']
})
export class NutritionEvaluationComponent implements OnInit {

  listStatus = Object.keys(EvaluationStatus);

  nutritionalEvaluation: NutritionEvaluation;

  nutritionEvaluationId: string;

  option = {
    title: {
      text: 'Medições coletas',
    },
    tooltip: {
      formatter: "Frequência: {c} bpm <br> Data: {b}",
      trigger: 'axis'
    },
    xAxis: {
      data: []
    },
    yAxis: {
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value} bpm'
      }
    },
    dataZoom: [
      {
        type: 'slider'
      }
    ],
    series: [
      {
        type: 'line',
        data: []
      }
    ]
  };

  patientId: string;
  patient: Patient;

  sharedEmail: boolean;
  sharedSms: boolean;
  sharedWhatsapp: boolean;

  ncSuggested: NutritionalCouncil;
  ncDefinitive: NutritionalCouncil;

  finalCounseling: string = "";

  allCounselings: boolean = false;

  listChecksBmiWhr: Array<boolean>;
  listChecksGlycemia: Array<boolean>;
  listChecksBloodPressure: Array<boolean>;

  finalingEvaluantion: boolean;

  constructor(
    private nutritionService: NutritionEvaluationService,
    private activeRouter: ActivatedRoute,
    private datePipe: DatePipe,
    private modalService: ModalService,
    private location: Location,
    private graphService: GraphService,
    private patientService: PatientService,
    private toastService: ToastrService,
    private nutritionEvaluationService: NutritionEvaluationService
  ) {
    this.nutritionalEvaluation = new NutritionEvaluation();
    this.listChecksBmiWhr = new Array<boolean>();
    this.listChecksGlycemia = new Array<boolean>();
    this.listChecksBloodPressure = new Array<boolean>();
  }

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((params) => {
      this.patientId = params.get('patient_id');
      this.nutritionEvaluationId = params.get('nutritionevaluation_id');
      this.getNutritionEvaluation();
    });
    this.getNutritionEvaluation();
  }

  getNutritionEvaluation() {
    this.nutritionService.getById(this.patientId, this.nutritionEvaluationId)
      .then(nutritionEvaluation => {
        this.nutritionalEvaluation = nutritionEvaluation;
        this.formatCounseling()
        this.loadGraph(nutritionEvaluation.heart_rate.dataset);
      })
      .catch(erroResponse => {
        this.toastService.error("Não foi possível carregar avaliação nutricional!");
        //console.log('Não foi possível carregar avaliação!', errorResponse);
      });

  }

  formatCounseling() {
    this.finalCounseling = "";

    this.ncSuggested = this.nutritionalEvaluation.counselings.suggested;
    this.ncDefinitive = this.nutritionalEvaluation.counselings.definitive;


    this.ncSuggested.bmi_whr.forEach((counseling, index) => {
      if (index == this.ncSuggested.bmi_whr.length - 1) {
        this.finalCounseling += '\t' + (index + 1) + ". " + counseling;
      } else {
        this.finalCounseling += '\t' + (index + 1) + ". " + counseling + '\n\n';
      }
      this.listChecksBmiWhr.push(false);
    });

    this.ncSuggested.glycemia.forEach((counseling, index) => {
      if (index == this.ncSuggested.glycemia.length - 1) {
        this.finalCounseling += '\t' + (index + 1) + ". " + counseling;
      } else {
        this.finalCounseling += '\t' + (index + 1) + ". " + counseling + '\n\n';
      }
      this.listChecksGlycemia.push(false);
    });

    this.ncSuggested.blood_pressure.forEach((counseling, index) => {
      if (index == this.ncSuggested.blood_pressure.length - 1) {
        this.finalCounseling += '\t' + (index + 1) + ". " + counseling;
      } else {
        this.finalCounseling += '\t' + (index + 1) + ". " + counseling + '\n\n';
      }
      this.listChecksBloodPressure.push(false);
    });

  }

  loadGraph(dataset: Array<any>) {

    //console.log(dataset);
    if (dataset && dataset.length > 0) {
      //Limpando o grafico
      this.option.xAxis.data = [];
      this.option.series[0].data = [];

      dataset.forEach((date: { value: number, timestamp: string }) => {

        this.option.xAxis.data.push(this.datePipe.transform(date.timestamp, "shortDate"));

        this.option.series[0].data.push(date.value);

      });

      this.graphService.refreshGraph();
    }

  }




  shareEvaluationOpen() {
    this.patientService.getById(this.patientId)
      .then(patient => {
        this.patient = patient;
        this.modalService.open('modalShareEvaluation');
      })
      .catch(errorResponse => {
        this.toastService.error('Não foi possível identificar o paciente!')
        console.log('Não foi possível buscar paciente!', errorResponse);
      });

  }

  closeModalShareEvaluation() {
    this.modalService.close('modalShareEvaluation');
  }

  finalizeEvaluation() {
    this.finalingEvaluantion = true;
    let counselingBwr: Array<number> = new Array<number>();
    this.listChecksBmiWhr.forEach((element, index) => {
      if (element) {
        counselingBwr.push(index);
      }
    });

    let counselingGlycemia: Array<number> = new Array<number>();
    this.listChecksGlycemia.forEach((element, index) => {
      if (element) {
        counselingGlycemia.push(index);
      }
    });

    let counselingBlood: Array<number> = new Array<number>();
    this.listChecksBloodPressure.forEach((element, index) => {
      if (element) {
        counselingBlood.push(index);
      }
    });

    const nutritionalCouncil: NutritionalCouncil = new NutritionalCouncil();

    counselingBwr.forEach(element => {
      nutritionalCouncil.bmi_whr.push(this.ncSuggested.bmi_whr[element])
    });
    counselingGlycemia.forEach(element => {
      nutritionalCouncil.glycemia.push(this.ncSuggested.glycemia[element])
    });
    counselingBlood.forEach(element => {
      nutritionalCouncil.blood_pressure.push(this.ncSuggested.blood_pressure[element])
    });

    const copyNutritionalEvaluation = Object.assign({}, this.nutritionalEvaluation);

    copyNutritionalEvaluation.counselings.definitive = nutritionalCouncil;
    copyNutritionalEvaluation.status = EvaluationStatus.complete;


    this.nutritionEvaluationService.update(this.nutritionalEvaluation.patient_id, copyNutritionalEvaluation)
      .then(nutritionEvaluation => {
        this.nutritionalEvaluation = Object.assign({}, copyNutritionalEvaluation);
        this.toastService.info("Avaliação atualizada com sucesso!");
        this.finalingEvaluantion = false;
      })
      .catch(errorResponse => {
        this.finalingEvaluantion = false
        this.getNutritionEvaluation();
        this.toastService.error("Não foi possível atualizar avaliação!");
        console.log("Não foi possível atualizar avaliação!", errorResponse);
      });
  }

  onBack() {
    this.location.back();
  }

  clickCheckAll() {
    this.listChecksBmiWhr.forEach((element, index) => {
      this.listChecksBmiWhr[index] = !this.allCounselings;
    });

    this.listChecksGlycemia.forEach((element, index) => {
      this.listChecksGlycemia[index] = !this.allCounselings;
    });

    this.listChecksBloodPressure.forEach((element, index) => {
      this.listChecksBloodPressure[index] = !this.allCounselings;
    });
  }

  allChecksDisabled(): boolean {
    const findBmi = this.listChecksBmiWhr.find(element => {
      return element === true;
    });

    const findGlycemia = this.listChecksGlycemia.find(element => {
      return element === true;
    });

    const findBlood = this.listChecksBloodPressure.find(element => {
      return element === true;
    });


    return !(findBmi || findGlycemia || findBlood);
  }

}
