import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'card-top',
  templateUrl: './card-top.component.html',
  styleUrls: ['./card-top.component.scss']
})
export class CardTopComponent implements OnInit {

  @Input() icon;
  @Input() category;
  @Input() title;

  constructor() { }

  ngOnInit() {
  }

}
