import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'haniot-table',
  templateUrl: './haniot-table.component.html',
  styleUrls: ['./haniot-table.component.scss']
})
export class HaniotTableComponent implements OnInit {

  // @Input() character: any;
  @Input() title : string = "Titulo da tabela"
  @Input() subtitle : string = "Subtitulo da tabela"
  @Input() characters: any;
  @Input() columns: any;

  constructor() {
   
    
   }

  ngOnInit() {
  }
}
