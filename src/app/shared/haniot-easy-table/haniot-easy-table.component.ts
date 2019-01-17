import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/users';


@Component({
  selector: 'haniot-easy-table',
  templateUrl: './haniot-easy-table.component.html',
  styleUrls: ['./haniot-easy-table.component.scss']
})
export class HaniotEasyTableComponent implements OnInit {

  @Input() users: User[];

  constructor() { }
  ngOnInit() {
    
  }
}
