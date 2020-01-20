import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { SearchForPeriod } from '../../measurement/models/measurement'
import { MeasurementService } from '../../measurement/services/measurement.service'
import { TimeSeries, TimeSeriesSimpleFilter, TimeSeriesType } from '../models/time.series'
import { TimeSeriesService } from '../services/time.series.service'

@Component({
    selector: 'view-timestamp',
    templateUrl: './view.timestamp.component.html',
    styleUrls: ['../../measurement/shared.style/shared.styles.scss']
})
export class ViewTimestampComponent implements OnChanges {
    @Input() patientId: string;
    @Input() typeOfTimeSeries: TimeSeriesType;
    @Input() filter: TimeSeriesSimpleFilter;
    data: TimeSeries;
    listIsEmpty: boolean;
    TimeSeriesType = TimeSeriesType;

    constructor(private timeSeriesService: TimeSeriesService) {
        this.listIsEmpty = false;
    }

    loadResource(typeSelected: TimeSeriesType): any {
        this.data = undefined;
        this.timeSeriesService.getWithResource(this.patientId, typeSelected, this.filter)
            .then((httpResponse) => {
                this.data = httpResponse;
                this.listIsEmpty = false;
            })
            .catch(() => {
                this.listIsEmpty = true;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.typeOfTimeSeries) {
            this.loadResource(changes.typeOfTimeSeries.currentValue);
        }
    }
}
