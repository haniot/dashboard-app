import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';

import * as $ from 'jquery';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from 'app/security/auth/services/auth.service';
import { LoadingService } from 'app/shared/shared-components/loading-component/service/loading.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewChecked {

  userId: string;

  patientsTotal: number;
  studiesTotal: number;
  measurementsTotal: number;
  assessmentTotal: number;



  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private loadinService: LoadingService
  ) {
    this.patientsTotal = 20;
    this.measurementsTotal = 125;
    this.assessmentTotal = 55;
  }


  ngOnInit() {
    $('body').css('background-color', '#ececec');
    this.loadUserId();
    this.load();
  }

  load() {
    if (this.userId && this.userId != '') {
      this.dashboardService.getNumberOfStudies(this.userId)
        .then(numberStudies => this.studiesTotal = numberStudies)
        .catch(error => this.studiesTotal = 0);
    } else {
      this.loadUserId();
      this.load();
    }
  }

  loadUserId() {
    this.userId = this.authService.decodeToken().sub;
  }

  ngAfterViewChecked() {
    this.loadinService.close();
  }


}

