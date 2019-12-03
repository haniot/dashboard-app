import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pilot-study-component',
    templateUrl: './pilot.study.component.html',
    styleUrls: ['./pilot.study.component.scss']
})
export class PilotStudyComponent {
    constructor(
        private router: Router
    ) {
    }

    newPilotStudy() {
        this.router.navigate(['/app/pilotstudies', 'new']);
    }
}

