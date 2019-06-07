import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class GraphService {

  @Output() refresh = new EventEmitter<any>();

  constructor() { }

  refreshGraph(){
    this.refresh.emit();
  }
}
