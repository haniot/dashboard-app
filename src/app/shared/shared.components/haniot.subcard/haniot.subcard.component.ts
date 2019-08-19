import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'haniot-subcard',
    templateUrl: './haniot.subcard.component.html',
    styleUrls: ['./haniot.subcard.component.scss']
})
export class HaniotSubcardComponent implements OnInit {

    @Input() title: string;

    constructor() {
    }

    ngOnInit() {
    }

}
