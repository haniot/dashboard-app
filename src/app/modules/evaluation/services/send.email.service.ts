import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import Mustache from 'mustache';

import { NutritionEvaluation } from '../models/nutrition-evaluation';
import { Attachments, Email } from '../models/email';
import { NotificationService } from '../../../shared/shared.services/notification.service';
import { Patient } from '../../patient/models/patient'

@Injectable()
export class SendEmailService {

    constructor(
        private http: HttpClient,
        private datePipe: DatePipe,
        private notificationService: NotificationService) {
    }

    async sendNutritionalEvaluationViaEmail(healthProfessional: { name: string, email: string },
                                            patient: Patient,
                                            nutritonalEvaluation: NutritionEvaluation, filePDF: any) {

        const notification = new Email();

        notification.reply = { name: healthProfessional.name, email: healthProfessional.email };

        notification.to.push({ name: patient.name, email: patient.email });

        notification.subject = 'Resultado da Avaliação Nutricional';

        notification.html = await this.getHtml(nutritonalEvaluation.patient.name, healthProfessional, nutritonalEvaluation.created_at);

        const attachment = new Attachments();

        const patientName = nutritonalEvaluation.patient.name.split(' ').join('-');
        const simpleDate = nutritonalEvaluation.created_at.split('T')[0].split('-');

        attachment.filename = `Avaliacao-Nutricional-${patientName}-${simpleDate[2]}-${simpleDate[1]}-${simpleDate[0]}.pdf`;

        attachment.path = filePDF;

        attachment.content_type = 'application/pdf';

        notification.attachments.push(attachment);

        return this.notificationService.sendEmail(nutritonalEvaluation.patient.id, notification);
    }

    getHtml(patientName: string, healthProfessional: any, dateEvaluation: string): Promise<string> {

        const variables = {
            patientName,
            dateEvaluation: this.datePipe.transform(dateEvaluation, 'longDate'),
            healthProfessionalEmail: healthProfessional.email,
            healthProfessionalPhoneNumber: healthProfessional.phone_number,
            healthProfessionalName: healthProfessional.name
        };

        return this.http.get('assets/html/evaluation.html', { responseType: 'text' })
            .toPromise()
            .then(data => {
                const htmlOutput = Mustache.render(data, variables);
                return htmlOutput;
            })
            .catch(() => {
            })
    }
}
