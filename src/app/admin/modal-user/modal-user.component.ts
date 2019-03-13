import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HealtArea } from '../models/users.models';
@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent{
  @Input() title: string;
  @Input() subtitle: string;
  @Output() oncreate = new EventEmitter();
  @Input() typeUser: string;// Admin or HealthProfessional
  
  private username:string = '';
  private name:string = '';
  private email:string = '';
  private password:string = '';
  private health_area: HealtArea;
  private healthAreaOptions = Object.keys(HealtArea);

  constructor() {}

  onSubmit(form){
    this.oncreate.emit(form.value);
    form.reset();
  }
}
