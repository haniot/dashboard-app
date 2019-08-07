import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import Mustache from 'mustache';

import { NutritionEvaluation } from '../models/nutrition-evaluation';
import { Attachments, NotificationEmail } from '../models/notification-email';
import { NotificationService } from '../../../shared/shared.services/notification.service';

@Injectable()
export class SendEmailService {

    constructor(
        private http: HttpClient,
        private datePipe: DatePipe,
        private notificationService: NotificationService) {
    }

    async sendNutritionalEvaluationViaEmail(healthProfessinal: { name: string, email: string },
                                            nutritonalEvaluation: NutritionEvaluation, filePDF: any) {

        const notification = new NotificationEmail();

        notification.reply = { name: healthProfessinal.name, email: healthProfessinal.email };

        notification.to.push({ name: nutritonalEvaluation.patient.name, email: nutritonalEvaluation.patient.email });

        notification.subject = 'Resultado da Avaliação Nutricional';

        notification.html = await this.getHtml(nutritonalEvaluation.patient.name, healthProfessinal.name, nutritonalEvaluation.created_at);

        const attachment = new Attachments();

        const patientName = nutritonalEvaluation.patient.name.split(' ').join('-');
        const simpleDate = nutritonalEvaluation.created_at.split('T')[0].split('-');

        attachment.filename = `Avaliacao-Nutricional-${patientName}-${simpleDate[2]}-${simpleDate[1]}-${simpleDate[0]}.pdf`;

        attachment.path = filePDF;

        attachment.content_type = 'application/pdf';

        notification.attachments.push(attachment);

        return this.notificationService.sendEmail(nutritonalEvaluation.patient.id, notification);
    }

    getHtml(patientName: string, healthProfessionalName: string, dateEvaluation: string): Promise<string> {

        const variables = {
            patientName,
            healthProfessionalName,
            dateEvaluation: this.datePipe.transform(dateEvaluation, 'fullDate')
        };

        return this.http.get('assets/html/email-template.html', { responseType: 'text' })
            .toPromise()
            .then(data => {
                const html_output = Mustache.render(data, variables);
                return html_output;
            })
    }
}
