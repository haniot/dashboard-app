import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as _ from 'lodash';

import { IMeasurement } from '../models/measurement';
import { GraphService } from 'app/shared/shared-services/graph.service';
import { DatePipe } from '@angular/common';
import { HeartRate } from '../models/heart-rate';

@Component({
  selector: 'heart-rate',
  templateUrl: './heart-rate.component.html',
  styleUrls: ['./heart-rate.component.scss']
})
export class HeartRateComponent implements OnInit {

  @Input() data: Array<HeartRate>;


  option = {
    tooltip: {
      formatter: "Frequência: {c} bpm <br> Data: {b}",
      trigger: 'axis'
    },
    xAxis: {
      data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
    },
    yAxis: {
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value} bpm'
      }
    },
    dataZoom: [{
      startValue: '2014-06-01'
    }, {
      type: 'inside'
    }],
    series: [
      {
        type: 'line',
        data: [10, 20, 30, 40, 50, 60, 70]
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

    this.data.forEach((heartRate) => {

      heartRate.dataset.forEach((date: { value: number, timestamp: string }) => {
        // const find = this.option.xAxis.data.find((ele) => {
        //   return ele == this.datePipe.transform(date.timestamp, "shortDate").substr(0, 5);
        // });

        // if (!find) {
        //   this.option.xAxis.data.push(this.datePipe.transform(date.timestamp, "shortDate").substr(0, 5));
        // }

        this.option.xAxis.data.push(this.datePipe.transform(date.timestamp, "shortDate").substr(0, 5));

        this.option.series[0].data.push(date.value);

      });

    });

    this.graphService.refreshGraph();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data && changes.data.currentValue != undefined && changes.data.previousValue == undefined) {
      this.loadGraph();
    }
  }

}
