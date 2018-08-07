import { Component, OnChanges, Input } from '@angular/core';

import {MeasurementsFilterService} from '../../services/measurements-filter.service';

import {Measurement} from '../../models/measurement';

import {MeasurementService} from '../../services/measurements.service';

@Component({
  selector: 'line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.scss']
})
export class LineGraphComponent implements OnChanges {

  option;

  //@Input() measurements;

  measurements : Array<Measurement>;

  @Input() measurementType;

  @Input() date;

  @Input() userId;

  /**
   * Pagination 
   */

   currentBegin : number = 0;
   currentEnd : number = 10

   totalLength : number = 10;

   skipValue : number = 0;



  constructor( public filterService : MeasurementsFilterService,
               public measurementService : MeasurementService      
    ) { }

  ngOnChanges(){

    //this.init();
    //this.setGraph();
    this.getMeasurementsByType();
    this.currentBegin = 0;
    this.currentEnd = 10; 
  }
  

  init(){
    /**
     * Map the measurements to get only the specified type
     */
    this.measurements = this.filterService.mapMeasurementsDataByTypeId(this.measurements, this.measurementType);
    console.log(this.measurements);
  }

  getMeasurementsByType(){
    this.measurementService
    .getMeasurementsByTypeAndRangeDate(this.userId, this.date, this.measurementType, this.skipValue)
    .subscribe(res=>{ 
      this.totalLength = res.measurements.length;
      this.measurements = res.measurements;
      this.setGraphV2(res.measurements);
    }, err=>{
      console.log(err);
    })
  }
  /*
  setGraph(){
    
    this.filterService.getGraphData(this.measurements)
    .then(graphData=>{
        this.option = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
              type: 'category',
              data: graphData.dataXaxis 
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: graphData.seriesChart,
              type: 'line'
          }]
        };
      
    })
    .catch(err=>{
      this.option = undefined;
    });
  }*/

  setGraphV2( measurementsArr: Array<Measurement>){
    /**
     * Melhorar função para passar a quantidade (ou intervalo) de registro que se deseja como retorno
     * Isso funcionará para paginação do gráfico
     */
    this.filterService.getGraphData(measurementsArr, this.currentBegin, this.currentEnd )
    .then(graphData=>{
        this.option = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
              type: 'category',
              data: graphData.dataXaxis 
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: graphData.seriesChart,
              type: 'line'
          }]
        };
      
    })
    .catch(err=>{
      this.option = undefined;
    });
  }

  next(){

    /**
     * Se houver 100 ou mais deve-se requisitar mais dados usando a paginação
     * query skip
     * Primeiro if verifica a necessidade de paginação buscando mais dados do servidor
     */
   
      if(this.currentBegin>=this.measurements.length && this.measurements.length>=100){
        this.skipValue += 100; 
        this.ngOnChanges();
      }else{
        this.currentBegin += 10;
        this.currentEnd +=10;
        this.setGraphV2(this.measurements);
      }

  }
  back(){
    
    if(this.currentBegin<=0 && this.skipValue>0){
      this.skipValue -= 100; 
      this.ngOnChanges();
    }else{
      this.currentBegin -= 10;
      this.currentEnd -=10;
      this.setGraphV2(this.measurements);
    }
    

  }

}
