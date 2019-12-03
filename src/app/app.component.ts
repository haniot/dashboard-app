import { Component, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    loading: boolean

    constructor(
        private router: Router) {

    }

    ngOnInit() {
        const style1 = 'font-size: 40px;font-weight: bold;font-style: italic;color: #00a594;font-style: italic;'
        const style2 = 'font-size: 12px;font-weight: bold;font-style: italic;padding-left: 5px;color: #555;';
        console.log('%cHANIoT%cby NUTES/UEPB', style1, style2);

        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                this.loading = true;
            } else if (event instanceof RouteConfigLoadEnd) {
                this.loading = false;
            }
        });
    }


}
