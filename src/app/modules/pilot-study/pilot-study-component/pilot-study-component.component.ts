import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pilot-study-component',
  templateUrl: './pilot-study-component.component.html',
  styleUrls: ['./pilot-study-component.component.scss']
})
export class PilotStudyComponentComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() { }


  cleanStudyId() {
    this.router.navigate(['pilotstudies', 'new']);
  }
}

