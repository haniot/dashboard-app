import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NutritionEvaluationService } from '../services/nutrition-evaluation.service';
import { NutritionEvaluation } from '../models/nutrition-evaluation';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';
import { EvaluationStatustPipe } from '../pipes/evaluation-status.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-nutrition-evaluation',
  templateUrl: './nutrition-evaluation.component.html',
  styleUrls: ['./nutrition-evaluation.component.scss']
})
export class NutritionEvaluationComponent implements OnInit {

  listStatus = Object.keys(EvaluationStatustPipe);

  form: FormGroup;

  nutritionForm: FormGroup;

  nutritionEvaluationId: string;

  constructor(
    private fb: FormBuilder,
    private nutritionService: NutritionEvaluationService,
    private activeRouter: ActivatedRoute,
    private evaluationStatusPipe: EvaluationStatustPipe,
    private datePipe: DatePipe,
    private modalService: ModalService
  ) {

  }

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((params) => {
      this.nutritionEvaluationId = params.get('nutritionevaluation_id');
      this.getNutritionEvaluation();
    });
    this.createForm()
    this.getNutritionEvaluation();
  }

  createForm() {
    this.nutritionForm = this.fb.group({
      id: [''],
      created_at: [{ value: '', disabled: true }],
      status: [{ value: '' }],
      patient_id: [''],
      nutritional_status: this.fb.group({
        bmi: [{ value: 0, disabled: true }],
        percentile: [{ value: '', disabled: true }],
        classification: [{ value: '', disabled: true }],
      }),
      overweight_indicator: this.fb.group({
        waist_height_relation: [{ value: 0, disabled: true }],
        classification: [{ value: '', disabled: true }],
      }),
      heart_rate: this.fb.group({
        min: [{ value: 0, disabled: true }],
        max: [{ value: 0, disabled: true }],
        average: [{ value: 0, disabled: true }],
        dataset: this.fb.array([])
      }),
      blood_glucose: this.fb.group({
        value: [{ value: 0, disabled: true }],
        meal: [{ value: '', disabled: true }],
        classification: [{ value: '', disabled: true }],
        zones: this.fb.array([])
      }),
      blood_pressure: this.fb.group({
        systolic: [{ value: 0, disabled: true }],
        diastolic: [{ value: 0, disabled: true }],
        systolic_percentile: [{ value: '', disabled: true }],
        diastolic_percentile: [{ value: '', disabled: true }],
        classification: [{ value: '', disabled: true }],
      }),
      counseling: [{ value: '' }],
    });

    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  loadNutritionEvaluationInForm(nutritionEvaluation: NutritionEvaluation) {
    this.nutritionForm = this.fb.group({
      id: [{ value: nutritionEvaluation.id, disabled: true }],
      created_at: [{ value: nutritionEvaluation.created_at, disabled: true }],
      status: [{ value: nutritionEvaluation.status, disabled: true }],
      patient_id: [{ value: nutritionEvaluation.patient_id, disabled: true }],
      nutritional_status: this.fb.group({
        bmi: [{ value: nutritionEvaluation.nutritional_status.bmi, disabled: true }],
        percentile: [{ value: nutritionEvaluation.nutritional_status.percentile, disabled: true }],
        classification: [{ value: nutritionEvaluation.nutritional_status.classification, disabled: true }],
      }),
      overweight_indicator: this.fb.group({
        waist_height_relation: [{ value: nutritionEvaluation.overweight_indicator.waist_height_relation, disabled: true }],
        classification: [{ value: nutritionEvaluation.overweight_indicator.classification, disabled: true }]
      }),
      heart_rate: this.fb.group({
        min: [{ value: nutritionEvaluation.heart_rate.min, disabled: true }],
        max: [{ value: nutritionEvaluation.heart_rate.max, disabled: true }],
        average: [{ value: nutritionEvaluation.heart_rate.average, disabled: true }],
        dataset: this.fb.array([])
      }),
      blood_glucose: this.fb.group({
        value: [{ value: nutritionEvaluation.blood_glucose.value, disabled: true }],
        meal: [{ value: nutritionEvaluation.blood_glucose.meal, disabled: true }],
        classification: [{ value: nutritionEvaluation.blood_glucose.classification, disabled: true }],
        zones: this.fb.array([])
      }),
      blood_pressure: this.fb.group({
        systolic: [{ value: nutritionEvaluation.blood_pressure.systolic, disabled: true }],
        diastolic: [{ value: nutritionEvaluation.blood_pressure.diastolic, disabled: true }],
        systolic_percentile: [{ value: nutritionEvaluation.blood_pressure.systolic_percentile, disabled: true }],
        diastolic_percentile: [{ value: nutritionEvaluation.blood_pressure.diastolic_percentile, disabled: true }],
        classification: [{ value: nutritionEvaluation.blood_pressure.classification, disabled: true }],
      }),
      counseling: [{ value: nutritionEvaluation.counseling, disabled: true }]
    });
    this.nutritionForm.get('created_at').patchValue(this.datePipe.transform(nutritionEvaluation.created_at));
    this.nutritionForm.get('status').patchValue(this.evaluationStatusPipe.transform(nutritionEvaluation.status));
  }

  getNutritionEvaluation() {
    this.nutritionService.getById(this.nutritionEvaluationId, this.nutritionEvaluationId)
      .then(nutritionEvaluation => {
        this.loadNutritionEvaluationInForm(nutritionEvaluation);
      })
      .catch(erroResponse => {
        //console.log('Não foi possível carregar avaliação!', errorResponse);
      });

  }

  shareEvaluationOpen() {
    this.modalService.open('modalShareEvaluation');
  }

  closeModalShareEvaluation() {
    this.form.reset();
    this.modalService.close('modalShareEvaluation');
  }

}
