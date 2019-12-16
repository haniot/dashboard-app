import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'haniot-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
    @Input() modalId: string;

    constructor() {
    }

    ngOnInit() {
    }

}
