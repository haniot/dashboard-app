import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-glucose-graph',
  templateUrl: './glucose-graph.component.html',
  styleUrls: ['./glucose-graph.component.scss']
})
export class GlucoseGraphComponent implements OnInit {

  option = {
    xAxis: {
        type: 'category',
        data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [200, 170, 150, 199, 186, 188, 183],
        type: 'line'
    }]
};


  constructor() { }

  ngOnInit() {
  }

}
