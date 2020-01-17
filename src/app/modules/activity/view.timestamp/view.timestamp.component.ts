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
    list: Array<any>;
    listIsEmpty: boolean;
    TimeSeriesType = TimeSeriesType;

    constructor(private timeSeriesService: TimeSeriesService) {
        this.list = [];
        this.listIsEmpty = false;
        // this.filter = { start_at: null, end_at: new Date().toISOString().split('T')[0], period: 'today' };
    }

    loadMeasurements(typeSelected: TimeSeriesType): any {
        this.timeSeriesService.getWithResource(this.patientId, typeSelected, this.filter)
            .then((httpResponse) => {
                // if (httpResponse.body && httpResponse.body.length) {
                //     this.list = httpResponse.body;
                //     this.listIsEmpty = this.list.length === 0;
                // }
            })
            .catch(() => {
                this.listIsEmpty = true;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.typeOfTimeSeries) {
            this.loadMeasurements(changes.typeOfTimeSeries.currentValue);
        }
    }
}
