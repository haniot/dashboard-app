import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AdminService } from './admin.service';
import { HealthProfessionalService } from './health.professional.service';
import { PatientService } from '../../patient/services/patient.service'
import { Admin } from '../models/admin';
import { HealthProfessional } from '../models/health.professional';
import { AuthService } from '../../../security/auth/services/auth.service'
import { environment } from '../../../../environments/environment';
import { Patient } from '../../patient/models/patient'

@Injectable()
export class UserService {
    version: string;

    constructor(
        private http: HttpClient,
        private adminService: AdminService,
        private healthService: HealthProfessionalService,
        private patientService: PatientService,
        private authService: AuthService
    ) {
        this.version = 'v1'
    }

    removeUser(id: string): Promise<any> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/users/${id}`)
            .toPromise();
    }

    getUserById(id: string): Promise<any> {
        switch (this.getTypeUser()) {
            case 'admin':
                return this.adminService.getById(id);

            case 'health_professional':
                return this.healthService.getById(id);

            case 'patient':
                return this.patientService.getById(id);
        }

    }

    changePassword(body: { email: string, old_password: string, new_password: string }): Promise<boolean> {
        return this.http.patch<any>(`${environment.api_url}/${this.version}/auth/password`, body)
            .toPromise();
    }

    changeLanguage(userId: string, language: string): Promise<boolean> {
        let user;
        let service;
        switch (this.getTypeUser()) {
            case 'admin':
                user = new Admin(userId);
                user.language = language;
                service = this.adminService;
                break;

            case 'health_professional':
                user = new HealthProfessional(userId);
                user.language = language;
                service = this.healthService;
                break;
            case 'patient':
                user = new Patient(userId);
                user.language = language;
                service = this.patientService;
                break;
        }
        return service.update({ id: user.id, language: user.language })
            .then(userUpdated => {
                return !!userUpdated;
            })
            .catch(() => false);
    }

    changePilotStudySelected(userId: string, pilotStudyId: string): Promise<boolean> {
        let user;
        let service;
        switch (this.getTypeUser()) {
            case 'admin':
                user = new Admin('');
                user.id = userId;
                user.selected_pilot_study = pilotStudyId;
                service = this.adminService;
                break;

            case 'health_professional':
                user = new HealthProfessional('');
                user.id = userId;
                user.selected_pilot_study = pilotStudyId;
                service = this.healthService;
                break;
            case 'patient':
                user = new Patient('');
                user.id = userId;
                user.selected_pilot_study = pilotStudyId;
                service = this.patientService;
                break;
        }
        return service.update({ id: user.id, selected_pilot_study: user.selected_pilot_study })
            .then(userUpdated => {
                return !!userUpdated;
            })
            .catch(() => false);
    }

    getTypeUser(): string {
        return this.authService.decodeToken().sub_type;
    }

}
