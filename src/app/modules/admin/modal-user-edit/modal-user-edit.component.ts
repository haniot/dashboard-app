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
  healthAreaOptions = Object.keys(HealtArea);
  username: string;
  email:string;
  constructor() {   }


  onSubmit(form) {
    const userForm = form.value ;
    console.log(userForm);
    let userSubmit = {};
    Object.keys(userForm).forEach(key => {
      console.log(key);
      if(userForm[key] != this.user[key]){
        userSubmit[key] = userForm[key];
        console.log(key);
      }
    });
    console.log('userSumit: ',userSubmit);
    this.onedit.emit(userSubmit);
    form.reset();
    setTimeout(()=>{
      $("#buttonFechar").trigger('click');
    },100);
  }

}
