import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ModalEventService {
  onclose = new EventEmitter();
  onopen = new EventEmitter<string>();

  constructor() { }

  modalOnOpen(){
    this.onopen.emit();
  }

  modalOnClose(){
    this.onclose.emit();
  }
}
