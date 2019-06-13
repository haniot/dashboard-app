import {Injectable} from '@angular/core';
import {Patient} from "../../modules/patient/models/patient";
import {NutritionEvaluation} from "../../modules/evaluation/models/nutrition-evaluation";
import {NotificationEmail} from "../../modules/evaluation/models/notification-email";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private http: HttpClient) {
    }

    sendNutritionalEvaluationViaEmail(patient: Patient, nutritonalEvaluation: NutritionEvaluation): Promise<boolean> {
        const notification = new NotificationEmail();

        notification.reply = {name: 'NOME DO PROFISSIONAL', email: 'EMAIL DO PROFISSIONAL'};
        notification.to.push({name: patient.name, email: patient.email});

        return Promise.reject(true);
        // return this.http.post<any>
        //     (`${environment.api_url}/notification`, body)
        //     .toPromise();
    }
}
