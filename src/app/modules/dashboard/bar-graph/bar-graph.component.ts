import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BloodGlucose, MealType} from "../../measurement/models/blood-glucose";
import {GraphService} from "../../../shared/shared-services/graph.service";
import {Unit} from "../models/unit";

@Component({
    selector: 'bar-graph',
    templateUrl: './bar-graph.component.html',
    styleUrls: ['./bar-graph.component.scss']
})
export class BarGraphComponent implements OnInit, OnChanges {
    @Input() data: Array<Unit>;

    option = {
        title: {
            text: 'Peso dos pacientes'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b} <br> {c} : Kg"
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        dataZoom: [
            {
                type: 'slider'
            }
        ],
        series: [{
            data: [],
            type: 'bar'
        }]
    };


    constructor(private graphService: GraphService) {
        this.data = new Array<Unit>();
    }

    ngOnInit() {

    }

    loadGraph() {
        // Limpando o grafico
        this.option.xAxis.data = [];
        this.option.series[0].data = [];

        if (this.data && this.data.length > 0) {

            this.data.forEach((element: Unit) => {
                this.option.xAxis.data.push(element.namePatient);
                this.option.series[0].data.push(element.value);
            });


        }
        this.graphService.refreshGraph();


    }

    ngOnChanges(changes: SimpleChanges) {

        if ((this.data && changes.data.currentValue !== undefined && changes.data.previousValue === undefined)
            || (changes.data.currentValue.length !== changes.data.previousValue.length)) {
            this.loadGraph();
        }
    }

}
