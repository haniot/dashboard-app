import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'app/shared/shared-components/loading-component/service/loading.service';

@Component({
  selector: 'app-pilot-study-component',
  templateUrl: './pilot-study-component.component.html',
  styleUrls: ['./pilot-study-component.component.scss']
})
export class PilotStudyComponentComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private loadingService: LoadingService
  ) { }

  ngOnInit() { }


  cleanStudyId() {
    this.router.navigate(['pilotstudies', 'new']);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.loadingService.close();
    }, 1000);
  }
}

