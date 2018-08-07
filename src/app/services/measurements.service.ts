import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import { environment } from 'environments/environment';

import {OutputDate} from '../models/output-date';



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

  getMeasurementsByUser(userId : string): Observable<any> {
    return this.http
      .get(`${environment.api_url}/measurements/users/${userId}`)
      .map(response => {
        return response;
      });
  }

  getMeasurementsByUserRangeDate(userId : string, selectedRangeDate : OutputDate ): Observable<any> {
    let requestQuery : string;
    if(selectedRangeDate.fromDate && selectedRangeDate.toDate ){
      const dateStart : string = `${selectedRangeDate.fromDate.year}-${selectedRangeDate.fromDate.month}-${selectedRangeDate.fromDate.day}`;
      const dateEnd : string = `${selectedRangeDate.toDate.year}-${selectedRangeDate.toDate.month}-${selectedRangeDate.toDate.day}`
      
      requestQuery = `${environment.api_url}/measurements/users/${userId}?dateStart=${dateStart}&dateEnd=${dateEnd}`
      
    }else{
      const dateStart : string = `${selectedRangeDate.fromDate.year}-${selectedRangeDate.fromDate.month}-${selectedRangeDate.fromDate.day}`;
      requestQuery = `${environment.api_url}/measurements/users/${userId}?dateStart=${dateStart}`
    }
    return this.http
      .get(requestQuery)
      .map(response => {
        return response;
      });
  }

  getMeasurementsByTypeAndRangeDate(userId : string, selectedRangeDate : OutputDate, measurementType : number, skip ?: number ): Observable<any> {
    let requestQuery : string;
    if(selectedRangeDate.fromDate && selectedRangeDate.toDate ){
      const dateStart : string = `${selectedRangeDate.fromDate.year}-${selectedRangeDate.fromDate.month}-${selectedRangeDate.fromDate.day}`;
      const dateEnd : string = `${selectedRangeDate.toDate.year}-${selectedRangeDate.toDate.month}-${selectedRangeDate.toDate.day}`
      
      requestQuery = `${environment.api_url}/measurements/types/${measurementType}/users/${userId}?dateStart=${dateStart}&dateEnd=${dateEnd}&skip=${(skip ? skip : 0)}`
      console.log(requestQuery);
    }else{
      const dateStart : string = `${selectedRangeDate.fromDate.year}-${selectedRangeDate.fromDate.month}-${selectedRangeDate.fromDate.day}`;
      requestQuery = `${environment.api_url}/measurements/types/${measurementType}/users/${userId}?dateStart=${dateStart}&skip=${(skip ? skip : 0)}`
    }
    return this.http
      .get(requestQuery)
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
