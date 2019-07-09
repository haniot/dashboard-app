import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {NutritionEvaluation} from "../../modules/evaluation/models/nutrition-evaluation";
import {Attachments, NotificationEmail} from "../../modules/evaluation/models/notification-email";
import {environment} from "../../../environments/environment";
import {DatePipe} from "@angular/common";

@Injectable()
export class NotificationService {

    constructor(private http: HttpClient, private datePipe: DatePipe) {
    }

    sendNutritionalEvaluationViaEmail(healthProfessinal: { name: string, email: string },
                                      nutritonalEvaluation: NutritionEvaluation, filePDF: any) {

        const notification = new NotificationEmail();

        // notification.reply = {name: 'Adalcino Junior', email: 'adaljunior.inf@gmail.com'};

        notification.reply = {name: healthProfessinal.name, email: healthProfessinal.email};

        notification.to.push({name: 'Adalcino Junior', email: 'adaljunior.inf@gmail.com'});

        // notification.to.push({name: nutritonalEvaluation.patient.name, email: nutritonalEvaluation.patient.email});

        notification.subject = "Resultado da Avaliação Nutricional";

        notification.html = this.getHtml(nutritonalEvaluation.patient.name, healthProfessinal.name, nutritonalEvaluation.created_at);

        const attachment = new Attachments();

        attachment.path = filePDF;

        attachment.content_type = "application/pdf";

        notification.attachments.push(attachment);

        console.log(notification);

        return this.http.post<any>(`${environment.api_url}/users/${nutritonalEvaluation.patient.id}/emails`, notification)
            .toPromise();
    }

    getHtml(patientName: string, healthProfessionalName: string, dateEvaluation: string): string {

        const html = `<html> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> </head> <body> <header style="height: 10px; background: #00a594"></header> <div style="text-align: center"> <img src="https://haniot.nutes.uepb.edu.br/assets/img/logo-login-new.png" width="60"> <h1 style="color: #00a594;margin-top:0px">HANIoT</h1> </div><div style="width:100%;height:210px"> <h3 style="text-align: center;">Ola, ${patientName}!</h3> <p style="text-align: center;font-weight: normal;font-style: normal;font-size: 20px;">O resultado da sua avaliação nutricional, gerada ${this.datePipe.transform(dateEvaluation,"fullDate")}, encontra-se disponivel.</p><p style="text-align: center;font-weight: normal;font-style: normal;font-size: 20px;">Baixe o arquivo em formato PDF disponivel nos anexos deste email.</p><p style="text-align: center;font-weight: normal;font-style: normal;font-size: 20px;"> <small>Atenciosamente: ${healthProfessionalName}.</small> </p></div><footer style="background: #00a594; color:#fff;"> <small>HANIoT por NUTES/UEPB.</small> </footer> </body></html>`;

        return html;
    }
}
