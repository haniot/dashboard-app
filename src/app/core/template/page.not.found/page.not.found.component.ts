import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notfound',
    templateUrl: './page.not.found.component.html',
    styleUrls: ['./page.not.found.component.scss']
})
export class NotfoundComponent {

    constructor(private router: Router) {
    }

    onBack() {
        this.router.navigate(['/app']);
    }
}
