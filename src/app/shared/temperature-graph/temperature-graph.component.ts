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
  
  ngOnChanges(){
    this.init();
    this.setGraph();
  }
  

  init(){
    this.measurements = this.filterService.mapMeasurementsDataByTypeId(this.measurements, this.graphType);
    console.log(this.measurements);
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
