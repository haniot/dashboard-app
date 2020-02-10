import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as Muuri from 'muuri';
import { EnumMeasurementType } from '../models/measurement'
import { MeasurementService } from '../services/measurement.service'
import { MeasurementLast } from '../models/measurement.last'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { ActivatedRoute } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'
import { TimeSeries, TimeSeriesIntervalFilter, TimeSeriesType } from '../../activity/models/time.series'
import { TimeSeriesService } from '../../activity/services/time.series.service'

@Component({
    selector: 'measurement-dashboard',
    templateUrl: './measurement.dashboard.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './measurement.dashboard.component.scss']
})
export class MeasurementDashboardComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    EnumMeasurementType = EnumMeasurementType;
    TimeSeriesType = TimeSeriesType;

    measurementLast: MeasurementLast;
    gridDivRef: ElementRef;
    gridDivWidth: number;
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

    constructor(
        private activeRouter: ActivatedRoute,
        private measurementService: MeasurementService,
        private modalService: ModalService,
        private toastService: ToastrService,
        private localStorageService: LocalStorageService,
        private timeSeriesService: TimeSeriesService) {
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
