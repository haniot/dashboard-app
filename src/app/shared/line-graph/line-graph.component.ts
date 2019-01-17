import { Component, OnChanges, Input } from '@angular/core';

import {Measurement} from '../../models/measurement';

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



  constructor(    
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
    
  }

  getMeasurementsByType(){
   
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


}
