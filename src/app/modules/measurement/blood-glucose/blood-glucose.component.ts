import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as _ from 'lodash';

import { IMeasurement } from '../models/measurement';
import { GraphService } from 'app/shared/shared-services/graph.service';
import { DatePipe } from '@angular/common';
import { BloodGlucose, MealType } from '../models/blood-glucose';

@Component({
  selector: 'blood-glucose',
  templateUrl: './blood-glucose.component.html',
  styleUrls: ['./blood-glucose.component.scss']
})
export class BloodGlucoseComponent implements OnInit, OnChanges {

  @Input() data: Array<BloodGlucose>;

  lastData: IMeasurement;

  option = {

    tooltip: {
      trigger: 'item',
      formatter: "Glicose : {c} mg/dl<br> Data: {b}"
    },
    legend: {
      data: ['Pré-prandial', 'Pós-prandial', 'Jejum', 'Casual', 'Antes de dormir']
    },

    xAxis: [
      {
        type: 'category',
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value} mg/dl'
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
        name: 'Pré-prandial',
        type: 'bar',
        data: [],
        markPoint: {
          data: [
            { type: 'max', name: 'Máximo' },
            { type: 'min', name: 'Mínimo' }
          ]
        }
      },
      {
        name: 'Pós-prandial',
        type: 'bar',
        data: [],
        markPoint: {
          data: [
            { type: 'max', name: 'Máximo' },
            { type: 'min', name: 'Mínimo' }
          ]
        }
      },
      {
        name: 'Jejum',
        type: 'bar',
        data: [],
        markPoint: {
          data: [
            { type: 'max', name: 'Máximo' },
            { type: 'min', name: 'Mínimo' }
          ]
        }
      },
      {
        name: 'Casual',
        type: 'bar',
        data: [],
        markPoint: {
          data: [
            { type: 'max', name: 'Máximo' },
            { type: 'min', name: 'Mínimo' }
          ]
        }
      },
      {
        name: 'Antes de dormir',
        type: 'bar',
        data: [],
        markPoint: {
          data: [
            { type: 'max', name: 'Máximo' },
            { type: 'min', name: 'Mínimo' }
          ]
        }
      }
    ]
  };



  constructor(
    private datePipe: DatePipe,
    private graphService: GraphService
  ) {
    this.data = new Array<BloodGlucose>();
  }

  ngOnInit() {

  }

  loadGraph() {

    if (this.data.length > 0) {
      //Limpando o grafico
      this.option.xAxis[0].data = [];
      this.option.series[0].data = [];

      this.data.forEach((element: BloodGlucose) => {
        const find = this.option.xAxis[0].data.find((ele) => {
          return ele == this.datePipe.transform(element.timestamp, "shortDate");
        });

        if (!find) {
          this.option.xAxis[0].data.push(this.datePipe.transform(element.timestamp, "shortDate"));
        }
        switch (element.meal) {
          case MealType.preprandial:
            this.option.series[0].data.push(element.value);
            break;
          case MealType.postprandial:
            this.option.series[1].data.push(element.value);
            break;
          case MealType.fasting:
            this.option.series[2].data.push(element.value);
            break;
          case MealType.casual:
            this.option.series[3].data.push(element.value);
            break;
          case MealType.bedtime:
            this.option.series[4].data.push(element.value);
            break;
        }
      });

      if (this.data.length > 1) {
        this.lastData = this.data[this.data.length - 1];
      } else {
        this.lastData = this.data[0];
      }

      this.graphService.refreshGraph();
    }


  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data && changes.data.currentValue != undefined && changes.data.previousValue == undefined) {
      this.loadGraph();
    }
  }

}
