import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NotificationEmail } from '../../modules/evaluation/models/notification-email';
import { environment } from '../../../environments/environment';

@Injectable()
export class NotificationService {

    constructor(
        private http: HttpClient) {
    }

    sendEmail(userId: string, notification: NotificationEmail) {
        return this.http.post<any>(`${environment.api_url}/users/${userId}/emails`, notification)
            .toPromise();
    }

}
