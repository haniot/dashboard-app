import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;
import { MeasurementService } from '../../services/measurements.service';
import { count } from 'rxjs/operators';

import * as _ from "lodash";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  measurements;

  dataArr = []

  result = []

  option = {
    title: {
      text: 'Parâmetros',
      subtext: 'teste'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Medidas', 'Altura']
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: ['1dado', '2dado', '3dado', '4dado', '5dado', '6dado', '7dado', '8dado', '9dado', '10dado', '11dado', '12dado']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Medidas',
        type: 'bar',
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        markPoint: {
          data: [
            { type: 'max', name: 'Nome1' },
            { type: 'min', name: 'Nome2' }
          ]
        },
        markLine: {
          data: [
            { type: 'average', name: 'Marcador' }
          ]
        }
      },
      {
        name: 'Altura',
        type: 'bar',
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        markPoint: {
          data: [
            { name: 'Erro1', value: 182.2, xAxis: 7, yAxis: 183 },
            { name: 'Erro2', value: 2.3, xAxis: 11, yAxis: 3 }
          ]
        },
        markLine: {
          data: [
            { type: 'average', name: 'O que é' }
          ]
        }
      }
    ]
  };

  option2 = {
    title: {
      text: 'Medidas',
      subtext: 'teste'
    },
    angleAxis: {
      type: 'category',
      data: ['dado1', 'dado2', 'dado3', 'dado4', 'dado5', 'dado6', 'dado7'],
      z: 10
    },
    radiusAxis: {
    },
    polar: {
    },
    series: [{
      type: 'bar',
      data: [1, 2, 3, 4, 3, 5, 1],
      coordinateSystem: 'polar',
      name: 'A',
      stack: 'a'
    }, {
      type: 'bar',
      data: [2, 4, 6, 1, 3, 2, 1],
      coordinateSystem: 'polar',
      name: 'B',
      stack: 'a'
    }, {
      type: 'bar',
      data: [1, 2, 3, 4, 1, 2, 5],
      coordinateSystem: 'polar',
      name: 'C',
      stack: 'a'
    }],
    legend: {
      show: true,
      data: ['A', 'B', 'C']
    }
  };

  option3 = {
    backgroundColor: '#2c343c',

    title: {
      text: 'Pizza Customizada',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },

    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series: [
      {
        name: 'E esse?',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: this.dataArr.sort(function (a, b) { return a.value - b.value; }),
        roseType: 'radius',
        label: {
          normal: {
            textStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          }
        },
        itemStyle: {
          normal: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },

        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  };

  option4 = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    series: [
      {
        name: 'Medida',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],

        label: {
          normal: {
            position: 'inner'
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: this.result
      },
      {
        name: 'Medida',
        type: 'pie',
        radius: ['40%', '55%'],
        label: {
          normal: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            backgroundColor: '#eee',
            borderColor: '#aaa',
            borderWidth: 1,
            borderRadius: 4,
            shadowBlur: 3,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            shadowColor: '#999',
            padding: [0, 7],
            rich: {
              a: {
                color: '#999',
                lineHeight: 22,
                align: 'center'
              },
              hr: {
                borderColor: '#aaa',
                width: '100%',
                borderWidth: 0.5,
                height: 0
              },
              b: {
                fontSize: 16,
                lineHeight: 33
              },
              per: {
                color: '#eee',
                backgroundColor: '#334455',
                padding: [2, 4],
                borderRadius: 2
              }
            }
          }
        },
        data: this.result
      }
    ]
  };


  constructor(public measurementService: MeasurementService) { 


    
  }

  renderData() {
    var arrayTest = []
    this.measurementService.getAll().subscribe((measurements) => {
      this.measurements = measurements.measurements;

      for (var teste in this.measurements) {
        this.dataArr.push({ value: this.measurements[teste].value, name: this.measurements[teste].unit });
      }

      _(this.dataArr)
        .groupBy(x => x.name)
        .toArray()
        .forEach(n => {
          let ne = n.map(m => m.name)
          let soma = n.map(m => m.value)
          arrayTest.push({ name: _.uniq(ne), value: _.sum(soma) })
        })
    });

    console.log("oi",arrayTest)
  }

  ngOnInit() {
    this.renderData()
    console.log(this.result)
  }
}
