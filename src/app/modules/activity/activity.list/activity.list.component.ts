import { Component, OnInit } from '@angular/core';
import { TimeSeriesType } from '../models/time.series'
import { ActivatedRoute } from '@angular/router'
import { PhysicalActivity } from '../models/physical.activity'

@Component({
    selector: 'app-activity.list',
    templateUrl: './activity.list.component.html',
    styleUrls: ['./activity.list.component.scss']
})
export class ActivityListComponent implements OnInit {
    data: PhysicalActivity[];
    patientId: string;
    measurementSelected: TimeSeriesType;
    timeSeriesTypes: any;
    currentDate: Date;
    selectAll: boolean;
    stateButtonRemoveSelected: boolean;
    showSpinner: boolean;

    constructor(private activeRouter: ActivatedRoute) {
        this.data = [];
        this.timeSeriesTypes = [TimeSeriesType.steps, TimeSeriesType.calories, TimeSeriesType.distance];
        this.measurementSelected = TimeSeriesType.steps;
        this.currentDate = new Date();
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
        })
    }

    applyFilter($event): void {

    }

    previosDay(): void {
        this.currentDate = new Date(this.currentDate.getTime() - (24 * 60 * 60 * 1000));
    }

    nextDay(): void {
        if (!this.isToday(this.currentDate)) {
            this.currentDate = new Date(this.currentDate.getTime() + (24 * 60 * 60 * 1000));
        }
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    }

    selectAllActivities(): void {

    }

    removeSelected(): void {

    }

    trackById(index, item: PhysicalActivity) {
        return item.id
    }

}
