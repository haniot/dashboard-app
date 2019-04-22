import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as _ from 'lodash';

import { IMeasurement } from '../models/measurement';
import { GraphService } from 'app/shared/shared-services/graph.service';

@Component({
  selector: 'body-temperature',
  templateUrl: './body-temperature.component.html',
  styleUrls: ['./body-temperature.component.scss']
})
export class BodyTemperatureComponent implements OnInit, OnChanges {

  @Input() data: Array<IMeasurement>;

  arrayDates: Array<any> = [];

  lastData: IMeasurement;

  lastIndex: number;

  option = {
    tooltip: {
      formatter: "Temperatura: {c} °C <br> Data: {b}",
      trigger: 'axis'
    },  
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} °C'
      }
    },
    series: [
      {
        name: 'Histórico de temperatura',
        type: 'line',
        data: [],
        markPoint: {
          data: [
            { type: 'max', name: 'Maximo' },
            { type: 'min', name: 'Minimo' }
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
    this.option.xAxis.data = [];
    this.option.series[0].data = [];

    this.arrayDates = _.chunk(this.data, 7);

    this.lastIndex = 0;

    this.arrayDates[this.lastIndex].forEach((element: IMeasurement) => {
      this.option.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate").substr(0, 5));
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
    this.option.xAxis.data = [];
    this.option.series[0].data = [];

    this.lastIndex--;
    this.arrayDates[this.lastIndex].forEach((element: IMeasurement) => {
      this.option.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate").substr(0, 5));
      this.option.series[0].data.push(element.value);
    });

    this.graphService.refreshGraph();
  }

  next() {

    //Limpando o grafico
    this.option.xAxis.data = [];
    this.option.series[0].data = [];

    this.lastIndex++

    this.arrayDates[this.lastIndex].forEach((element: IMeasurement) => {
      this.option.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate").substr(0, 5));
      this.option.series[0].data.push(element.value);
    });

    this.graphService.refreshGraph();
  }

}
