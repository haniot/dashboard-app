import { Component, OnInit, Input } from '@angular/core';

import {measurementTypes} from '../../global/measurements-types';

import{OutputDate} from '../../models/output-date';

import {MeasurementService} from '../../services/measurements.service';

@Component({
  selector: 'app-measurements-details',
  templateUrl: './measurements-details.component.html',
  styleUrls: ['./measurements-details.component.scss']
})
export class MeasurementsDetailsComponent implements OnInit {

  types = [];

  selectedTypes = [];

  @Input() selectedUser;

  selectedRangeDate : OutputDate; 
  
  measurements;
  
  constructor(public measurementsService : MeasurementService) { }

  ngOnInit() {
    this.types = this.getMeasurementTypes();
    console.log("measurements-detais");
    console.log(this.measurements);
  }

  getMeasurementsByRangeDate(){
    this.measurementsService
    .getMeasurementsByUserRangeDate(this.selectedUser._id, this.selectedRangeDate )
    .subscribe((measurements)=>{
      this.measurements = measurements;
    })
  }

  getMeasurementTypes(){
    return measurementTypes;
  }

  /*getMeasurementNames(){
    return measurementTypes.map((type=>{
      return type.name;
    }));
  }*/

  currentValues(event){
    this.selectedTypes = event;
  }

  setRangeDate(event){
    this.selectedRangeDate = event;    
  }

  applyRangeDate(): void{
    this.getMeasurementsByRangeDate();
  }

  /**
   * Used to check if the type of the measurement is selected or not
   * returns -1 if the type is not selected
   * 
   * @param id represents the type of the measurement
   */
  showMeasurementById(id:number):number{
   return this.selectedTypes.findIndex(type=>{
    return type.id == id;
    })
  }

  mapMeasurementsData(id:number):Array<any>{
    if (this.measurements){
      return this.measurements.measurements.filter(measurement=>{
        return measurement.typeId == id;
      });
    }
    else return []; 
  }

  showMapMea(){
    console.log(this.mapMeasurementsData(1));
  }

  




}
