import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notfound',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss']
})
export class NotfoundComponent implements OnInit, OnDestroy {
    time = 5000;
    timeout: any;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.timeout = setTimeout(() => {
            this.router.navigate(['dashboard']);
        }, this.time);
        setInterval(() => {
            this.time -= 1000;
        }, 1000);

    }

    ngOnDestroy() {
        clearTimeout(this.timeout);
    }

}
