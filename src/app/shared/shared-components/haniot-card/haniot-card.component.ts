import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'haniot-card',
    templateUrl: './haniot-card.component.html',
    styleUrls: ['./haniot-card.component.scss']
})
export class HaniotCardComponent implements OnInit {

    @Input() title = ""
    @Input() subtitle = ""

    constructor() {
    }

    ngOnInit() {
    }

}
