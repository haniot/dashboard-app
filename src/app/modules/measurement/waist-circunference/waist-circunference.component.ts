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
export class WaistCircunferenceComponent implements OnInit, OnChanges {

  @Input() data: Array<IMeasurement>;

  lastData: IMeasurement;

  option = {
    color: ['#3398DB'],
    tooltip: {
      formatter: "Circunferência : {c} cm <br> Data: {b}",
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: [
      {
        type: 'category',
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value} cm'
        }
      }
    ],
    dataZoom: [
      {
        type: 'slider'
      }
    ],
    series: [
      {
        type: 'bar',
        barWidth: '60%',
        color: '#00a594',
        data: [],
        markLine: {
          tooltip: {
            trigger: 'item',
            formatter: "Valor médio : {c} cm"
          },
          lineStyle: {
            color: 'black',
          },
          data: [
            { type: 'average', name: 'Média' }
          ]
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
    this.option.xAxis[0].data = [];
    this.option.series[0].data = [];

    this.data.forEach((element: IMeasurement) => {
      this.option.xAxis[0].data.push(this.datePipe.transform(element.timestamp, "shortDate"));
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

}
