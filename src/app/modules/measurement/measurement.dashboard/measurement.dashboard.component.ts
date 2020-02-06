import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as Muuri from 'muuri';
import { EnumMeasurementType } from '../models/measurement'
import { MeasurementService } from '../services/measurement.service'
import { MeasurementLast } from '../models/measurement.last'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MealType } from '../models/blood.glucose'
import { ActivatedRoute } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
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
    measurementForm: FormGroup;
    EnumMeasurementType = EnumMeasurementType;
    TimeSeriesType = TimeSeriesType;
    measurementTypes: string[];
    mealTypes: string[];
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
    savingMeasurement: boolean;
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
        private fb: FormBuilder,
        private activeRouter: ActivatedRoute,
        private measurementService: MeasurementService,
        private modalService: ModalService,
        private toastService: ToastrService,
        private translateService: TranslateService,
        private localStorageService: LocalStorageService,
        private timeSeriesService: TimeSeriesService) {
        this.measurementTypes = Object.keys(EnumMeasurementType);
        this.mealTypes = Object.keys(MealType);
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
            this.createForm(EnumMeasurementType.weight);
            this.getPatientSelected();
        });
    }

    createForm(typeSelected?: any) {
        if (typeSelected && typeSelected.target && typeSelected.target.value) {
            typeSelected = typeSelected.target.value;
        }
        switch (typeSelected) {
            case EnumMeasurementType.blood_pressure:
                this.measurementForm = this.fb.group({
                    systolic: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
                    diastolic: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
                    pulse: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
                    unit: ['mmHg', Validators.required],
                    type: [EnumMeasurementType.blood_pressure, Validators.required],
                    timestamp: [new Date(), Validators.required]
                });
                break;

            case EnumMeasurementType.weight:
                this.measurementForm = this.fb.group({
                    value: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
                    body_fat: [undefined, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
                    unit: ['', Validators.required],
                    type: [typeSelected, Validators.required],
                    timestamp: [new Date(), Validators.required]
                });
                break;

            case EnumMeasurementType.blood_glucose:
                this.measurementForm = this.fb.group({
                    value: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
                    meal: [MealType, Validators.required],
                    unit: ['', Validators.required],
                    type: [typeSelected, Validators.required],
                    timestamp: [new Date(), Validators.required]
                });
                break;

            default:
                this.measurementForm = this.fb.group({
                    value: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
                    unit: ['', Validators.required],
                    type: [typeSelected, Validators.required],
                    timestamp: [new Date(), Validators.required]
                });
                break;
        }

    }

    getPatientSelected(): void {
        const patientSelected = JSON.parse(this.localStorageService.getItem('patientSelected'));
        if (patientSelected && patientSelected.name) {
            this.nameOfPatientSelected = patientSelected.name
        }
    }

    saveMeasurement(): void {
        this.savingMeasurement = true;
        const measurement = this.measurementForm.getRawValue();
        measurement.timestamp = measurement.timestamp.toISOString();
        this.measurementService.create(this.patientId, measurement)
            .then(() => {
                this.loadMeasurements();
                this.measurementForm.reset();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-SAVED'));
                this.savingMeasurement = false;
            })
            .catch(err => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-NOT-SAVED'));
                this.savingMeasurement = false;
            })
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

    closeModalNewMeasurement(): void {
        this.createForm(EnumMeasurementType.weight);
        this.modalService.close('newMeasurement');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.patientId) {
            this.loadMeasurements();
            this.loadHeartRate();
        }
    }
}
