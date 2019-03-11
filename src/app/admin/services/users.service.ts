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

  getAllCaregiver(): Promise<IUser[]> {
    
    return this.http.get<any>(`${environment.api_url}/users`)
      .toPromise()
      .then(users => {
        
        if(users && users.length) {
          return users.filter(user => {
              return user.type === this.TYPE_CARIGIVER;  
          });
        }             
      })
      .catch(error => {
        return null;
      });
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

  getAllAdministrator(): Promise<IUser[]> {
    
    return this.http.get<any>(`${environment.api_url}/users`)
      .toPromise()
      .then(users => {
        
        if(users && users.length) {
          return users.filter(user => {
              return user.type === this.TYPE_ADMINISTRATOR;  
          });
        }             
      })
      .catch(error => {
        return null;
      });
  }

  removeUser(id:string): Promise<any> {    
    return this.http.delete<any>(`${environment.api_url}/users/${id}`)
      .toPromise();      
  }

  getUserById(id:string): Promise<any> {    
    return this.http.get<any>(`${environment.api_url}/users/${id}`)
      .toPromise();      
  }

}
