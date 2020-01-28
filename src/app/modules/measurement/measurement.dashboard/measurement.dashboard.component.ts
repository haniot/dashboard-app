import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as Muuri from 'muuri';
import { EnumMeasurementType } from '../models/measurement'
import { MeasurementService } from '../services/measurement.service'
import { MeasurementLast } from '../models/measurement.last'

@Component({
    selector: 'measurement-dashboard',
    templateUrl: './measurement.dashboard.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './measurement.dashboard.component.scss']
})
export class MeasurementDashboardComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    EnumMeasurementType = EnumMeasurementType;
    measurementLast: MeasurementLast;
    gridDivRef: ElementRef;
    gridDivWidth: number;
    loading: boolean;
    temperatureThreshold = {
        '0': { color: '#1b3863' },
        '35.7': { color: '#2d6357' },
        '37.5': { color: 'red' }
    };
    fatThreshold = {
        '0': { color: '#00a594' },
        '25': { color: '#FBA53E' },
        '30': { color: 'red' }
    };
    bmi: number;
    heightGraph: any;
    heightGraphInstance: any;

    @ViewChild('gridDiv', { static: false })
    set gridDiv(element: ElementRef) {
        if (element) {
            setTimeout(() => {
                this.gridDivRef = element;
                this.gridDivWidth = this.gridDivRef.nativeElement.offsetWidth;
            })
        }
    };

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.gridDivWidth = this.gridDivRef.nativeElement.offsetWidth;
    }

    constructor(private measurementService: MeasurementService) {

    }

    ngOnInit() {
        const grid1 = new Muuri('.grid-1', {
            dragEnabled: false,
            dragPlaceholder: {
                enabled: true,
                duration: 300,
                easing: 'ease',
                createElement: null,
                onCreate: null,
                onRemove: null
            },
            dragContainer: document.body,
            dragSort: function () {
                return [grid1]
            }
        });
    }

    loadMeasurements(): void {
        this.loading = true;
        this.measurementService.getLastByUser(this.patientId)
            .then(measurements => {
                this.measurementLast = measurements;
                this.loading = false;
                this.bmi = (this.measurementLast.weight.value * 10000) / Math.pow(this.measurementLast.height.value, 2);
                this.updateHeightGraph();
            })
            .catch(err => {
                this.loading = false;
                console.log(err)
            })
    }

    onHeightChartInit(event) {
        this.heightGraphInstance = event;
    }


    updateHeightGraph(): void {
        if (this.measurementLast.weight && this.measurementLast.weight.value) {
            const series = {
                type: 'bar',
                symbol: 'none',
                sampling: 'average',
                barWidth: '100%',
                itemStyle: {
                    color: 'rgba(251,165,62,0.7)'
                },
                label: {
                    show: true,
                    color: 'black',
                    fontSize: 18,
                    position: 'inside',
                    formatter: `{c}cm`,
                    rich: {
                        name: {
                            textBorderColor: '#000000'
                        }
                    }
                },
                data: [this.measurementLast.height.value]
            };

            this.heightGraph = {
                tooltip: {
                    show: false
                },
                grid: [
                    { x: '0%', y: '0%', width: '100%', height: '87%' }
                ],
                xAxis: {
                    show: false,
                    type: 'category',
                    boundaryGap: false,
                    data: [this.measurementLast.height.timestamp]
                },
                yAxis: {
                    // type: 'value',
                    // position: '',
                    // min: 0,
                    // max: 300,
                    // boundaryGap: [0, '100%']
                    type: 'value',
                    axisTick: {
                        inside: true
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        inside: true,
                        formatter: '{value}\n'
                    },
                    z: 10
                },
                series
            };
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.patientId) {
            this.loadMeasurements();
        }
    }
}
