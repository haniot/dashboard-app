import { Component, OnInit, Input } from '@angular/core';

import {MeasurementsFilterService} from '../../services/measurements-filter.service';

import {OutputDate} from '../../models/output-date';

@Component({
  selector: 'app-temperature-graph',
  templateUrl: './temperature-graph.component.html',
  styleUrls: ['./temperature-graph.component.scss']
})
export class TemperatureGraphComponent implements OnInit {

  constructor( public filterService : MeasurementsFilterService ) { }


  @Input() measurements = [];

  @Input() inputRangeDate: OutputDate;

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

  option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [19, 30, 23, 30, 31, 28, 29],
        type: 'line'
    }]
};
  
  ngOnInit() {
    this.init();
  }

  init(){

    console.log('newmeasurements');
    console.log(this.measurements);
    this.measurements = this.filterService.sortByDate(this.measurements);
    console.log(this.measurements);
  }

  filterByDateRange(){
    console.log(this.inputRangeDate);
    console.log(this.filterService.filterByDateRange(this.measurements, this.inputRangeDate));
  }

  update(){
    this.option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
          type: 'category',
          data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
        data : [40, 50, 60, 70, 80, 90, 100],
        type : 'line'
      }]
    };
  }

  showMeasurementsData(){
    console.log(this.measurements);
  }

  //option to sort the array by data
  result = [];
  sort(){
    this.result = this.measurements.sort(function(a,b){
      return a.registrationDate -  b.registrationDate;
    });
  }

  dataXaxis = [];
  seriesChart = [];
  getResult(){
    
    this.result.forEach(element => {
      this.dataXaxis.push(new Date(element.registrationDate).getDate().toString() +"/"+ (new Date(element.registrationDate).getMonth() + 1).toString()  );
      this.seriesChart.push(element.value.toFixed(1));
    });
  }

  getRangeDate(){
    console.log(this.inputRangeDate);
  }

}
