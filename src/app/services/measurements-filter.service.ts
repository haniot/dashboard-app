import { Injectable } from '@angular/core';
import { OutputDate } from '../models/output-date';

import {GraphData} from '../models/graph-date';

@Injectable()
export class MeasurementsFilterService {

  constructor() { }


  sortByDate( arrMeasurements : Array<any> ): Array<any>{
    return arrMeasurements.sort(function(a,b){
      return a.registrationDate -  b.registrationDate;
    });
  }

  /*filterByDateRange(arrMeasurements : Array<any>, selectedRange : OutputDate){
    
    const from : Date = new Date(selectedRange.fromDate.year, selectedRange.fromDate.month, selectedRange.fromDate.day);
    const toDate : Date = new Date(selectedRange.toDate.year, selectedRange.toDate.month, selectedRange.toDate.day);
    
    return arrMeasurements.map(m=>{
      console.log('newDate');
      console.log(new Date(m.registrationDate));
      return new Date(m.registrationDate) >= from && new Date(m.registrationDate) <= toDate;   
    });
  }
  */
/**
 * 
 * @param measurementsArr the measurements 
 * @param id measurement type
 * returns an array of measurements by typeId
 */
  mapMeasurementsDataByTypeId(measurementsArr, id:number):Array<any>{
      return measurementsArr.measurements.filter(measurement=>{
        return measurement.typeId == id;
      });
  }

  getGraphData(measurementsArr) : Promise<GraphData>{
    return new Promise((resolve, reject)=>{
      const dataXaxis = [];
      const seriesChart = [];
      if(measurementsArr.length===0){
        return reject({dataXaxis : [], seriesChart : []});
      }
      measurementsArr.forEach(element => {
        dataXaxis.push(new Date(element.registrationDate).getDate().toString() +"/"+ (new Date(element.registrationDate).getMonth() + 1).toString()  );
        seriesChart.push(element.value.toFixed(1));
        if(dataXaxis.length === measurementsArr.length){
          return resolve( {dataXaxis : dataXaxis, seriesChart : seriesChart})
        }
      });
    })
  }  

}
