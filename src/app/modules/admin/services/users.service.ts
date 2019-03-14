import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { AdminService } from './admin.service';
import { HealthProfessionalService } from './health-professional.service';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private adminService: AdminService,
    private healthService: HealthProfessionalService
  ) { }

  removeUser(id: string): Promise<any> {
    return this.http.delete<any>(`${environment.api_url}/users/${id}`)
      .toPromise();
  }

  getUserById(id: string): Promise<any> {
    return this.adminService.getById(id)
      .then(admin => {
        if(admin){
          return Promise.resolve(admin);
        }
        return this.healthService.getById(id);
      })
      .catch(error => {
        console.log('| users.service | Não foi possível buscar usuário!', error);        
      });
  }

}
