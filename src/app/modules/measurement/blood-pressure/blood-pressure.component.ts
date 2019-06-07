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

  lastData: BloodPressure;

  option = {
    tooltip: {
      trigger: 'item',
      formatter: "Pressão : {c} mmHg<br>  Data: {b}"
    },
    legend: {
      data: ['Sistólica', 'Diastólica', "Pulso"]
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} mmHg'
      }
    },
    dataZoom: [
      {
        type: 'slider'
      }
    ],
    series: [
      {
        name: "Sistólica",
        data: [],
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
        data: [],
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
      },
      {
        name: "Pulso",
        data: [],
        type: 'line',
        symbol: 'line',
        symbolSize: 20,
        lineStyle: {
          normal: {
            color: 'black',
            width: 4,
            type: 'solid'
          }
        },
        itemStyle: {
          normal: {
            borderWidth: 3,
            borderColor: 'white',
            color: 'black'
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

    this.data.forEach((element: BloodPressure) => {
      const find = this.option.xAxis.data.find((ele) => {
        return ele == this.datePipe.transform(element.timestamp, "shortDate");
      });

      if (!find) {
        this.option.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
      }
      // Adicionando Sistólica
      this.option.series[0].data.push(element.systolic);

      // Adicionando Diastólica
      this.option.series[1].data.push(element.diastolic);

      // Adicionando Pulso
      this.option.series[2].data.push(element.pulse);
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

}
