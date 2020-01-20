import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { NutritionEvaluationService } from '../services/nutrition.evaluation.service';
import { NutritionalCouncil, NutritionEvaluation } from '../models/nutrition-evaluation';
import { MealType } from '../../measurement/models/blood.glucose';
import { GeneratePdfService } from '../services/generate.pdf.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { SendEmailService } from '../services/send.email.service';
import { Patient } from '../../patient/models/patient'
import { EnumMeasurementType, Measurement } from '../../measurement/models/measurement'
import { BloodPressure } from '../../measurement/models/blood.pressure'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { PatientService } from '../../patient/services/patient.service'
import { Weight } from '../../measurement/models/weight'
import { TimeSeries } from '../../activity/models/time.series'

const zones = [{
    preprandial: {
        good: {
            min: 65,
            max: 100
        },
        great: {
            min: 90,
            max: 145
        }
    },
    postprandial: {
        good: {
            min: 80,
            max: 126
        },
        great: {
            min: 90,
            max: 180
        }
    },
    bedtime: {
        good: {
            min: 80,
            max: 100
        },
        great: {
            min: 120,
            max: 180
        }
    }
}]

@Component({
    selector: 'app-nutrition-evaluation',
    templateUrl: './nutrition.evaluation.component.html',
    styleUrls: ['./nutrition.evaluation.component.scss']
})
export class NutritionEvaluationComponent implements OnInit, OnDestroy {
    typeCousenling: Array<string>;
    nutritionalEvaluation: NutritionEvaluation;
    nutritionEvaluationId: string;
    optionsHeartRate: any;
    patientId: string;
    patient: Patient;
    ncSuggested: NutritionalCouncil;
    ncDefinitive: NutritionalCouncil;
    finalCounseling: string;
    allCounselingsBmiWhr: boolean;
    allCounselingsGlycemia: boolean;
    allCounselingsBloodPressure: boolean;
    listChecksBmiWhr: Array<boolean>;
    listChecksGlycemia: Array<boolean>;
    listChecksBloodPressure: Array<boolean>;
    listWeight: Array<Measurement>;
    listHeight: Array<Measurement>;
    listFat: Array<Measurement>;
    listWaistCircunference: Array<Measurement>;
    listBodyTemperature: Array<Measurement>;
    listBloodGlucose: Array<Measurement>;
    listBloodPressure: Array<BloodPressure>;
    listHeartRate: Array<TimeSeries>;
    newCounseling = '';
    newCounselingType = 'bmi_whr';
    finalingEvaluantion: boolean;
    /* flag used to control the visibility of classification zones */
    showZonesClassification: boolean;
    /* flag used to control the visibility of the PDF generation modal */
    generatingPDF: boolean;
    /* flag used to control the visibility of the evaluation submission modal */
    sendingEvaluation: boolean;
    private subscriptions: Array<ISubscription>;

    constructor(
        private nutritionService: NutritionEvaluationService,
        private sendEmailService: SendEmailService,
        private activeRouter: ActivatedRoute,
        private datePipe: DatePipe,
        private modalService: ModalService,
        private location: Location,
        private patientService: PatientService,
        private toastService: ToastrService,
        private nutritionEvaluationService: NutritionEvaluationService,
        private translateService: TranslateService,
        private generatePDF: GeneratePdfService,
        private localStorageService: LocalStorageService
    ) {
        this.subscriptions = new Array<ISubscription>();
        this.ncSuggested = new NutritionalCouncil();
        this.ncDefinitive = new NutritionalCouncil();
        this.patient = new Patient('');
        this.nutritionalEvaluation = new NutritionEvaluation();
        this.listChecksBmiWhr = new Array<boolean>();
        this.listChecksGlycemia = new Array<boolean>();
        this.listChecksBloodPressure = new Array<boolean>();
        this.listWeight = new Array<Weight>();
        this.listHeight = new Array<Measurement>();
        this.listFat = new Array<Measurement>();
        this.listWaistCircunference = new Array<Measurement>();
        this.listBodyTemperature = new Array<Measurement>();
        this.listBloodGlucose = new Array<Measurement>();
        this.listBloodPressure = new Array<BloodPressure>();
        this.listHeartRate = new Array<TimeSeries>();
        this.showZonesClassification = false;
        this.typeCousenling = [
            this.translateService.instant('EVALUATION.NUTRITION-EVALUATION.CARD-NUTRITION.STATE-NUTRITION'),
            this.translateService.instant('EVALUATION.NUTRITION-EVALUATION.CARD-NUTRITION.DIABETES'),
            this.translateService.instant('EVALUATION.NUTRITION-EVALUATION.CARD-NUTRITION.HYPERTENSION')
        ];
        this.generatingPDF = false;
        this.finalingEvaluantion = false;
        this.sendingEvaluation = false;
        this.finalCounseling = '';
        this.allCounselingsBmiWhr = false;
        this.allCounselingsGlycemia = false;
        this.allCounselingsBloodPressure = false;
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patient_id');
            this.nutritionEvaluationId = params.get('nutritionevaluation_id');
            this.getNutritionEvaluation();
        }));
        if (!this.patientId) {
            this.getNutritionEvaluation();
        }
        this.translateService.onLangChange.subscribe(() => {
            this.typeCousenling = [
                this.translateService.instant('EVALUATION.NUTRITION-EVALUATION.CARD-NUTRITION.STATE-NUTRITION'),
                this.translateService.instant('EVALUATION.NUTRITION-EVALUATION.CARD-NUTRITION.DIABETES'),
                this.translateService.instant('EVALUATION.NUTRITION-EVALUATION.CARD-NUTRITION.HYPERTENSION')
            ];
        })
    }

    getNutritionEvaluation() {
        this.nutritionService.getById(this.patientId, this.nutritionEvaluationId)
            .then(nutritionEvaluation => {
                this.nutritionalEvaluation = nutritionEvaluation;
                this.verifyVisibityZonesClassification();
                this.formatCounseling()
                this.separateMeasurements();
                this.patientId = this.nutritionalEvaluation.patient.id;
                this.getPatient();
            })
            .catch((error) => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.NOT-LOAD-NUTRITION-EVALUATION'));
            });
    }

    verifyVisibityZonesClassification(): void {
        if (this.nutritionalEvaluation.blood_glucose.meal === MealType.preprandial
            || this.nutritionalEvaluation.blood_glucose.meal === MealType.postprandial
            || this.nutritionalEvaluation.blood_glucose.meal === MealType.bedtime) {
            this.showZonesClassification = true;
        } else {
            this.showZonesClassification = false;
        }
    }

    formatCounseling() {
        this.listChecksBmiWhr = new Array<boolean>();
        this.listChecksGlycemia = new Array<boolean>();
        this.listChecksBloodPressure = new Array<boolean>();

        this.finalCounseling = '';

        this.ncSuggested = this.nutritionalEvaluation.counseling.suggested;
        this.ncDefinitive = this.nutritionalEvaluation.counseling.definitive;


        this.ncSuggested.bmi_whr.forEach((counseling, index) => {
            if (index === this.ncSuggested.bmi_whr.length - 1) {
                this.finalCounseling += '\t' + (index + 1) + '. ' + counseling;
            } else {
                this.finalCounseling += '\t' + (index + 1) + '. ' + counseling + '\n\n';
            }
            this.listChecksBmiWhr.push(false);
        });

        this.ncSuggested.glycemia.forEach((counseling, index) => {
            if (index === this.ncSuggested.glycemia.length - 1) {
                this.finalCounseling += '\t' + (index + 1) + '. ' + counseling;
            } else {
                this.finalCounseling += '\t' + (index + 1) + '. ' + counseling + '\n\n';
            }
            this.listChecksGlycemia.push(false);
        });

        this.ncSuggested.blood_pressure.forEach((counseling, index) => {
            if (index === this.ncSuggested.blood_pressure.length - 1) {
                this.finalCounseling += '\t' + (index + 1) + '. ' + counseling;
            } else {
                this.finalCounseling += '\t' + (index + 1) + '. ' + counseling + '\n\n';
            }
            this.listChecksBloodPressure.push(false);
        });

    }

    getPatient(): void {
        this.patientService.getById(this.patientId)
            .then(patient => {
                this.patient = patient;
            })
            .catch(() => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-IDENTIFIED'))
            });

    }

    finalizeEvaluation() {
        this.finalingEvaluantion = true;

        const counselingBwr: Array<number> = new Array<number>();
        this.listChecksBmiWhr.forEach((element, index) => {
            if (element === true) {
                counselingBwr.push(index);
            }
        });

        const counselingGlycemia: Array<number> = new Array<number>();
        this.listChecksGlycemia.forEach((element, index) => {
            if (element === true) {
                counselingGlycemia.push(index);
            }
        });

        const counselingBlood: Array<number> = new Array<number>();
        this.listChecksBloodPressure.forEach((element, index) => {
            if (element === true) {
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

        this.nutritionEvaluationService.finalize(this.nutritionalEvaluation.id, this.nutritionalEvaluation.patient.id, nutritionalCouncil)
            .then(nutritionEvaluation => {
                this.getNutritionEvaluation();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.EVALUATION-COMPLETED'));
                this.finalingEvaluantion = false;
            })
            .catch(errorResponse => {
                this.finalingEvaluantion = false;
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.EVALUATION-NOT-COMPLETED'));
            });
    }

    onBack() {
        this.location.back();
    }

    clickCheckAllBmiWhr() {
        this.listChecksBmiWhr.forEach((element, index) => {
            this.listChecksBmiWhr[index] = !this.allCounselingsBmiWhr;
        });
    }

    clickCheckAllGlycemia() {
        this.listChecksGlycemia.forEach((element, index) => {
            this.listChecksGlycemia[index] = !this.allCounselingsGlycemia;
        });
    }

    clickCheckAllBloodPressure() {
        this.listChecksBloodPressure.forEach((element, index) => {
            this.listChecksBloodPressure[index] = !this.allCounselingsBloodPressure;
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

    separateMeasurements(): void {
        const measurements: Array<any> = this.nutritionalEvaluation.measurements;

        this.listWeight = measurements.filter((element: Weight) => {
            return element.type === EnumMeasurementType.weight
        });

        this.listHeight = measurements.filter((element: Measurement) => {
            return element.type === EnumMeasurementType.height
        });

        this.listFat = measurements.filter((element: Measurement) => {
            return element.type === EnumMeasurementType.body_fat
        });

        this.listWaistCircunference = measurements.filter((element: Measurement) => {
            return element.type === EnumMeasurementType.waist_circumference
        });

        this.listBodyTemperature = measurements.filter((element: Measurement) => {
            return element.type === EnumMeasurementType.body_temperature
        });

        this.listBloodGlucose = measurements.filter((element: Measurement) => {
            return element.type === EnumMeasurementType.blood_glucose
        });

        this.listBloodPressure = measurements.filter((element: Measurement) => {
            return element.type === EnumMeasurementType.blood_pressure
        });

        // this.listHeartRate = measurements.filter((element: Measurement) => {
        //     return element.type === MeasurementType.heart_rate
        // });
    }

    showNewCounseling(): void {
        this.modalService.open('newCounseling');
    }

    hiddenNewCounseling(): void {
        this.modalService.close('newCounseling');
        this.newCounseling = '';
        this.newCounselingType = 'bmi_whr';
    }

    addNewCounseling(): void {

        switch (this.newCounselingType) {
            case 'bmi_whr':
                this.ncSuggested.bmi_whr.push(this.newCounseling);
                this.listChecksBmiWhr[this.ncSuggested.bmi_whr.length - 1] = true;
                break;
            case 'glycemia':
                this.ncSuggested.glycemia.push(this.newCounseling);
                this.listChecksGlycemia[this.ncSuggested.glycemia.length - 1] = true;
                break;
            case 'blood_pressure':
                this.ncSuggested.blood_pressure.push(this.newCounseling);
                this.listChecksBloodPressure[this.ncSuggested.blood_pressure.length - 1] = true;
                break;
            default:
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.COUNSELING-NOT-ADD'));
                break;
        }
        this.hiddenNewCounseling();

    }

    sendEvaluationViaEmail() {

        this.sendingEvaluation = true;

        const localUserLogged = JSON.parse(this.localStorageService.getItem('userLogged'));

        const healthProfessionalName = localUserLogged.name;

        const healthProfessionalEmail = localUserLogged.email;

        const healthProfessionalPhone = localUserLogged.phone_number;

        const health_professinal = {
            name: healthProfessionalName,
            email: healthProfessionalEmail,
            phone_number: healthProfessionalPhone
        }

        const pdf = this.generatePDF.getPDF(this.nutritionalEvaluation, health_professinal.name);

        this.sendEmailService.sendNutritionalEvaluationViaEmail(health_professinal, this.patient, this.nutritionalEvaluation, pdf)
            .then(() => {
                this.sendingEvaluation = false;
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.EVALUATION-SEND'));
            })
            .catch(err => {
                this.sendingEvaluation = false;
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.EVALUATION-NOT-SEND'));
            });
    }

    getZoneGood(): { min: number, max: number } {

        const meal = this.nutritionalEvaluation.blood_glucose.meal;

        switch (meal) {
            case MealType.preprandial:
                return zones[0][MealType.preprandial].good;

            case MealType.postprandial:
                return zones[0][MealType.postprandial].good;

            case MealType.bedtime:
                return zones[0][MealType.bedtime].good;

            default:
                return { min: 0, max: 0 }
        }
    }

    getZoneGreat(): { min: number, max: number } {
        const meal = this.nutritionalEvaluation.blood_glucose.meal;

        switch (meal) {
            case MealType.preprandial:
                return zones[0][MealType.preprandial].great;

            case MealType.postprandial:
                return zones[0][MealType.postprandial].great;

            case MealType.bedtime:
                return zones[0][MealType.bedtime].great;

            default:
                return { min: 0, max: 0 }
        }
    }

    async exportPDF() {
        this.generatingPDF = true;
        const localUserLogged = JSON.parse(this.localStorageService.getItem('userLogged'));
        const health_professional_name = localUserLogged.name ? localUserLogged.name : localUserLogged.email;
        await this.generatePDF.exportPDF(this.nutritionalEvaluation, health_professional_name);
        this.generatingPDF = false;
    }

    ngOnDestroy(): void {
        /* cancel all subscriptions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
