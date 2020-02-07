import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'haniot-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
    @Output() close: EventEmitter<any>;
    @Input() modalId: string;
    @Input() styleDialog: boolean;

    constructor() {
        this.close = new EventEmitter<any>();
    }

    key(event): void {
        if (event && event.key === 'Escape' && event.code === 'Escape') {
            this.close.emit();
        }
    }

}
