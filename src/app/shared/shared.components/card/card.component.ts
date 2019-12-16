import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'haniot-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

    @Input() title = ''
    @Input() subtitle = ''

    constructor() {
    }

    ngOnInit() {
    }

}
