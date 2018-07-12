import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material';


export interface User{
  name: string;
  height: number;
  email: string;
  gender : number;
  groupId: number;
  dateOfBirth: number;
}

@Component({
  selector: 'haniot-table',
  templateUrl: './haniot-table.component.html',
  styleUrls: ['./haniot-table.component.scss']
})
export class HaniotTableComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  myDataArray : User[] = [
    {name : 'Test1', height : 175, email:"test@test.com", gender: 1, groupId: 1, dateOfBirth: 123456789}
  ];

  dataSource : MatTableDataSource<User>;
  columnsToDisplay = ['userName'];

  @Input() characters: any;
  @Input() columns: any;

  constructor() {}

  ngOnInit() {
    console.log(this.myDataArray)
    this.dtOptions = {
      pagingType: 'full_numbers'
    };

    this.dataSource = new MatTableDataSource(this.myDataArray);


  }
}
