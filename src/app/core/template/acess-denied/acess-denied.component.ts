import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'acess-denied',
  templateUrl: './acess-denied.component.html',
  styleUrls: ['./acess-denied.component.scss']
})
export class AcessDeniedComponent {

  constructor(private location: Location) { }


  onBack() {
    this.location.back();
  }

}
