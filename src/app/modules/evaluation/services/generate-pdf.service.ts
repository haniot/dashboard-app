import {Injectable} from '@angular/core';
import {DatePipe} from "@angular/common";

import * as jsPDF from 'jspdf';
import {TranslateService} from "@ngx-translate/core";

import {NutritionEvaluation} from "../models/nutrition-evaluation";
import {NutritionClassificationtPipe} from "../pipes/nutrition-classification.pipe";
import {TaylorCutClassificationPipe} from "../pipes/taylor-cut-classification.pipe";
import {OverweigthClassificationPipe} from "../pipes/overweigth-classification.pipe";
import {BloodglucoseClassificationPipe} from "../pipes/bloodglucose-classification.pipe";
import {MealPipe} from "../../measurement/pipes/meal.pipe";
import {BloodpressureClassificationPipe} from "../pipes/bloodpressure-classification.pipe";

const START_X = 15;
const START_Y = 15;
const CENTER_X = 105;
const MAX_WIDHT = 180;
const MAX_HEIGHT = 278;
const SPACING = 6;
const SIMPLE_SPACING = 5;

@Injectable()
export class GeneratePdfService {

    doc: jsPDF;

    constructor(
        private datePipe: DatePipe,
        private nutritionPipe: NutritionClassificationtPipe,
        private taylorCutPipe: TaylorCutClassificationPipe,
        private overWeightPipe: OverweigthClassificationPipe,
        private glycemiaPipe: BloodglucoseClassificationPipe,
        private mealPipe: MealPipe,
        private pressurePipe: BloodpressureClassificationPipe,
        private translate: TranslateService) {
        this.doc = new jsPDF("portrait", "mm", "a4");
    }

    generatePDF(evaluation: NutritionEvaluation, healthProfessional: string): void {

        this.doc = new jsPDF("portrait", "mm", "a4");

        this.doc.setFont('courier');

        this.addFooter();

        this.doc.setFontSize(14);

        const img = "data:image/png;base64,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";
        this.doc.addImage(img, 'JPEG', 92, 15, 28, 0);

        this.doc.setFontStyle("bold");
        this.doc.text('UNIVERSIDADE ESTADUAL DA PARAÍBA', CENTER_X, 55, "center");
        this.doc.text('NÚCLEO DE TECNOLOGIAS ESTRATÉGICAS EM SAÚDE', CENTER_X, 63, "center");
        this.doc.text('HANIOT – Health ANalytics Internet of Things', CENTER_X, 71, "center");

        this.doc.text('RESULTADO DA AVALIAÇÃO NUTRICIONAL', CENTER_X, 87, "center");
        this.doc.setFontSize(13);

        const html = "<p style='text-align:center;font-family: Courier New, courier'><b>NUTRICIONISTA: </b>" + healthProfessional + "</p>";

        const maxWidth = 215 - (2.5 * healthProfessional.length);

        this.doc.setFontStyle("normal");

        this.doc.fromHTML(html, 0, 92, {'width': maxWidth});

        this.doc.setFontSize(12);

        this.doc.text(this.datePipe.transform(evaluation.created_at, "fullDate"), CENTER_X, 108, "center");

        this.doc.setFontStyle("bold");
        this.doc.text('Paciente:', 15, 120);

        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.patient.name, 40, 120);

        this.doc.setFontStyle("bold");
        this.doc.text('Idade:', 15, 128);

        this.doc.setFontStyle("normal");
        this.doc.text(this.transformInAge(evaluation.patient.birth_date), 32, 128);

        /* Estado Nutricional */
        this.doc.setFontStyle("bold");
        this.doc.text('Estado Nutricional:', 15, 142);

        this.doc.setFontStyle("normal");
        const nutritional_classification = this.translate
            .instant(this.nutritionPipe.transform(evaluation.nutritional_status.classification));
        this.doc.text(nutritional_classification, 65, 142);
        this.doc.setDrawColor(220, 220, 220);
        this.doc.rect(15, 146, 180, 18);

        this.doc.setFontStyle("bold");
        this.doc.text('Parâmetros utilizados', CENTER_X, 150, "center");

        this.doc.rect(15, 152, 45, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Estatura: ', 38, 156, "center");

        this.doc.rect(15, 158, 45, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('IMC: ', 38, 162, "center");

        this.doc.rect(60, 152, 45, 6);
        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.nutritional_status.height + ' cm', 83, 156, "center");

        this.doc.rect(60, 158, 45, 6);
        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.nutritional_status.bmi.toString(), 83, 162, "center");

        this.doc.rect(CENTER_X, 152, 45, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Peso: ', 128, 156, "center");

        this.doc.rect(CENTER_X, 158, 45, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Percentil: ', 128, 162, "center");

        this.doc.rect(150, 152, 45, 6);
        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.nutritional_status.weight + ' kg', 172, 156, "center");

        this.doc.rect(150, 158, 45, 6);
        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.nutritional_status.percentile, 172, 162, "center");

        /* Indicadores de Sobrepeso */
        this.doc.setFontStyle("bold");
        this.doc.text('Indicadores de Sobrepeso:', 15, 172);

        this.doc.setFontStyle("normal");
        const overWeight = this.translate.instant(this.overWeightPipe.transform(evaluation.overweight_indicator.classification));
        this.doc.text(overWeight, 80, 172);
        this.doc.setDrawColor(220, 220, 220);
        this.doc.rect(15, 176, 180, 18);

        this.doc.setFontStyle("bold");
        this.doc.text('Parâmetros utilizados', CENTER_X, 180, "center");

        this.doc.rect(15, 182, 180, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Circunferência da Cintura: ', 98, 186, "center");

        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.overweight_indicator.waist_circumference + ' cm', 132, 186);

        this.doc.rect(15, 188, 90, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Relação cintura/estatura: ', 55, 192, "center");

        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.overweight_indicator.waist_height_relation.toString(), 88, 192);

        this.doc.rect(CENTER_X, 188, 90, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Estatura: ', 142, 192, "center");

        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.overweight_indicator.waist_height_relation.toString(), 155, 192);

        /* Glicemia */
        this.doc.setFontStyle("bold");
        this.doc.text('Glicemia:', 15, 202);

        this.doc.setFontStyle("normal");
        const glycemia_classification = this.translate.instant(this.glycemiaPipe.transform(evaluation.blood_glucose.classification));
        this.doc.text(glycemia_classification, 40, 202);
        this.doc.setDrawColor(220, 220, 220);
        this.doc.rect(15, 206, 180, 12);

        this.doc.setFontStyle("bold");
        this.doc.text('Parâmetros utilizados', CENTER_X, 210, "center");

        this.doc.rect(15, 212, 90, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Tipo de refeição: ', 45, 216, "center");

        this.doc.setFontStyle("normal");
        const mealType = this.translate.instant(this.mealPipe.transform(evaluation.blood_glucose.meal));
        this.doc.text(mealType, 67, 216);

        this.doc.rect(CENTER_X, 212, 90, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Valor: ', 142, 216, "center");

        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.blood_glucose.value + ' mg/dl', 150, 216);

        /* Pressão Arterial */
        this.doc.setFontStyle("bold");
        this.doc.text('Pressão Arterial:', 15, 226);

        this.doc.setFontStyle("normal");
        const pressure_classification = this.translate.instant(this.pressurePipe.transform(evaluation.blood_pressure.classification));
        this.doc.text(pressure_classification, 60, 226);
        this.doc.setDrawColor(220, 220, 220);
        this.doc.rect(15, 230, 180, 18);

        this.doc.setFontStyle("bold");
        this.doc.text('Parâmetros utilizados', CENTER_X, 234, "center");

        this.doc.rect(15, 236, 90, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('SISTÓLICA ', 60, 240, "center");

        this.doc.rect(CENTER_X, 236, 90, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('DIASTÓLICA ', 152, 240, "center");

        this.doc.rect(15, 242, 45, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Valor: ', 28, 246, "center");

        this.doc.rect(60, 242, 45, 6);
        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.blood_pressure.systolic + ' mmHg', 35, 246);

        this.doc.rect(CENTER_X, 242, 45, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Percentil: ', 78, 246, "center");

        this.doc.rect(150, 242, 45, 6);
        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.blood_pressure.systolic_percentile, 90, 246);

        this.doc.rect(15, 242, 45, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Valor: ', 118, 246, "center");

        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.blood_pressure.diastolic + ' mmHg', 125, 246);

        this.doc.setFontStyle("bold");
        this.doc.text('Percentil: ', 168, 246, "center");

        this.doc.rect(150, 242, 45, 6);
        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.blood_pressure.diastolic_percentile, 180, 246);

        /* Ponto de Corte de Taylor */
        this.doc.setFontStyle("bold");
        this.doc.text('Circunferência da Cintura:', 15, 256);

        this.doc.setFontStyle("normal");
        const taylor_cut_classification = this.translate.instant(this.taylorCutPipe.transform(evaluation.taylor_cut_point.classification));
        this.doc.text(taylor_cut_classification, 82, 256);
        this.doc.setDrawColor(220, 220, 220);
        this.doc.rect(15, 260, 180, 12);

        this.doc.setFontStyle("bold");
        this.doc.text('Parâmetros utilizados', CENTER_X, 264, "center");

        this.doc.rect(15, 266, 180, 6);
        this.doc.setFontStyle("bold");
        this.doc.text('Cintura: ', 98, 270, "center");

        this.doc.setFontStyle("normal");
        this.doc.text(evaluation.taylor_cut_point.waist_circumference + ' cm', 108, 270);

        this.doc.addPage('a4', 'portrait');
        /* RODAPÉ */
        this.addFooter();

        this.doc.setFontStyle("bold");
        this.doc.setFontSize(14);

        /* Orientações Nutricionais */
        this.doc.text('ORIENTAÇÕES NUTRICIONAIS', CENTER_X, 20, "center");

        let heigthCurrent = START_Y + 20;

        if (evaluation.counseling.definitive.bmi_whr && evaluation.counseling.definitive.bmi_whr.length) {

            /* Estado Nutricional */
            this.doc.setFontStyle("bold");
            this.doc.setFontSize(14);
            this.doc.text('ESTADO NUTRICIONAL', START_X, heigthCurrent);
            heigthCurrent += SPACING;
            this.doc.setFontStyle("normal");
            this.doc.setFontSize(11);

            evaluation.counseling.definitive.bmi_whr.forEach((counseling, index) => {
                if (heigthCurrent >= MAX_HEIGHT) {
                    this.doc.addPage('a4', "portrait");
                    this.addFooter();
                    heigthCurrent = START_Y;
                }
                const line = index + 1 + '. ' + counseling;
                this.doc.text(line, START_X, heigthCurrent, {align: "justify", maxWidth: MAX_WIDHT});
                const splitLine = this.doc.splitTextToSize(line, MAX_WIDHT);
                heigthCurrent += splitLine.length * SIMPLE_SPACING;
            });

        }

        if (evaluation.counseling.definitive.glycemia && evaluation.counseling.definitive.glycemia.length) {

            heigthCurrent += SPACING;

            /* RESISTÊNCIA À INSULINA/DIABETES */
            this.doc.setFontStyle("bold");
            this.doc.setFontSize(14);
            this.doc.text('RESISTÊNCIA À INSULINA/DIABETES', START_X, heigthCurrent);
            heigthCurrent += SPACING;
            this.doc.setFontStyle("normal");
            this.doc.setFontSize(11);

            evaluation.counseling.definitive.glycemia.forEach((counseling, index) => {
                if (heigthCurrent >= MAX_HEIGHT) {
                    this.doc.addPage('a4', "portrait");
                    this.addFooter();
                    heigthCurrent = START_Y;
                }
                const line = index + 1 + '. ' + counseling;
                this.doc.text(line, START_X, heigthCurrent, {align: "justify", maxWidth: MAX_WIDHT});
                const splitLine = this.doc.splitTextToSize(line, MAX_WIDHT);
                heigthCurrent += splitLine.length * SIMPLE_SPACING;
            });

        }

        if (evaluation.counseling.definitive.blood_pressure && evaluation.counseling.definitive.blood_pressure.length) {

            heigthCurrent += SPACING;

            /* HIPERTENSÃO */
            this.doc.setFontStyle("bold");
            this.doc.setFontSize(14);
            this.doc.text('HIPERTENSÃO', START_X, heigthCurrent);
            heigthCurrent += SPACING;
            this.doc.setFontStyle("normal");
            this.doc.setFontSize(11);

            evaluation.counseling.definitive.blood_pressure.forEach((counseling, index) => {
                if (heigthCurrent >= MAX_HEIGHT) {
                    this.doc.addPage('a4', "portrait");
                    this.addFooter();
                    heigthCurrent = START_Y;
                }
                const line = index + 1 + '. ' + counseling;
                this.doc.text(line, START_X, heigthCurrent, {align: "justify", maxWidth: MAX_WIDHT});
                const splitLine = this.doc.splitTextToSize(line, MAX_WIDHT);
                heigthCurrent += splitLine.length * SIMPLE_SPACING;
            });

        }

    }

    async exportPDF(evaluation: NutritionEvaluation, healthProfessional: string) {
        this.generatePDF(evaluation, healthProfessional);

        const patientName = evaluation.patient.name.split(' ').join("-");
        const simpleDate = evaluation.created_at.split('T')[0].split('-');

        this.doc.save(`Avaliacao-Nutricional-${patientName}-${simpleDate[2]}-${simpleDate[1]}-${simpleDate[0]}.pdf`);
    }

    getPDF(evaluation: NutritionEvaluation, healthProfessional: string): any {

        this.generatePDF(evaluation, healthProfessional);

        const pdfBase64 = this.doc.output("datauristring");

        return pdfBase64;
    }

    private addFooter() {
        /* RODAPÉ */
        this.doc.setDrawColor(0, 165, 148);
        this.doc.setFillColor(0, 165, 148);
        this.doc.rect(15, 280, 180, 1, 'F');
        this.doc.setFontStyle("normal");
        this.doc.setTextColor(159, 159, 159);
        this.doc.setFontSize(9);

        this.doc.text('RUA BARAÚNAS, 351 - BAIRRO UNIVERSITÁRIO', CENTER_X, 285, "center");
        this.doc.text('CAMPINA GRANDE-PB, CEP: 58429-500', CENTER_X, 288, "center");
        this.doc.text('NUTES@UEPB.EDU.BR', CENTER_X, 291, "center");
        this.doc.text('+55(83)3315-3336', CENTER_X, 294, "center");
        /* reset configurações*/
        this.doc.setTextColor(0, 0, 0);
        this.doc.setFontSize(12);
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
        return `${date_current.getFullYear() - birth_date.getFullYear()} anos`;
    }

}
