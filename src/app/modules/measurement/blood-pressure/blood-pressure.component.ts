import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as _ from 'lodash';

import { GraphService } from 'app/shared/shared-services/graph.service';
import { DatePipe } from '@angular/common';
import { BloodPressure } from '../models/blood-pressure';

@Component({
  selector: 'blood-pressure',
  templateUrl: './blood-pressure.component.html',
  styleUrls: ['./blood-pressure.component.scss']
})
export class BloodPressureComponent implements OnInit, OnChanges {

  @Input() data: Array<BloodPressure>;

  arrayDates: Array<any> = [];

  lastData: BloodPressure;

  lastIndex: number;

  option = {
    tooltip: {
      trigger: 'item',
      formatter: "Pressão : {c} mmHg<br>  Data: {b}"
    },
    legend: {
      data: ['Sistólica', 'Diastólica']
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} mmHg'
      }
    },
    series: [
      {
        name: "Sistólica",
        data: [120, 200, 180, 75, 99, 110, 120],
        type: 'line',
        symbol: 'circle',
        symbolSize: 20,
        lineStyle: {
          normal: {
            color: 'blue',
            width: 4,
            type: ''
          }
        },
        itemStyle: {
          normal: {
            borderWidth: 3,
            borderColor: 'white',
            color: 'blue'
          }
        }
      },
      {
        name: "Diastólica",
        data: [100, 150, 160, 80, 70, 145, 130],
        type: 'line',
        symbol: 'triangle',
        symbolSize: 20,
        lineStyle: {
          normal: {
            color: 'red',
            width: 4,
            type: 'solid'
          }
        },
        itemStyle: {
          normal: {
            borderWidth: 3,
            borderColor: 'white',
            color: 'red'
          }
        }
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
    this.option.xAxis.data = [];
    this.option.series[0].data = [];
    this.option.series[1].data = [];

    this.arrayDates = _.chunk(this.data, 500);

    this.lastIndex = 0;

    this.arrayDates[this.lastIndex].forEach((element: BloodPressure) => {
      const find = this.option.xAxis.data.find((ele) => {
        return ele == this.datePipe.transform(element.timestamp, "shortDate").substr(0, 5);
      });

      if (!find) {
        this.option.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate").substr(0, 5));
      }
      // Adicionando Sistólica
      this.option.series[0].data.push(element.systolic);

      // Adicionando Diastólica
      this.option.series[1].data.push(element.diastolic);
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
    this.option.xAxis.data = [];
    this.option.series[0].data = [];
    this.option.series[1].data = [];

    this.lastIndex--;
    this.arrayDates[this.lastIndex].forEach((element: BloodPressure) => {
      this.option.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate").substr(0, 5));
      // Adicionando Sistólica
      this.option.series[0].data.push(element.systolic);

      // Adicionando Diastólica
      this.option.series[1].data.push(element.diastolic);
    });

    this.graphService.refreshGraph();
  }

  next() {

    //Limpando o grafico
    this.option.xAxis.data = [];
    this.option.series[0].data = [];
    this.option.series[1].data = [];

    this.lastIndex++

    this.arrayDates[this.lastIndex].forEach((element: BloodPressure) => {
      this.option.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate").substr(0, 5));
      // Adicionando Sistólica
      this.option.series[0].data.push(element.systolic);

      // Adicionando Diastólica
      this.option.series[1].data.push(element.diastolic);
    });

    this.graphService.refreshGraph();
  }

}
