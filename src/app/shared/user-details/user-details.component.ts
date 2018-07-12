import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import {MeasurementService} from '../../services/measurements.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  constructor(public measurementsService : MeasurementService) { }

  @Input() selectedUser;

  @Output() closeDetais = new EventEmitter();

  measurements;
  ngOnInit() {
    this.getUserMeasurements();
  }

  backButtonPushed(){
    this.closeDetais.emit();
  }

  getUserMeasurements(){
    this.measurementsService.getMeasurementsByUser(this.selectedUser._id)
      .subscribe((measurements)=>{
        this.measurements = measurements;
        console.log(this.measurements);
      })
  }

}
