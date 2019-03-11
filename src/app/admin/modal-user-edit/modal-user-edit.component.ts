import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as $ from 'jquery';

@Component({
  selector: 'app-modal-user-edit',
  templateUrl: './modal-user-edit.component.html',
  styleUrls: ['./modal-user-edit.component.scss']
})
export class ModalUserEditComponent{

  @Input() user: {id:string, name:string, email:string, password:string};
  @Input() title: string;
  @Input() subtitle: string;
  @Output() onedit = new EventEmitter();

  constructor() {   }


  onSubmit(form) { 
    this.onedit.emit(this.user);
    form.reset();
    setTimeout(()=>{
      $("#buttonFechar").trigger('click');
    },100);
  }

}
