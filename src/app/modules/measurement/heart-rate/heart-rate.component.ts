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

  lastData: HeartRate;

  option = {
    title: {
      text: 'Histório de medições',
      subtext: 'O gráfico abaixo representa todos os valores captados em todas as medições realizadas'
    },
    tooltip: {
      formatter: "Frequência: {c} bpm <br> Data: {b}",
      trigger: 'axis'
    },
    xAxis: {
      data: []
    },
    yAxis: {
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value} bpm'
      }
    },
    dataZoom: [
      {
        type: 'slider'
      }
    ],
    series: [
      {
        type: 'line',
        data: []
      }
    ]
  };

  optionLastData = {
    title: {
      text: 'Última medição realizada',
      subtext: 'O gráfico abaixo representa todos os valores captados na última medição realizada'
    },
    tooltip: {
      formatter: "Frequência: {c} bpm <br> Data: {b}",
      trigger: 'axis'
    },
    xAxis: {
      data: []
    },
    yAxis: {
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value} bpm'
      }
    },
    dataZoom: [
      {
        type: 'slider'
      }
    ],
    series: [
      {
        type: 'line',
        data: []
      }
    ]
  };



  constructor(
    private datePipe: DatePipe,
    private graphService: GraphService
  ) {
    this.data = new Array<HeartRate>();
  }

  ngOnInit() {

  }

  loadGraph() {

    if (this.data.length > 0) {
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

          this.option.xAxis.data.push(this.datePipe.transform(date.timestamp, "shortDate"));

          this.option.series[0].data.push(date.value);

        });


      });

      if (this.data.length > 1) {
        this.lastData = this.data[this.data.length - 1];
      } else {
        this.lastData = this.data[0];
      }

      //Inserindo dados no gráfico da ultima medião
      //Limpando o grafico
      this.optionLastData.xAxis.data = [];
      this.optionLastData.series[0].data = [];

      this.lastData.dataset.forEach((date: { value: number, timestamp: string }) => {

        this.optionLastData.xAxis.data.push(this.datePipe.transform(date.timestamp, "shortDate"));

        this.optionLastData.series[0].data.push(date.value);

      });

      this.graphService.refreshGraph();
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data && changes.data.currentValue != undefined && changes.data.previousValue == undefined) {
      this.loadGraph();
    }
  }

}
