import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PilotStudyService } from 'app/modules/pilot-study/services/pilot-study.service';

@Component({
  selector: 'app-patient-component',
  templateUrl: './patient-component.component.html',
  styleUrls: ['./patient-component.component.scss']
})
export class PatientComponentComponent implements OnInit {
  pilotStudyId: string;
  subtitle: string;
  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private pilotStudyService: PilotStudyService) { }

  ngOnInit() { 
    this.activeRouter.paramMap.subscribe((params) => {
      this.pilotStudyId = params.get('pilotstudy_id');
      this.router.navigate(['patients',this.pilotStudyId]);
    });
    this.buildSubtitle();
  }

  newPatient(){
    this.router.navigate(['patients',this.pilotStudyId ,'new']);
  }

  buildSubtitle(){
    this.pilotStudyService.getById(this.pilotStudyId)
      .then(pilot => {
        this.subtitle = 'Estudo selecionado: '+pilot.name;
      })
      .catch(errorResponse => {
        console.log('Não foi possível buscar estudo piloto!', errorResponse);
      });
  }

  onBack(){
    this.router.navigate(['patients']);
  }

}
