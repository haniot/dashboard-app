import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageEvent } from '@angular/material/paginator';

import { PhysicalActivity } from '../models/physical.activity';
import {
    TimeSeriesFullFilter,
    TimeSeriesIntervalFilter,
    TimeSeriesSimpleFilter,
    TimeSeriesTotals,
    TimeSeriesType
} from '../models/time.series';
import { ConfigurationBasic } from '../../config.matpaginator';
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { PhysicalActivitiesService } from '../services/physical.activities.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { TimeSeriesService } from '../services/time.series.service'
import { DecimalPipe } from '@angular/common'
import { DistancePipe } from '../pipes/distance.pipe'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'app-activity.list',
    templateUrl: './activity.list.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './activity.list.component.scss']
})
export class ActivityListComponent implements OnInit {
    data: PhysicalActivity[];
    patientId: string;
    timeSerieSelected: TimeSeriesType;
    timeSeriesTypes: any;
    currentDate: Date;
    selectAll: boolean;
    stateButtonRemoveSelected: boolean;
    showSpinner: boolean;
    listCheckActivities: boolean[];
    Math = Math;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    cacheListIdForRemove: Array<any>;
    removingActivity: boolean;
    currentFilter: TimeSeriesSimpleFilter | TimeSeriesIntervalFilter | TimeSeriesFullFilter | any;
    currentFilterType: string;
    isIntraday: boolean;
    totals: TimeSeriesTotals;

    constructor(
        private activeRouter: ActivatedRoute,
        private activityService: PhysicalActivitiesService,
        private timeSeriesService: TimeSeriesService,
        private router: Router,
        private decimalPipe: DecimalPipe,
        private distancePipe: DistancePipe,
        private modalService: ModalService,
        private toastService: ToastrService,
        private translateService: TranslateService) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.cacheListIdForRemove = new Array<string>();
        this.timeSeriesTypes = [TimeSeriesType.steps, TimeSeriesType.calories, TimeSeriesType.distance];
        this.timeSerieSelected = TimeSeriesType.steps;
        this.data = [];
        this.currentDate = new Date();
        this.currentFilter = new TimeSeriesIntervalFilter();
        this.currentFilter.date = this.currentDate.toISOString().split('T')[0];
        this.currentFilter.interval = '1m';
        this.currentFilterType = 'today';
        this.isIntraday = true;
        this.totals = new TimeSeriesTotals();
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.loadAllActivities();
            this.loadTotals();
        })
    }

    applyFilter(event): void {
        this.currentFilter = event.filter;
        this.currentFilterType = event.type;
        this.isIntraday = (event && event.type && event.type === 'today');
        this.loadTotals();
    }

    loadAllActivities(): void {
        this.data = [];
        this.showSpinner = true;
        this.activityService.getAll(this.patientId, this.page, this.limit)
            .then(httpResponse => {
                this.data = httpResponse && httpResponse.body ? httpResponse.body : [];
                this.length = httpResponse && httpResponse.headers ? parseInt(httpResponse.headers.get('x-total-count'), 10) : 0;
                this.initializeListChecks();
                this.showSpinner = false;
            })
            .catch(err => {
                this.showSpinner = false;
            })
    }

    loadTotals(): void {
        const filter: TimeSeriesSimpleFilter = new TimeSeriesSimpleFilter();
        if (this.currentFilterType === 'today') {
            filter.start_date = this.currentFilter.date;
            filter.end_date = this.currentFilter.date;
        } else {
            filter.start_date = this.currentFilter.start_date;
            filter.end_date = this.currentFilter.end_date;
        }
        this.timeSeriesService.getAll(this.patientId, filter)
            .then(totals => {
                this.totals = totals;
            })
            .catch(() => {

            })
    }

    changeOnActivity(): void {
        const activitiesSelected = this.listCheckActivities.filter(element => element === true);
        this.selectAll = this.data.length === activitiesSelected.length;
        this.updateStateButtonRemoveSelected();
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.loadAllActivities();
    }

    closeModalConfirmation() {
        this.modalService.close('modalConfirmation');
    }

    initializeListChecks(): void {
        this.selectAll = false;
        this.listCheckActivities = new Array<boolean>(this.data.length);
        for (let i = 0; i < this.listCheckActivities.length; i++) {
            this.listCheckActivities[i] = false;
        }
        this.updateStateButtonRemoveSelected();
    }

    selectAllActivities(): void {
        const attribSelectAll = (element: any) => {
            return !this.selectAll;
        }
        this.listCheckActivities = this.listCheckActivities.map(attribSelectAll);
        this.updateStateButtonRemoveSelected();
    }

    async remove(): Promise<any> {
        this.modalService.close('modalConfirmation');
        this.removingActivity = true;
        let occurredError = false;
        for (let i = 0; i < this.cacheListIdForRemove.length; i++) {
            try {
                const activityRemove = this.cacheListIdForRemove[i];
                await this.activityService.remove(this.patientId, activityRemove);
            } catch (e) {
                occurredError = true;
            }
        }
        occurredError ? this.toastService
                .error(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-NOT-REMOVED'))
            : this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-REMOVED'));

        this.loadAllActivities();
        this.removingActivity = false;
    }

    removeSelected(): void {
        const activitiesIdSelected: Array<string> = new Array<string>();
        this.listCheckActivities.forEach((element, index) => {
            if (element) {
                activitiesIdSelected.push(this.data[index].id);
            }
        })
        this.cacheListIdForRemove = activitiesIdSelected;
        this.openModalConfirmation('')
    }

    viewActivityDetails(activityId: string): void {
        this.router.navigate(['/app/activities', this.patientId, 'physical_activity', activityId]);
    }

    getStepsTotal(): number | string {
        if (this.totals && this.totals.steps && this.totals.steps.summary) {
            const total = this.totals.steps.summary['total'];
            return this.decimalPipe.transform(total, '1.0-0')
        }
        return 0;
    }

    getDistanceTotal(): string {
        if (this.totals && this.totals.distance && this.totals.distance.summary) {
            const total = this.totals.distance.summary['total'];
            return this.distancePipe.transform(total);
        }
        return '0<small>m</small>';
    }

    getCaloriesTotal(): number | string {
        if (this.totals && this.totals.calories && this.totals.calories.summary) {
            const total = this.totals.calories.summary['total'];
            return this.decimalPipe.transform(total, '1.0-0')
        }
        return 0;
    }

    openModalConfirmation(activityId: string): void {
        this.modalService.open('modalConfirmation');
        if (activityId && activityId !== '') {
            this.cacheListIdForRemove = [activityId];
        }
    }

    updateStateButtonRemoveSelected(): void {
        const activitiesSelected = this.listCheckActivities.filter(element => element === true);
        this.stateButtonRemoveSelected = !!activitiesSelected.length;
    }

    trackById(index, item: PhysicalActivity) {
        return item.id
    }

}
