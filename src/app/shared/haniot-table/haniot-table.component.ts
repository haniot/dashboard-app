import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'haniot-table',
  templateUrl: './haniot-table.component.html',
  styleUrls: ['./haniot-table.component.scss']
})
export class HaniotTableComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  @Input() characters: any;
  @Input() columns: any;

  constructor() {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }
}
