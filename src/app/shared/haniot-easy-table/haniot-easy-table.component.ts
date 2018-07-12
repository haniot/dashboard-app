import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ConfigService} from '../../services/easy-table.service';
import { User } from '../../models/users';
import { ColumnsEasyTable } from '../../models/columns-easy-table';


@Component({
  selector: 'haniot-easy-table',
  templateUrl: './haniot-easy-table.component.html',
  styleUrls: ['./haniot-easy-table.component.scss']
})
export class HaniotEasyTableComponent implements OnInit {

  @Input() users : User[];
  configuration;
  @Input () columns : ColumnsEasyTable[];

  @Output() selectedUser = new EventEmitter();

  data = [{
    email: "test@test.com",
    height: 175,
    name: 'Joana'
  }, {
    email: "test2@test2.com",
    height: 180,
    name: 'Maria'
  }];
  constructor() {}
  ngOnInit() {
    this.configuration = ConfigService.config;
    //this.data = data;
  }

  event(event){
    this.selectedUser.emit({user: event.value.row })
    console.log(JSON.stringify(event.value.row));
  }
}
