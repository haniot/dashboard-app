import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as $ from 'jquery';
import { IUser, HealtArea } from '../models/users.models';

@Component({
  selector: 'app-modal-user-edit',
  templateUrl: './modal-user-edit.component.html',
  styleUrls: ['./modal-user-edit.component.scss']
})
export class ModalUserEditComponent{

  @Input() user: IUser;
  @Input() title: string;
  @Input() subtitle: string;
  @Output() onedit = new EventEmitter();
  @Input() typeUser: string;// Admin or HealthProfessional
  private healthAreaOptions = Object.keys(HealtArea);
  
  constructor() {   }


  onSubmit(form) { 
    this.onedit.emit(this.user);
    form.reset();
    setTimeout(()=>{
      $("#buttonFechar").trigger('click');
    },100);
  }

}
