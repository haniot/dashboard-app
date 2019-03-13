import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { HealthProfessional } from '../models/users.models';

const mockHealthProfessionals: Array<HealthProfessional> = 
  [
    {
      "id": "5c89524ba32269168186ef21",
      "username": "ClayHorton",
      "name": "Ina Barrett",
      "health_area": "NUTRITION",
      "email": "inabarrett@codax.com"
    },
    {
      "id": "5c89524b13e6bff14540e2b6",
      "username": "SheliaCline",
      "name": "Edith Washington",
      "health_area": "NUTRITION",
      "email": "edithwashington@codax.com"
    },
    {
      "id": "5c89524b131e516074e1d83c",
      "username": "DanielRuiz",
      "name": "Tanya Patrick",
      "health_area": "NUTRITION",
      "email": "tanyapatrick@codax.com"
    },
    {
      "id": "5c89524b97c19aa797b98a50",
      "username": "JosieMorse",
      "name": "Lauri Dominguez",
      "health_area": "DENTISTRY",
      "email": "lauridominguez@codax.com"
    },
    {
      "id": "5c6c51f345720b002abdb21f",
      "username": "VillarrealKennedy",
      "name": "Delores Roth",
      "health_area": "DENTISTRY",
      "email": "deloresroth@codax.com"
    }
  ]

@Injectable()

export class HealthProfessionalService {

  constructor(private http: HttpClient) { }


  getById(id: string): Promise<any> {
    return Promise.resolve(mockHealthProfessionals.filter(element=>{
      return element.id == id;
    })[0]);
    // return this.http.get<any>(`${environment.api_url}/users/healthprofessionals/${id}`)
    //   .toPromise();
  }

  getAll(page?: number, limit?: number): Promise<HealthProfessional[]> {
     
    return Promise.resolve(mockHealthProfessionals);
    // let url = `${environment.api_url}/users/healthprofessionals`;
    // if (page && limit) {
    //   url = `${environment.api_url}/users/healthprofessionals&page=${page}&limit=${limit}&sort=created_a`;
    // }
    // return this.http.get<any>(url)
    //   .toPromise();
  }

  create(healthprofessionals: HealthProfessional): Promise<boolean> {
    return this.http.post<any>(`${environment.api_url}/users/healthprofessionals`, healthprofessionals)
      .toPromise();
  }

  remove(id: string): Promise<any> {
    return this.http.delete<any>(`${environment.api_url}/users/healthprofessionals/${id}`)
      .toPromise();
  }

  update(healthprofessionals: HealthProfessional): Promise<boolean> {
    return this.http.post<any>(`${environment.api_url}/users/healthprofessionals`, healthprofessionals)
      .toPromise();
  }
}
