import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;
import { MeasurementService } from '../../services/measurements.service';
import {UsersService} from '../../services/users.service';
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
        data: [
          { value: [10, 10, 10, 10, 10].reduce((a, n) => n += a), name: "°C" },
          { value: [20, 20, 0, 5, 5].reduce((a, n) => n += a), name: "mmHg" },
          { value: 100, name: "bpm" },
        ]
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
        data: [

          { value: [20, 20, 0, 5, 5].reduce((a, n) => n += a), name: "°C" },

          { value: [20, 20, 0, 5, 5].reduce((a, n) => n += a), name: "mmHg" },
          { value: 100, name: "bpm" },
        ]
      }
    ]
  };

  option7 = {
    title: {
      text: 'Gráfico de barras'
    },
    tooltip: {},
    legend: {
      data: ['Medidas de dispersão']
    },
    xAxis: {
      data: ["data 1", "data 2", "data 3", "data 4", "data 5", "data 6"]
    },
    yAxis: {},
    series: [{
      name: 'Medidas de dispersão',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  };

  chartdata = [
    {
      name: 'Oranges',
      type: 'bar',
      data: [20, 20, 36, 12, 15]
    },
    {
      name: 'Apples',
      type: 'bar',
      data: [8, 5, 25, 10, 10]
    }
  ];


option8 = {
  grid: {
    top: '6',
    right: '0',
    bottom: '17',
    left: '25',
  },
  xAxis: {
    data: ['2006', '2008', '2010', '2012', '2014'],
    axisLine: {
      lineStyle: {
        color: '#ccc'
      }
    },
    axisLabel: {
      fontSize: 10,
      color: '#666'
    }
  },
  yAxis: {
    splitLine: {
      lineStyle: {
        color: '#ddd'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#ccc'
      }
    },
    axisLabel: {
      fontSize: 10,
      color: '#666'
    }
  },
  series: this.chartdata
};


  users: any;

  dashboardData : DashboardData;

  constructor(public measurementService: MeasurementService, public usersService : UsersService) { }

  renderData(data: Array<any>) {

    console.log(data)
    // for (let i in data) {
    //   console.log('oi ', data[i])
    //   // var item = { value: data.value[i], name: data.name[i] };
    // }
  }

  getAllUsers() {
    this.usersService.getAll().subscribe((users) => {
      this.users = users.users;
      console.log(users);
      this.prepareDashboardData();
    });
  }

  ngOnInit() {
    this.init();
  }

  init(){
    this.measurementService.getAll().subscribe((measurements) => {
      this.measurements = measurements.measurements;
      this.getAllUsers();
      
      //console.log('aqui', this.measurements)

      for (var teste in this.measurements) {
        this.dataArr.push({ value: this.measurements[teste].value, name: this.measurements[teste].unit });
      }

      let count = 0
      var result = _(this.dataArr)
        .groupBy(x => x.name)
        .toArray()
        .forEach(n => {

          let ne = n.map(m => 
            m.name
         )
          console.log(_.uniq(ne))
        })
      
        console.log("OP", this.result)
    });
  }

  prepareDashboardData(){
    let data : DashboardData = {
      totalPatients : this.users.length,
      totalMeasurement : this.measurements.length,
      averageAge: this.getAverageAge()
    }
    this.dashboardData = data;
  }

  getAverageAge(){

    if (this.users){
      return (this.users.map(user=>{
        console.log(new Date(Date.now()).getFullYear() - new Date(user.dateOfBirth).getFullYear());
        return(new Date(Date.now()).getFullYear() - new Date(user.dateOfBirth).getFullYear());
      })
      .reduce((acumulator, current)=>{
          return current + acumulator;
      }) / this.users.length).toFixed(0);
    }

  }

}

export interface DashboardData{
  totalPatients : number,
  totalMeasurement: number,
  averageAge: string
}


