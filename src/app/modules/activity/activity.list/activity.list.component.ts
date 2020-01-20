import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';

import { PhysicalActivity } from '../models/physical.activity';
import { SearchForPeriod } from '../../measurement/models/measurement';
import { TimeSeriesSimpleFilter, TimeSeriesType } from '../models/time.series';
import { ConfigurationBasic } from '../../config.matpaginator';
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { PhysicalActivitiesService } from '../services/physical.activities.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import * as $ from 'jquery'
import { DateRange } from '../../pilot.study/models/range-date'
import { FilterOptions } from '../../measurement/measurement.card/measurement.card.component'

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
    filter: SearchForPeriod;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    cacheIdForRemove: string;
    cacheListIdForRemove: Array<any>;
    removingActivity: boolean;
    search: DateRange;
    filterOptions = FilterOptions;
    /*mobile view*/
    filterSelected: string;
    minDate: Date;
    startOfDate: Date;
    endOfDate: Date;
    currentFilter: TimeSeriesSimpleFilter;

    constructor(
        private activeRouter: ActivatedRoute,
        private activityService: PhysicalActivitiesService,
        private router: Router,
        private modalService: ModalService,
        private toastService: ToastrService,
        private translateService: TranslateService) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.filter = new SearchForPeriod();
        this.data = [];
        this.cacheListIdForRemove = new Array<string>();
        this.timeSeriesTypes = [TimeSeriesType.steps, TimeSeriesType.calories, TimeSeriesType.distance];
        this.timeSerieSelected = TimeSeriesType.steps;
        this.currentDate = new Date();
        this.data = [];
        this.minDate = new Date((this.currentDate.getFullYear() - 1) + '/' +
            (this.currentDate.getMonth() + 1) + '/' + this.currentDate.getDate());
        this.filterSelected = 'today';
        this.currentFilter = new TimeSeriesSimpleFilter();
        this.currentFilter.start_date = this.currentDate.toISOString();
        this.currentFilter.end_date = this.currentDate.toISOString();
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
        })
    }

    applyFilter($event): void {


    }

    updateRangeDate(): void {
        switch (this.filterSelected) {
            case '1m':
                this.startOfDate = moment().startOf('month').toDate();
                this.endOfDate = moment().endOf('month').toDate();
                break;

            case '1y':
                this.startOfDate = moment().startOf('year').toDate();
                this.endOfDate = moment().endOf('year').toDate();
                break;

            default:
                this.startOfDate = moment().startOf('week').toDate();
                this.endOfDate = moment().endOf('week').toDate();
                break;

        }
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
    }

    closeModalConfirmation() {
        this.cacheIdForRemove = '';
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

    previous(): void {
        switch (this.filterSelected) {
            case 'today':
                this.currentDate = new Date(this.currentDate.getTime() - (24 * 60 * 60 * 1000));
                break;

            case '1w':
                this.startOfDate = moment(this.startOfDate).subtract(1, 'w').toDate();
                this.endOfDate = moment(this.endOfDate).subtract(1, 'w').toDate();
                break;

            case '1m':
                this.startOfDate = moment(this.startOfDate).subtract(1, 'M').toDate();
                this.endOfDate = moment(this.endOfDate).subtract(1, 'M').toDate();
                break;

            case '1y':
                this.startOfDate = moment(this.startOfDate).subtract(1, 'y').toDate();
                this.endOfDate = moment(this.endOfDate).subtract(1, 'y').toDate();
                break;
        }
    }

    next(): void {
        switch (this.filterSelected) {
            case 'today':
                if (!this.isToday(this.currentDate)) {
                    this.currentDate = new Date(this.currentDate.getTime() + (24 * 60 * 60 * 1000));
                }
                break;

            case '1w':
                this.startOfDate = moment(this.startOfDate).add(1, 'w').toDate();
                this.endOfDate = moment(this.endOfDate).add(1, 'w').toDate();
                break;

            case '1m':
                this.startOfDate = moment(this.startOfDate).add(1, 'M').toDate();
                this.endOfDate = moment(this.endOfDate).add(1, 'M').toDate();
                break;

            case '1y':
                this.startOfDate = moment(this.startOfDate).add(1, 'y').toDate();
                this.endOfDate = moment(this.endOfDate).add(1, 'y').toDate();
                break;
        }
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    }

    async remove(): Promise<any> {
        this.modalService.close('modalConfirmation');
        this.removingActivity = true;
        if (this.cacheIdForRemove) {
            this.activityService.remove(this.patientId, this.cacheIdForRemove)
                .then(measurements => {
                    this.applyFilter(this.filter);
                    this.removingActivity = false;
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-REMOVED'));
                })
                .catch(() => {
                    this.removingActivity = false;
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-NOT-REMOVED'));
                })
        } else {
            let occuredError = false;
            for (let i = 0; i < this.cacheListIdForRemove.length; i++) {
                try {
                    const activityRemove = this.cacheListIdForRemove[i];
                    await this.activityService.remove(this.patientId, activityRemove);
                } catch (e) {
                    occuredError = true;
                }
            }
            occuredError ? this.toastService
                    .error(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-NOT-REMOVED'))
                : this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-REMOVED'));

            this.applyFilter(this.filter);
            this.removingActivity = false;
        }
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

    openModalConfirmation(activityId: string): void {
        this.modalService.open('modalConfirmation');
        this.cacheIdForRemove = activityId;
    }

    updateStateButtonRemoveSelected(): void {
        const activitiesSelected = this.listCheckActivities.filter(element => element === true);
        this.stateButtonRemoveSelected = !!activitiesSelected.length;
    }

    isMobile(): boolean {
        return $(window).width() < 1080;
    }

    filterChange(event: any): void {
        let filter: { start_at: string, end_at: string, period: string } = {
            start_at: null,
            end_at: new Date().toISOString().split('T')[0],
            period: event
        };
        if (event === 'period') {
            const start_at = this.search.begin.toISOString().split('T')[0];
            const end_at = this.search.end.toISOString().split('T')[0];
            filter = { start_at, end_at, period: null };
        } else {
            this.search = null;
        }
        this.filterSelected = filter.period;
        this.updateRangeDate();
        // this.filter_change.emit(filter);
        // this.updateViewFilters(event)
    }

    trackById(index, item: PhysicalActivity) {
        return item.id
    }

}
