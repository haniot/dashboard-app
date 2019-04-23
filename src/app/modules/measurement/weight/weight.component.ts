import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as _ from 'lodash';

import { IMeasurement } from '../models/measurement';
import { GraphService } from 'app/shared/shared-services/graph.service';


@Component({
  selector: 'weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.scss']
})
export class WeightComponent implements OnInit, OnChanges {

  @Input() data: Array<IMeasurement>;

  lastData: IMeasurement;

  lastIndex: number;

  option = {
    tooltip: {
      formatter: "Peso: {c} Kg <br> Data: {b}"
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} kg'
      }
    },
    dataZoom: [
      {
        type: 'slider'
      }
    ],
    series: [{
      name: "Histórico de peso",
      data: [],
      type: 'line',
      symbol: 'circle',
      symbolSize: 20,
      lineStyle: {
        normal: {
          color: 'green',
          width: 4,
          type: 'dashed'
        }
      },
      itemStyle: {
        normal: {
          borderWidth: 3,
          borderColor: 'yellow',
          color: 'blue'
        }
      }
    }]
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

    this.lastIndex = 0;

    this.data.forEach((element: IMeasurement) => {
      this.option.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
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
