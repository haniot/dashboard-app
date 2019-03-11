import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked,} from '@angular/core';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent{
  
  @Input() title: string;
  @Input() subtitle: string;
  @Output() oncreate = new EventEmitter();
  
  name:string = '';
  email:string = '';
  password:string = '';

  constructor() {}

  onSubmit(form){
    this.oncreate.emit(form.value);
    form.reset();
  }
}
