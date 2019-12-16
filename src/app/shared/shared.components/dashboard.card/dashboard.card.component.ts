import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'dashboard-card',
    templateUrl: './dashboard.card.component.html',
    styleUrls: ['./dashboard.card.component.scss']
})
export class DashboardCardComponent implements OnInit {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() urlAction: string[];
    @Input() icon: string;
    @Input() iconTitle: string;

    constructor() {
    }

    ngOnInit() {
    }

}
