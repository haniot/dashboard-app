import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'haniot-table-row',
  templateUrl: './haniot-table-row.component.html',
  styleUrls: ['./haniot-table-row.component.scss']
})
export class HaniotTableRowComponent implements OnInit {

  @Input() character: any;
  @Input() columns: string[];
  
  constructor() {
    
   }

  ngOnInit() {
    console.log("aqui", this.character)
  }

}
