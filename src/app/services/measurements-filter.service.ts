import { Injectable } from '@angular/core';
import { OutputDate } from '../models/output-date';

@Injectable()
export class MeasurementsFilterService {

  constructor() { }


  sortByDate( arrMeasurements : Array<any> ): Array<any>{
    return arrMeasurements.sort(function(a,b){
      return a.registrationDate -  b.registrationDate;
    });
  }

  filterByDateRange(arrMeasurements : Array<any>, selectedRange : OutputDate){
    const from : Date = new Date(selectedRange.fromDate.year, selectedRange.fromDate.month, selectedRange.fromDate.day);
    const toDate : Date = new Date(selectedRange.toDate.year, selectedRange.toDate.month, selectedRange.toDate.day);
    console.log('FROM-TODATE');
    console.log(arrMeasurements.length);
    console.log(from);
    console.log(toDate);
    return arrMeasurements.map(m=>{
      console.log('newDate');
      console.log(new Date(m.registrationDate));
      return new Date(m.registrationDate) >= from && new Date(m.registrationDate) <= toDate;   
    });
  }
}
