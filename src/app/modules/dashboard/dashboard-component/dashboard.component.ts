import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  patientsTotal: number;
  studiesTotal: number;
  measurementsTotal: number;
  assessmentTotal: number;



  constructor() {
    this.patientsTotal = 20;
    this.studiesTotal = 6;
    this.measurementsTotal = 125;
    this.assessmentTotal = 55;
  }



  ngOnInit() {
    $('body').css('background-color', '#ececec');
  }





}

