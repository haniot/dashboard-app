import { Component, OnInit } from '@angular/core';
import { MeasurementService } from '../../services/measurements.service';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.scss']
})
export class MeasurementsComponent implements OnInit {

  measurements;
  columns = ['value', 'unit']

  constructor(public measurementService: MeasurementService) {
    this.getAllMeasurements()
    console.log('oi', this.measurements)

  }

  ngOnInit() {

  }

  getAllMeasurements() {
    this.measurementService.getAll().subscribe((measurements) => {
      this.measurements = measurements.measurements;
    });
  }

}
