import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TimeSeries, TimeSeriesType } from '../models/time.series'
import { TimeSeriesService } from '../services/time.series.service'

@Component({
    selector: 'view-time-series',
    templateUrl: './view.time.series.component.html',
    styleUrls: ['../../measurement/shared.style/shared.styles.scss']
})
export class ViewTimeSeriesComponent implements OnChanges {
    @Input() patientId: string;
    @Input() typeOfTimeSeries: TimeSeriesType;
    @Input() filter: any;
    @Input() intraday: boolean;
    data: any;
    listIsEmpty: boolean;
    TimeSeriesType = TimeSeriesType;

    constructor(private timeSeriesService: TimeSeriesService) {
        this.listIsEmpty = false;
    }

    loadResource(typeSelected: TimeSeriesType): any {
        this.data = undefined;
        let method = 'getWithResource';
        if (this.intraday) {
            method = 'getWithResourceAndInterval';
        }
        this.timeSeriesService[method](this.patientId, typeSelected, this.filter)
            .then((httpResponse) => {
                if (httpResponse && httpResponse.data_set) {
                    this.data = httpResponse;
                }
                this.listIsEmpty = !(this.data) || (!this.data.summary || !this.data.summary.total);
                if (typeSelected === TimeSeriesType.heart_rate) {
                    this.listIsEmpty = !(this.data) || (!this.data.summary || (!this.data.summary._fat_burn_total &&
                        !this.data.summary._cardio_total &&
                        !this.data.summary._peak_total &&
                        !this.data.summary._out_of_range_total));
                }
            })
            .catch(() => {
                this.data = new TimeSeries();
                this.listIsEmpty = true;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.typeOfTimeSeries && (changes.typeOfTimeSeries.currentValue !== changes.typeOfTimeSeries.previousValue)) {
            this.loadResource(changes.typeOfTimeSeries.currentValue);
        } else if (changes && changes.filter && (changes.filter.currentValue !== changes.filter.previousValue)) {
            this.loadResource(this.typeOfTimeSeries);
        }

    }
}
