import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  constructor() { }

  @Input() selectedUser;

  @Output() closeDetais = new EventEmitter();

  
  ngOnInit() {
    
  }

  backButtonPushed(){
    this.closeDetais.emit();
  }

  

}
