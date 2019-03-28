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
    return this.healthService.getById(id)    
      .then(healthprofessional => {
        if(healthprofessional){
          localStorage.setItem('typeUser','HealthProfessional');
          return Promise.resolve(healthprofessional);
        }
        localStorage.setItem('typeUser','Admin');
        return this.adminService.getById(id);
      })
      .catch(httpError => {
        if(httpError.error.code == 404 && httpError.error.message == 'Health Professional not found!'){
          localStorage.setItem('typeUser','Admin');
          return this.adminService.getById(id);
        }else{
          console.log('| users.service | Não foi possível buscar usuário!', httpError);
        }      
      });
  }

  changePassword(userId: string, credentials :{old_password: string, new_password:string} ): Promise<boolean>{
    return this.http.patch<any>(`${environment.api_url}/users/${userId}/password`, credentials)
      .toPromise();
  }

}
