import { Injectable, EventEmitter } from '@angular/core';

import { Error } from 'app/shared/shared-models/error'
declare var $ : any;

@Injectable()
export class ModalService {

  eventActionNotExecuted: EventEmitter<any> = new EventEmitter();

  constructor() { }

  open(id: string){
    $('#'+id).modal('show');
  }

  close(id: string){
    $('#'+id).modal('hide');
  }

  actionNotExecuted(id: string,user: any, error?: Error){
    $('#'+id).modal('show');
    this.eventActionNotExecuted.emit({user, error});
  }
}
