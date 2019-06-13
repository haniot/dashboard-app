import {
    Directive, ElementRef, Input, OnInit, HostBinding, OnChanges, OnDestroy
} from '@angular/core';

import {Subject, Subscription} from "rxjs";
import {ISubscription} from 'rxjs/Subscription';

import * as echarts from 'echarts';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;
import {GraphService} from '../shared-services/graph.service';


@Directive({
    selector: '[ts-chart]',
})

export class echartsDirective implements OnChanges, OnInit, OnDestroy {
    private chart: ECharts;
    private sizeCheckInterval = null;
    private reSize$ = new Subject<string>();
    private onResize: Subscription;

    @Input('ts-chart') options: EChartOption;

    @HostBinding('style.height.px')
    elHeight: number;

    private subscriptions: Array<ISubscription>;

    constructor(
        private el: ElementRef,
        private graphService: GraphService) {
        this.chart = echarts.init(this.el.nativeElement, 'vintage');
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnChanges(changes) {
        if (this.options) {
            // console.log('Options', this.options)
            this.chart.setOption(this.options);
        }
    }

    ngOnInit() {
        this.sizeCheckInterval = setInterval(() => {
            this.reSize$.next(`${this.el.nativeElement.offsetWidth}:${this.el.nativeElement.offsetHeight}`)
        }, 100);
        this.onResize = this.reSize$
            .distinctUntilChanged()
            .subscribe((_) => this.chart.resize());
        this.subscriptions.push(this.onResize);
        this.elHeight = this.el.nativeElement.offsetHeight;
        if (this.elHeight < 300) {
            this.elHeight = 300;
        }
        this.subscriptions.push(this.graphService.refresh.subscribe(() => {
            this.chart.setOption(this.options);
        }));
    }

    ngOnDestroy() {
        if (this.sizeCheckInterval) {
            clearInterval(this.sizeCheckInterval);
        }
        this.reSize$.complete();
        if (this.onResize) {
            this.onResize.unsubscribe();
        }
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
