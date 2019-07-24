import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location, PopStateEvent } from '@angular/common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import 'rxjs/add/operator/filter';
import { ISubscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, OnDestroy {
    private _router: ISubscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    private subscriptions: Array<ISubscription>;

    constructor(public location: Location, private router: Router) {
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
            // if we are on windows OS we activate the perfectScrollbar function

            document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
        } else {
            document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
        }
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

        this.subscriptions.push(this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        }));
        this.subscriptions.push(this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                if (event.url != this.lastPoppedUrl) {
                    this.yScrollStack.push(window.scrollY);
                }
            } else if (event instanceof NavigationEnd) {
                if (event.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else {
                    window.scrollTo(0, 0);
                }
            }
        }));
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            elemMainPanel.scrollTop = 0;
            elemSidebar.scrollTop = 0;
        });
        this.subscriptions.push(this._router);
    }

    ngOnDestroy(): void {
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
