import {Injectable} from '@angular/core';

import * as jsPDF from 'jspdf';

import {NutritionEvaluation} from "../models/nutrition-evaluation";
import {DatePipe} from "@angular/common";
import {NutritionClassificationtPipe} from "../pipes/nutrition-classification.pipe";
import {TranslateService} from "@ngx-translate/core";
import {TaylorCutClassificationPipe} from "../pipes/taylor-cut-classification.pipe";
import {OverweigthClassificationPipe} from "../pipes/overweigth-classification.pipe";
import {BloodglucoseClassificationPipe} from "../pipes/bloodglucose-classification.pipe";
import {MealPipe} from "../../measurement/pipes/meal.pipe";
import {BloodpressureClassificationPipe} from "../pipes/bloodpressure-classification.pipe";

@Injectable()
export class GeneratePdfService {

    constructor(
        private datePipe: DatePipe,
        private nutritionPipe: NutritionClassificationtPipe,
        private taylorCutPipe: TaylorCutClassificationPipe,
        private overWeightPipe: OverweigthClassificationPipe,
        private glycemiaPipe: BloodglucoseClassificationPipe,
        private mealPipe: MealPipe,
        private pressurePipe: BloodpressureClassificationPipe,
        private translate: TranslateService) {
    }

    exportPDF(evaluation: NutritionEvaluation): void {

        const START_X = 15;
        const START_Y = 15;
        const MAX_WIDHT = 180;
        const MAX_HEIGHT = 282;
        const SPACING = 6;

        const doc = new jsPDF("portrait", "mm", "a4");
        doc.setFont("times");
        doc.setFontSize(12);

        const imgData = 'data:image/png;base64,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';
        doc.addImage(imgData, 'JPEG', 100, 10, 13, 0);

        doc.setFontStyle("bold");
        doc.text('UNIVERSIDADE ESTADUAL DA PARAÍBA', 60, 40);
        doc.text('CABEÇALHO CLÍNICA', 80, 46);
        doc.text('NUTES/UEPB/HANIoT', 80, 52);

        doc.setFontStyle("normal");
        doc.text('RESULTADO DA AVALIAÇÃO NUTRICIONAL', 60, 65);
        doc.text(this.datePipe.transform(evaluation.created_at, "fullDate") + ".", 80, 72);

        doc.text('Nome:', 15, 80);
        doc.text(evaluation.patient.name, 30, 80);

        doc.text('Idade:', 15, 86);
        doc.text(this.transformInAge(evaluation.patient.birth_date), 30, 86);

        /* Estado Nutricional */
        doc.setFontStyle("bold");
        doc.text('Estado Nutricional:', 15, 95);

        doc.setFontStyle("normal");
        const nutritional_classification = this.translate
            .instant(this.nutritionPipe.transform(evaluation.nutritional_status.classification));
        doc.text(nutritional_classification, 55, 95);

        doc.setFontStyle("bold");
        doc.text('Parâmetros utilizados', 80, 101);

        doc.setFontStyle("bold");
        doc.text('Estatura:', 30, 108);

        doc.setFontStyle("normal");
        doc.text(evaluation.nutritional_status.height + ' cm', 65, 108);

        doc.setFontStyle("bold");
        doc.text('Peso:', 128, 108);

        doc.setFontStyle("normal");
        doc.text(evaluation.nutritional_status.weight + ' kg', 160, 108);

        doc.setFontStyle("bold");
        doc.text('IMC:', 35, 115);

        doc.setFontStyle("normal");
        doc.text(evaluation.nutritional_status.bmi.toString(), 68, 115);

        doc.setFontStyle("bold");
        doc.text('Percentil:', 123, 115);

        doc.setFontStyle("normal");
        doc.text(evaluation.nutritional_status.percentile, 163, 115);

        /* Ponto de Corte de Taylor */
        doc.setFontStyle("bold");
        doc.text('Ponto de Corte de Taylor:', 15, 130);

        const taylor_cut_classification = this.translate.instant(this.taylorCutPipe.transform(evaluation.taylor_cut_point.classification));

        doc.setFontStyle("normal");
        doc.text(taylor_cut_classification, 65, 130);

        doc.setFontStyle("bold");
        doc.text('Parâmetros utilizados', 80, 136);

        doc.setFontStyle("bold");
        doc.text('Circunferência da Cintura:', 65, 142);

        doc.setFontStyle("normal");
        doc.text(evaluation.taylor_cut_point.waist_circumference + ' cm', 118, 142);

        /* Indicadores de Sobrepeso */
        doc.setFontStyle("bold");
        doc.text('Indicadores de Sobrepeso:', 15, 157);

        doc.setFontStyle("normal");
        const overWeight = this.translate.instant(this.overWeightPipe.transform(evaluation.overweight_indicator.classification));
        doc.text(overWeight, 65, 157);

        doc.setFontStyle("bold");
        doc.text('Parâmetros utilizados', 80, 163);

        doc.setFontStyle("bold");
        doc.text('Circunferência da Cintura:', 65, 169);

        doc.setFontStyle("normal");
        doc.text(evaluation.overweight_indicator.waist_circumference + ' cm', 118, 169);

        doc.setFontStyle("bold");
        doc.text('Relação Cintura/Estatura:', 25, 175);

        doc.setFontStyle("normal");
        doc.text(evaluation.overweight_indicator.waist_height_relation.toString(), 75, 175);

        doc.setFontStyle("bold");
        doc.text('Estatura:', 145, 175);

        doc.setFontStyle("normal");
        doc.text(evaluation.overweight_indicator.height + ' cm', 165, 175);

        /* Glicemia */
        doc.setFontStyle("bold");
        doc.text('Glicemia:', 15, 190);

        const glycemia_classification = this.translate.instant(this.glycemiaPipe.transform(evaluation.blood_glucose.classification));
        doc.setFontStyle("normal");
        doc.text(glycemia_classification, 35, 190);

        doc.setFontStyle("bold");
        doc.text('Parâmetros utilizados', 80, 196);

        doc.setFontStyle("bold");
        doc.text('Tipo de Refeição:', 35, 202);

        const mealType = this.translate.instant(this.mealPipe.transform(evaluation.blood_glucose.meal));
        doc.setFontStyle("normal");
        doc.text(mealType, 70, 202);

        doc.setFontStyle("bold");
        doc.text('Valor:', 150, 202);

        doc.setFontStyle("normal");
        doc.text(evaluation.blood_glucose.value + ' mg/dl', 163, 202);

        /* Pressão Arterial */
        doc.setFontStyle("bold");
        doc.text('Pressão Arterial:', 15, 217);

        const pressure_classification = this.translate.instant(this.pressurePipe.transform(evaluation.blood_pressure.classification));
        doc.setFontStyle("normal");
        doc.text(pressure_classification, 50, 217);

        doc.setFontStyle("bold");
        doc.text('Parâmetros utilizados', 80, 223);

        const SYSTOLIC = this.translate.instant('EVALUATION.NUTRITION-EVALUATION.CARD-NUTRITION.SYSTOLIC');
        const DIASTOLIC = this.translate.instant('EVALUATION.NUTRITION-EVALUATION.CARD-NUTRITION.SYSTOLIC');

        doc.text(SYSTOLIC, 40, 229);
        doc.text(DIASTOLIC, 145, 229);

        doc.setFontStyle("bold");
        doc.text('Valor:', 18, 235);

        doc.setFontStyle("normal");
        doc.text(evaluation.blood_pressure.systolic + ' mmHg', 32, 235);

        doc.setFontStyle("bold");
        doc.text('Percentil:', 65, 235);

        doc.setFontStyle("normal");
        doc.text(evaluation.blood_pressure.systolic_percentile, 85, 235);

        doc.setFontStyle("bold");
        doc.text('Valor:', 117, 235);

        doc.setFontStyle("normal");
        doc.text(evaluation.blood_pressure.diastolic + ' mmHg', 130, 235);

        doc.setFontStyle("bold");
        doc.text('Percentil:', 160, 235);

        doc.setFontStyle("normal");
        doc.text(evaluation.blood_pressure.diastolic_percentile, 180, 235);

        /* Orientações Nutricionais */
        doc.setFontStyle("bold");
        doc.text('Orientações Nutricionais', 15, 250);

        let heigthCurrent = 260;

        if (evaluation.counseling.definitive.bmi_whr && evaluation.counseling.definitive.bmi_whr.length) {

            /* Estado Nutricional */
            doc.setFontStyle("bold");
            doc.text('Estado Nutricional', 85, heigthCurrent);
            heigthCurrent += 6;

            evaluation.counseling.definitive.bmi_whr.forEach(conseling => {
                const splitTitle = doc.splitTextToSize(conseling, MAX_WIDHT);
                doc.setFontStyle("normal");
                splitTitle[0] = '* ' + splitTitle[0];
                if (heigthCurrent >= MAX_HEIGHT) {
                    doc.addPage('a4', "portrait");
                    heigthCurrent = START_Y;
                }
                doc.text(splitTitle, START_X, heigthCurrent, {align: "justify", maxWidth: MAX_WIDHT});
                heigthCurrent += splitTitle.length * SPACING;
            })
        }

        if (evaluation.counseling.definitive.glycemia && evaluation.counseling.definitive.glycemia.length) {

            /* Resistência a insulina / Diabetes */
            doc.setFontStyle("bold");
            doc.text('Resistência a insulina / Diabetes', 75, heigthCurrent);
            heigthCurrent += 6;

            evaluation.counseling.definitive.glycemia.forEach(conseling => {
                const splitTitle = doc.splitTextToSize(conseling, MAX_WIDHT);
                doc.setFontStyle("normal");
                splitTitle[0] = '* ' + splitTitle[0];
                if (heigthCurrent >= MAX_HEIGHT) {
                    doc.addPage('a4', "portrait");
                    heigthCurrent = START_Y;
                }
                doc.text(splitTitle, START_X, heigthCurrent, {align: "justify", maxWidth: MAX_WIDHT});
                heigthCurrent += splitTitle.length * SPACING;
            })
        }

        if (evaluation.counseling.definitive.blood_pressure && evaluation.counseling.definitive.blood_pressure.length) {

            /* Hipertensão */
            doc.setFontStyle("bold");
            doc.text('Hipertensão', 90, heigthCurrent);
            heigthCurrent += 6;

            evaluation.counseling.definitive.blood_pressure.forEach(conseling => {
                const splitTitle = doc.splitTextToSize(conseling, MAX_WIDHT);
                doc.setFontStyle("normal");
                splitTitle[0] = '* ' + splitTitle[0];
                if (heigthCurrent >= MAX_HEIGHT) {
                    doc.addPage('a4', "portrait");
                    heigthCurrent = START_Y;
                }
                doc.text(splitTitle, START_X, heigthCurrent, {align: "justify", maxWidth: MAX_WIDHT});
                heigthCurrent += splitTitle.length * SPACING;
            })
        }

        doc.text("RODAPÉ", 95, MAX_HEIGHT + 5);

        doc.save('Avaliacao-Nutricional.pdf');
    }


    private transformInAge(value: string): string {
        try {
            const birth_date = new Date(value);

            const date_current = new Date();

            return this.calculaIdade(birth_date, date_current);
        } catch (e) {

        }
    }

    private calculaIdade(birth_date: Date, date_current: Date) {
        return `${date_current.getFullYear() - birth_date.getFullYear()} ${this.translate.instant('SHARED.YEARS')}`;
    }
}
