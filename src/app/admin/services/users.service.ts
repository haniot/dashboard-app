import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { IUser } from 'app/models/users';

@Injectable()
export class UserService {
  private TYPE_CARIGIVER: number = 2;
  private TYPE_ADMINISTRATOR: number = 1;

  constructor(private http: HttpClient) { }

  createCaregiver(caregiver: { name: string, email: string, password: string }): Promise<boolean> {
    return this.http.post<any>(`${environment.api_url}/users/caregiver`, caregiver)
      .toPromise();
  }

  getAllCaregiver(page?: number, limit?: number): Promise<IUser[]> {
    let url = `${environment.api_url}/users?type=${this.TYPE_CARIGIVER}`;
    if (page && limit) {
      url = `${environment.api_url}/users?type=${this.TYPE_CARIGIVER}&page=${page}&limit=${limit}&sort=created_a`;
    }
    return this.http.get<any>(url)
      .toPromise();
  }


  updateUser(user: IUser): Promise<boolean> {
    delete user.type;
    delete user.created_at
    return this.http.patch<any>(`${environment.api_url}/users/${user.id}`, user)
      .toPromise();
  }


  createAdministrator(administrator: { name: string, email: string, password: string }): Promise<boolean> {
    return this.http.post<any>(`${environment.api_url}/users/admin`, administrator)
      .toPromise();
  }

  getAllAdministrator(page?: number, limit?: number): Promise<IUser[]> {
    let url = `${environment.api_url}/users?type=${this.TYPE_ADMINISTRATOR}`;
    if (page && limit) {
      url = `${environment.api_url}/users?type=${this.TYPE_ADMINISTRATOR}&page=${page}&limit=${limit}&sort=created_a`;
    }
    return this.http.get<any>(url)
      .toPromise();
  }

  removeUser(id: string): Promise<any> {
    return this.http.delete<any>(`${environment.api_url}/users/${id}`)
      .toPromise();
  }

  getUserById(id: string): Promise<any> {
    return this.http.get<any>(`${environment.api_url}/users/${id}`)
      .toPromise();
  }

}
