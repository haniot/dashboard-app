import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-temperature-graph',
  templateUrl: './temperature-graph.component.html',
  styleUrls: ['./temperature-graph.component.scss']
})
export class TemperatureGraphComponent implements OnInit {

  @Input() measurements = [];

  /**
   * Dara range picker settings
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

startDate : Date;
endDate : Date;

  constructor() { }

  ngOnInit() {
  }

  update(){
    console.log("A");
    this.option.series = [{
      data : [40, 50, 60, 70, 80, 90, 100],
      type : 'line'
    }]



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
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return a.registrationDate -  b.registrationDate;
    });
  }

  dataXaxis = [];
  seriesChart = [];
  getResult(){
    
    this.result.forEach(element => {
      this.dataXaxis.push(new Date(element.registrationDate).getDate().toString() +"/"+ (new Date(element.registrationDate).getMonth() + 1).toString()  );
      this.seriesChart.push(element.value.toFixed(1));



      console.log(new Date(element.registrationDate))
    });
  }



  setChart(){
    this.option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
          type: 'category',
          data: this.dataXaxis
      },
      yAxis: {
          type: 'value'
      },
      series: [{
        data : this.seriesChart,
        type : 'line'
      }]
    };
  }


  changeChart(){
    this.seriesChart = this.seriesChart.map(e=>{
      return 0;
    })
  }


  /*
    Data range picker function
  */ 

 

 public selectedDate(value: any, datepicker?: any) {
     // this is the date the iser selected
     console.log(value);

     // any object can be passed to the selected event and it will be passed back here
     datepicker.start = value.start;
     datepicker.end = value.end;

     // or manupulat your own internal property
     this.daterange.start = value.start;
     this.daterange.end = value.end;
     this.daterange.label = value.label;
 }
  


}
