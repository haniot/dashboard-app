import { Component, OnInit, Input } from '@angular/core';
import { User } from 'app/auth/interfaces/user.model';

@Component({
  selector: 'haniot-table',
  templateUrl: './haniot-table.component.html',
  styleUrls: ['./haniot-table.component.scss']
})
export class HaniotTableComponent implements OnInit {
  @Input() list: Array<User>;

  constructor() { }

  ngOnInit() {
  }

}
