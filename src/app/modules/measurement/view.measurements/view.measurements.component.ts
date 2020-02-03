import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MeasurementService } from '../services/measurement.service'
import { EnumMeasurementType, SearchForPeriod } from '../models/measurement'

@Component({
    selector: 'view-measurements',
    templateUrl: './view.measurements.component.html',
    styleUrls: ['./view.measurements.component.scss']
})
export class ViewMeasurementsComponent implements OnChanges {
    @Input() patientId: string;
    @Input() typeOfMeasurement: string;
    list: Array<any>;
    listIsEmpty: boolean;
    filter: SearchForPeriod;
    allTypesOfMeasurement = EnumMeasurementType;

    constructor(private measurementService: MeasurementService) {
        this.list = []
        this.listIsEmpty = false;
        // this.filter = { start_at: null, end_at: new Date().toISOString().split('T')[0], period: 'today' };
    }

    loadMeasurements(typeSelected: EnumMeasurementType | string): any {
        this.list = [];
        this.measurementService.getAllByUserAndType(this.patientId, typeSelected, null, null, this.filter)
            .then((httpResponse) => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.list = httpResponse.body;
                    this.listIsEmpty = this.list.length === 0;
                }
            })
            .catch(() => {
                this.listIsEmpty = true;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.typeOfMeasurement) {
            this.loadMeasurements(changes.typeOfMeasurement.currentValue);
        }
    }
}
