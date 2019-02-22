import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'haniot-card',
  templateUrl: './haniot-card.component.html',
  styleUrls: ['./haniot-card.component.scss']
})
export class HaniotCardComponent implements OnInit {

  @Input() title: string = "Título do card"
  @Input() subtitle: string = "Subtítulo do card"

  constructor() { }

  ngOnInit() {
  }

}
