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
            })
            .catch(err => {
                this.loading = false;
                console.log(err)
            })
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.patientId) {
            this.loadMeasurements();
        }
    }
}
