import { Component, OnChanges, Input } from '@angular/core';

import {MeasurementsFilterService} from '../../services/measurements-filter.service';

@Component({
  selector: 'line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.scss']
})
export class LineGraphComponent implements OnChanges {

  option;

  @Input() measurements;

  @Input() measurementType;


  constructor( public filterService : MeasurementsFilterService ) { }

  ngOnChanges(){
    this.init();
    this.setGraph();
  }
  

  init(){
    /**
     * Map the measurements to get only the specified type
     */
    this.measurements = this.filterService.mapMeasurementsDataByTypeId(this.measurements, this.measurementType);
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
