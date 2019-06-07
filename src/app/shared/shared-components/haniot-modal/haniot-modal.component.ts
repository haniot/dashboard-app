import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'haniot-modal',
  templateUrl: './haniot-modal.component.html',
  styleUrls: ['./haniot-modal.component.scss']
})
export class HaniotModalComponent implements OnInit {
  @Input() modalId: string;

  constructor() { }

  ngOnInit() { }

}
