import { Component, OnInit } from '@angular/core';
import { ModalEventService } from '../services/modal-event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pilot-study-component',
  templateUrl: './pilot-study-component.component.html',
  styleUrls: ['./pilot-study-component.component.scss']
})
export class PilotStudyComponentComponent implements OnInit {
  pilotStudyId: string;

  constructor(
    private modalEvent: ModalEventService,
    private router: Router
    ) { }

  ngOnInit() {
    
  }

  editPilotStudy(event){
    console.log(event);
    this.pilotStudyId = event;
    this.modalEvent.modalOnOpen();
  }

  cleanStudyId(){
    this.pilotStudyId = undefined;
    this.router.navigate(['pilotstudies','new']);
  }
}

