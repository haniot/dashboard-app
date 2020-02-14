import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'modal-confirmation',
    templateUrl: './modal.confirmation.component.html',
    styleUrls: ['./modal.confirmation.component.scss']
})
export class ModalConfirmationComponent {
    @Input() id;
    @Input() message;
    @Input() observation;
    @Output() confirmation = new EventEmitter();
    @Output() noconfirmation = new EventEmitter();
    @Output() close: EventEmitter<any>;

    constructor() {
        this.close = new EventEmitter<any>();
    }

    yes() {
        this.confirmation.emit();
    }

    no() {
        this.noconfirmation.emit();
    }

    closeEmit(): void {
        this.close.emit();
    }
}
