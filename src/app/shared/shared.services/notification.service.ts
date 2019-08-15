import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Email } from '../../modules/evaluation/models/email';
import { environment } from '../../../environments/environment';

@Injectable()
export class NotificationService {
    version: string;

    constructor(
        private http: HttpClient) {
        this.version = 'v1';
    }

    sendEmail(userId: string, notification: Email) {
        return this.http.post<any>(`${environment.api_url}/${this.version}/users/${userId}/emails`, notification)
            .toPromise();
    }

}
