import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { IUser, Admin } from 'app/shared/shared-models/users.models';

const mockAdmins = 
[
  {
    "id": "5c895e3fd94f70df40517c46",
    "username": "DeckerGordon",
    "email": "deckergordon@perkle.com"
  },
  {
    "id": "5c895e3f7a193ba41fc17b55",
    "username": "MeadowsMorrow",
    "email": "meadowsmorrow@perkle.com"
  },
  {
    "id": "5c895e3fa4ae77991428a836",
    "username": "HoldenMiddleton",
    "email": "holdenmiddleton@perkle.com"
  },
  {
    "id": "5c895e3fb9876822d717c3ba",
    "username": "MatthewsSpears",
    "email": "matthewsspears@perkle.com"
  },
  {
    "id": "5c895e3f735885319e9f32d7",
    "username": "TameraLangley",
    "email": "tameralangley@perkle.com"
  },
  {
    "id": "5c895e3fdd959fd5ef237872",
    "username": "MeyersJacobs",
    "email": "meyersjacobs@perkle.com"
  }
];

@Injectable()
export class AdminService {

  constructor(private http: HttpClient) { }

  
  getById(id: string): Promise<any> {
    return Promise.resolve(mockAdmins.filter(element=>{
      return element.id == id;
    })[0]);
    // return this.http.get<any>(`${environment.api_url}/users/admins/${id}`)
    // .toPromise();
  }
  
  getAll(page?: number, limit?: number): Promise<IUser[]> {
    return Promise.resolve(mockAdmins);
    // let url = `${environment.api_url}/users/admins`;
    // if (page && limit) {
    //   url = `${environment.api_url}/users/admins&page=${page}&limit=${limit}&sort=created_a`;
    // }
    // return this.http.get<any>(url)
    // .toPromise();
  }
  
  create(administrator: Admin): Promise<boolean> {
    return this.http.post<any>(`${environment.api_url}/users/admins`, administrator)
      .toPromise();
  }

  update(administrator: Admin): Promise<boolean> {
    return this.http.patch<any>(`${environment.api_url}/users/admins/${administrator.id}`, administrator)
      .toPromise();
  }
}
