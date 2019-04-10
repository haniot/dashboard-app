import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss']
})
export class ModalConfirmationComponent {

  @Input() message;
  @Output() confirmation = new EventEmitter();
  @Output() noconfirmation = new EventEmitter();
  
  constructor() { }

  yes(){
    this.confirmation.emit();
  }

  no(){
    this.noconfirmation.emit();
  }

}
