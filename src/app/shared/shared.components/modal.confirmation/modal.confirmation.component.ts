import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'modal-confirmation',
    templateUrl: './modal.confirmation.component.html',
    styleUrls: ['./modal.confirmation.component.scss']
})
export class ModalConfirmationComponent {
    @Input() id;
    @Input() message;
    @Output() confirmation = new EventEmitter();
    @Output() noconfirmation = new EventEmitter();

    constructor() {
    }

    yes() {
        this.confirmation.emit();
    }

    no() {
        this.noconfirmation.emit();
    }
}
