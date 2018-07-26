import { Component, OnInit, Input, OnChanges } from '@angular/core';

import {MeasurementsFilterService} from '../../services/measurements-filter.service';

@Component({
  selector: 'app-temperature-graph',
  templateUrl: './temperature-graph.component.html',
  styleUrls: ['./temperature-graph.component.scss']
})
export class TemperatureGraphComponent implements OnChanges {

  constructor( public filterService : MeasurementsFilterService ) { }


  @Input() measurements;

  @Input() graphType; 

  option;

  /**
   * Data range picker settings
   */
  public daterange: any = {};

 // see original project for full list of options
 // can also be setup using the config service to apply to multiple pickers
 public options: any = {
     locale: { format: 'YYYY-MM-DD' },
     alwaysShowCalendars: false,
 };
  
  ngOnChanges(){
    this.init();
    this.setGraph();
  }
  

  init(){
    this.measurements = this.filterService.mapMeasurementsDataByTypeId(this.measurements, this.graphType);
  }



  getMeasurements(){
    console.log(this.measurements);
  }

  showMeasurementsData(){
    console.log(this.measurements);
  }

 
  
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
  }

}
