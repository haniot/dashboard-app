import {
    Directive, ElementRef, Input, OnInit, HostBinding, OnChanges, OnDestroy
} from '@angular/core';

import { Subject, Subscription } from "rxjs";

import * as echarts from 'echarts';
import ECharts = echarts.ECharts;
import EChartOption = echarts.EChartOption;


@Directive({
    selector: '[ts-chart]',
})

export class echartsDirective implements OnChanges, OnInit, OnDestroy {
    private chart: ECharts;
    private sizeCheckInterval = null;
    private reSize$ = new Subject<string>();
    private onResize: Subscription;

    option = {
        title: {
            text: '某地区蒸发量和降水量',
            subtext: '纯属虚构'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['蒸发量', '降水量']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '蒸发量',
                type: 'bar',
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            },
            {
                name: '降水量',
                type: 'bar',
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                markPoint: {
                    data: [
                        { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
                        { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            }
        ]
    };


    @Input('ts-chart') options: EChartOption;

    @HostBinding('style.height.px')
    elHeight: number;

    constructor(private el: ElementRef) {
        this.chart = echarts.init(this.el.nativeElement, 'vintage');

        this.chart.setOption(this.option);

    }


    ngOnChanges(changes) {
        if (this.options) {
            this.chart.setOption(this.options);
        }
    }

    ngOnInit() {
        console.log(this.options)
        
        this.sizeCheckInterval = setInterval(() => {
            this.reSize$.next(`${this.el.nativeElement.offsetWidth}:${this.el.nativeElement.offsetHeight}`)
        }, 100);
        this.onResize = this.reSize$
            .distinctUntilChanged()
            .subscribe((_) => this.chart.resize());

        this.elHeight = this.el.nativeElement.offsetHeight;
        if (this.elHeight < 300) {
            this.elHeight = 300;
        }
    }


    ngOnDestroy() {
        if (this.sizeCheckInterval) {
            clearInterval(this.sizeCheckInterval);
        }
        this.reSize$.complete();
        if (this.onResize) {
            this.onResize.unsubscribe();
        }
    }
}