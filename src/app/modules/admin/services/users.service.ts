import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { AdminService } from './admin.service';
import { HealthProfessionalService } from './health.professional.service';
import { AuthService } from 'app/security/auth/services/auth.service';
import { PatientService } from '../../patient/services/patient.service'

@Injectable()
export class UserService {

    constructor(
        private http: HttpClient,
        private adminService: AdminService,
        private healthService: HealthProfessionalService,
        private patientService: PatientService,
        private authService: AuthService
    ) {
    }

    removeUser(id: string): Promise<any> {
        return this.http.delete<any>(`${environment.api_url}/users/${id}`)
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
        return this.http.patch<any>(`${environment.api_url}/auth/password`, body)
            .toPromise();
    }

    changeLanguage(userId: string, language: string): Promise<boolean> {
        /* TODO: Realizar request na rota de alterar profile do usuário e salvar o novo idioma favorito
        *return this.http.patch<any>(`${environment.api_url}/users/${userId}/password`, credentials)
            .toPromise();
        */
        return Promise.resolve(false);
    }

    getTypeUser(): string {
        return this.authService.decodeToken().sub_type;
    }

}
