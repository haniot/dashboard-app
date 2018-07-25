import { Component, OnInit, Input } from '@angular/core';

import {MeasurementService} from '../../services/measurements.service';

@Component({
  selector: 'app-user-measurements-tabs',
  templateUrl: './user-measurements-tabs.component.html',
  styleUrls: ['./user-measurements-tabs.component.scss']
})
export class UserMeasurementsTabsComponent implements OnInit {

  @Input() selectedUser;

  measurements;

  constructor(public measurementsService : MeasurementService) { }

  ngOnInit() {
    this.getUserMeasurements();
  }

  getUserMeasurements(){
    this.measurementsService.getMeasurementsByUser(this.selectedUser._id)
      .subscribe((measurements)=>{
        this.measurements = measurements;
        console.log(this.measurements);
      })
  }

  /*getMeasurementsByRangeDate(){
    this.measurementsService.getMeasurementsByUserRangeDate(this.selectedUser._id, )
  }*/

}
