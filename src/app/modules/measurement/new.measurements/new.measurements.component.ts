import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { MealType } from '../models/blood.glucose'
import { EnumMeasurementType } from '../models/measurement'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { TranslateService } from '@ngx-translate/core'
import { MeasurementService } from '../services/measurement.service'
import { ToastrService } from 'ngx-toastr'

@Component({
    selector: 'new-measurements',
    templateUrl: './new.measurements.component.html',
    styleUrls: ['./new.measurements.component.scss']
})
export class NewMeasurementsComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    @Output() save: EventEmitter<any>;
    @Input() type: EnumMeasurementType;
    EnumMeasurementType = EnumMeasurementType;
    measurementForm: FormGroup;
    weightUnits: { value: string, label: string }[];
    temperatureUnits: { value: string, label: string }[];
    savingMeasurement: boolean;
    measurementTypes: string[];
    mealTypes: string[];

    constructor(
        private fb: FormBuilder,
        private modalService: ModalService,
        private translateService: TranslateService,
        private measurementService: MeasurementService,
        private toastService: ToastrService
    ) {
        this.save = new EventEmitter<any>();
        this.measurementTypes = Object.keys(EnumMeasurementType);
        this.mealTypes = Object.keys(MealType);
        this.createForm(EnumMeasurementType.weight)
    }

    ngOnInit() {
        this.loadUnits();
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
                    unit: [{ value: 'mmHg', disabled: true }, Validators.required],
                    type: [{ value: EnumMeasurementType.blood_pressure, disabled: this.type }, Validators.required],
                    timestamp: [new Date(), Validators.required]
                });
                break;

            case EnumMeasurementType.weight:
                this.measurementForm = this.fb.group({
                    value: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
                    body_fat: [undefined, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
                    unit: ['kg', Validators.required],
                    type: [{ value: typeSelected, disabled: this.type }, Validators.required],
                    timestamp: [new Date(), Validators.required]
                });
                break;

            case EnumMeasurementType.blood_glucose:
                this.measurementForm = this.fb.group({
                    value: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
                    meal: [MealType, Validators.required],
                    unit: [{ value: 'mg/dl', disabled: true }, Validators.required],
                    type: [{ value: typeSelected, disabled: this.type }, Validators.required],
                    timestamp: [new Date(), Validators.required]
                });
                break;

            default:
                let unit: string;
                switch (typeSelected) {
                    case EnumMeasurementType.body_temperature:
                        unit = 'C°'
                        break;
                    case EnumMeasurementType.body_fat:
                        unit = '%';
                        break;
                    default:
                        unit = 'cm';
                        break;
                }
                this.measurementForm = this.fb.group({
                    value: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
                    unit: [unit, Validators.required],
                    type: [{ value: typeSelected, disabled: this.type }, Validators.required],
                    timestamp: [new Date(), Validators.required]
                });
                break;
        }
    }

    loadUnits(): void {
        const kilogram = this.translateService.instant('MEASUREMENTS.MODAL-NEW-MEASUREMENT.KILOGRAM');
        const pounds = this.translateService.instant('MEASUREMENTS.MODAL-NEW-MEASUREMENT.POUNDS');
        this.weightUnits = [{ value: 'lb', label: pounds }, { value: 'kg', label: kilogram }];
        this.temperatureUnits = [{ value: 'C°', label: 'Celsius' }, { value: 'F°', label: 'Fahrenheit' }];
    }

    saveMeasurement(): void {
        this.savingMeasurement = true;
        const measurement = this.measurementForm.getRawValue();
        measurement.timestamp = measurement.timestamp.toISOString();
        this.measurementService.create(this.patientId, measurement)
            .then(() => {
                this.measurementForm.reset();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-SAVED'));
                this.savingMeasurement = false;
                this.save.emit()
            })
            .catch(err => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-NOT-SAVED'));
                this.savingMeasurement = false;
            })
    }

    closeModalNewMeasurement(): void {
        this.createForm(EnumMeasurementType.weight);
        this.modalService.close('newMeasurement');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes.type && changes.type.currentValue && changes.type.previousValue) ||
            (changes.type && changes.type.currentValue && !changes.type.previousValue)) {
            this.createForm(this.type);
        }
        this.loadUnits();
    }

}
