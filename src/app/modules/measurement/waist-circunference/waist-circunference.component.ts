import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as _ from 'lodash';

import { IMeasurement } from '../models/measurement';
import { GraphService } from 'app/shared/shared-services/graph.service';
@Component({
  selector: 'waist-circunference',
  templateUrl: './waist-circunference.component.html',
  styleUrls: ['./waist-circunference.component.scss']
})
export class WaistCircunferenceComponent implements OnInit, OnChanges{

  @Input() data: Array<IMeasurement>;

  arrayDates: Array<any> = [];

  lastData: IMeasurement;

  lastIndex: number;

  option = {
    color: ['#3398DB'],
    tooltip : {
        formatter: "Circunferência : {c} cm <br> Data: {b}",
        trigger: 'axis',
        axisPointer : {            
            type : 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel: {
              formatter: '{value} cm'
            }
        }
    ],
    series : [
        {
            name:'Histórico de circunferencia da cintura',
            type:'bar',
            barWidth: '60%',
            data:[10, 52, 200, 334, 390, 330, 220]
        }
    ]
};


  constructor(
    private datePipe: DatePipe,
    private graphService: GraphService
  ) { }

  ngOnInit() {
    
  }

  loadGraph() {
    
    //Limpando o grafico
    this.option.xAxis[0].data = [];
    this.option.series[0].data = [];

    this.arrayDates = _.chunk(this.data, 7);

    this.lastIndex = 0;
    
      this.arrayDates[this.lastIndex].forEach((element: IMeasurement) => {
        this.option.xAxis[0].data.push(this.datePipe.transform(element.timestamp, "shortDate").substr(0, 5));
        this.option.series[0].data.push(element.value);
      });

    if (this.data.length > 1) {
      this.lastData = this.data[this.data.length - 1];
    } else {
      this.lastData = this.data[0];
    }

    this.graphService.refreshGraph();


  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data && changes.data.currentValue != undefined && changes.data.previousValue == undefined) {
      this.loadGraph();
    }
  }

  prev() {

    //Limpando o grafico
    this.option.xAxis[0].data = [];
    this.option.series[0].data = [];

    this.lastIndex--;
    this.arrayDates[this.lastIndex].forEach((element: IMeasurement) => {
      this.option.xAxis[0].data.push(this.datePipe.transform(element.timestamp, "shortDate").substr(0, 5));
      this.option.series[0].data.push(element.value);
    });

    this.graphService.refreshGraph();
  }

  next() {

    //Limpando o grafico
    this.option.xAxis[0].data = [];
    this.option.series[0].data = [];

    this.lastIndex++
    
    this.arrayDates[this.lastIndex].forEach((element: IMeasurement) => {
      this.option.xAxis[0].data.push(this.datePipe.transform(element.timestamp, "shortDate").substr(0, 5));
      this.option.series[0].data.push(element.value);
    });

   this.graphService.refreshGraph();
  }
}
