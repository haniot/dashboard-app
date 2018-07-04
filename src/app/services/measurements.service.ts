import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import { environment } from 'environments/environment';

@Injectable()
export class MeasurementService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http
      .get(`${environment.api_url}/measurements`)
      .map(response => {
        return response;
      });
  }


  // postDiag():  Observable<any>{
  //   return this.http
  //     .post<any>(`http://192.168.92.70:33/diabetes`,{
  //       Pregancies:6,
  //       Glucose:148,
  //       BloodPressure:72,
  //       SkinThickness:35,
  //       Insulin:0,
  //       BMI:33.6,
  //       DiabetesPedigreeFunction:0.627,
  //       Age:50
  //     })
  //     .map(response => {
  //       console.log(response);
  //     });
  // }
}
