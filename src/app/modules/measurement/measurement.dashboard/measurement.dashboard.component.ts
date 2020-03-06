import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';

import { EnumMeasurementType } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';
import { MeasurementLast } from '../models/measurement.last';
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { TimeSeries, TimeSeriesIntervalFilter, TimeSeriesType } from '../../activity/models/time.series';
import { TimeSeriesService } from '../../activity/services/time.series.service';

const gridConfig = [
    { key: EnumMeasurementType.weight, value: { x: 0, y: 0, rows: 4, cols: 2 } },
    { key: EnumMeasurementType.height, value: { x: 0, y: 0, rows: 2, cols: 2 } },
    { key: EnumMeasurementType.waist_circumference, value: { x: 0, y: 0, rows: 2, cols: 2 } },
    { key: EnumMeasurementType.body_fat, value: { x: 0, y: 0, rows: 2, cols: 2 } },
    { key: EnumMeasurementType.body_temperature, value: { x: 0, y: 0, rows: 2, cols: 2 } },
    { key: EnumMeasurementType.blood_pressure, value: { x: 0, y: 0, rows: 2, cols: 3 } },
    { key: EnumMeasurementType.blood_glucose, value: { x: 0, y: 0, rows: 2, cols: 3 } },
    { key: TimeSeriesType.heart_rate, value: { x: 0, y: 0, rows: 4, cols: 6 } }
]

@Component({
    selector: 'measurement-dashboard',
    templateUrl: './measurement.dashboard.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './measurement.dashboard.component.scss']
})
export class MeasurementDashboardComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    EnumMeasurementType = EnumMeasurementType;
    TimeSeriesType = TimeSeriesType;
    public options: GridsterConfig;
    measurementLast: MeasurementLast;
    loading: boolean;
    loadingHeartRate: boolean;
    fatThreshold = {
        '0': { color: '#00a594' },
        '25': { color: '#FBA53E' },
        '30': { color: 'red' }
    };
    bmi: number;
    nameOfPatientSelected: string;
    heartRate: TimeSeries;
    configItems: Map<string, GridsterItem>;

    constructor(
        private activeRouter: ActivatedRoute,
        private measurementService: MeasurementService,
        private modalService: ModalService,
        private toastService: ToastrService,
        private localStorageService: LocalStorageService,
        private timeSeriesService: TimeSeriesService) {
        this.options = {
            margin: 5,
            minCols: 6,
            maxCols: 6,
            displayGrid: 'none',
            minRows: 10,
            maxRows: 10,
            swap: true,
            swapWhileDragging: true,
            setGridSize: true,
            mobileBreakpoint: 640,
            gridType: 'fit',
            resizable: {
                enabled: false
            },
            draggable: {
                enabled: false
            }
        };
        this.configItems = new Map<string, GridsterItem>();
        gridConfig.forEach(item => this.configItems.set(item.key, item.value))
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.getPatientSelected();
        });
    }


    getPatientSelected(): void {
        const patientSelected = JSON.parse(this.localStorageService.getItem('patientSelected'));
        if (patientSelected && patientSelected.name) {
            this.nameOfPatientSelected = patientSelected.name
        }
    }


    loadMeasurements(): void {
        this.loading = true;
        this.measurementService.getLastByUser(this.patientId)
            .then(measurements => {
                this.measurementLast = measurements;
                this.loading = false;
                this.bmi = (this.measurementLast.weight.value * 10000) / Math.pow(this.measurementLast.height.value, 2);
            })
            .catch(() => {
                this.loading = false;
            })
    }

    loadHeartRate(): void {
        const filter = new TimeSeriesIntervalFilter();
        filter.date = new Date().toISOString().split('T')[0];
        filter.interval = '15m';
        this.loadingHeartRate = true;
        this.timeSeriesService.getWithResourceAndInterval(this.patientId, TimeSeriesType.heart_rate, filter)
            .then(heartRate => {
                this.heartRate = heartRate
                this.loadingHeartRate = false;
            })
            .catch(() => {
                this.loadingHeartRate = false;
            })
    }

    openModalNewMeasurement(): void {
        this.modalService.open('newMeasurement');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.patientId) {
            this.loadMeasurements();
            this.loadHeartRate();
        }
    }
}
