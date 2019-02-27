import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { IUser } from 'app/models/users';

@Injectable()
export class CaregiverService {
  private TYPE_CARIGIVER: number = 2;
  constructor(private http: HttpClient) { }

  create(caregiver: { name: string, email: string, password: string }): Promise<boolean> {
    return this.http.post<any>(`${environment.api_url}/users/caregiver`, caregiver)
      .toPromise()
      .then((user) => {
        return true;
      })
      .catch(error => {
        return false;
      });
  }

  getAll(): Promise<IUser[]> {
    
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
}
