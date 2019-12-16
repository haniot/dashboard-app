import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'haniot-subcard',
    templateUrl: './subcard.component.html',
    styleUrls: ['./subcard.component.scss']
})
export class SubcardComponent implements OnInit {

    @Input() title: string;

    constructor() {
    }

    ngOnInit() {
    }

}
