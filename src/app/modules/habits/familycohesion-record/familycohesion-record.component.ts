import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FamilyCohesionRecord } from '../models/familycohesion-record';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FamilyCohesionRecordService } from '../services/familycohesion-record.service';
import { FrequencyFamilyCohesionPipe } from '../pipes/frequency-familycohesion.pipe';

@Component({
  selector: 'familycohesion-record',
  templateUrl: './familycohesion-record.component.html',
  styleUrls: ['./familycohesion-record.component.scss']
})
export class FamilycohesionRecordComponent implements OnInit, OnChanges{

  listFamilyCohesion: Array<FamilyCohesionRecord>;
  familyForm: FormGroup;
  @Input() patientId: string;
  index: number;

  constructor(
    private fb: FormBuilder,
    private familyService: FamilyCohesionRecordService,
    private frequencyPipe: FrequencyFamilyCohesionPipe
  ) {
    this.index = 0;
    this.listFamilyCohesion = new Array<FamilyCohesionRecord>();
  }

  ngOnInit() {
    this.createFamilyFormInit();
  }

  /**Create form family cohesion */
  createFamilyFormInit() {
    this.familyForm = this.fb.group({
      id: [''],
      created_at: [{ value: '', disabled: true }],
      family_mutual_aid_freq: [{ value: '', disabled: true }],
      friendship_approval_freq: [{ value: '', disabled: true }],
      family_only_task_freq: [{ value: '', disabled: true }],
      family_only_preference_freq: [{ value: '', disabled: true }],
      free_time_together_freq: [{ value: '', disabled: true }],
      family_proximity_perception_freq: [{ value: '', disabled: true }],
      all_family_tasks_freq: [{ value: '', disabled: true }],
      family_tasks_opportunity_freq: [{ value: '', disabled: true }],
      family_decision_support_freq: [{ value: '', disabled: true }],
      family_union_relevance_freq: [{ value: '', disabled: true }],
      family_cohesion_result: [{ value: 0, disabled: true }]
    });

  }

  createFamilyForm(familyRecord: FamilyCohesionRecord) {
    this.familyForm = this.fb.group({
      id: [{ value: familyRecord.id, disabled: true }],
      created_at: [{ value: familyRecord.created_at, disabled: true }],
      family_mutual_aid_freq: [{ value: familyRecord.family_mutual_aid_freq, disabled: true }],
      friendship_approval_freq: [{ value: familyRecord.friendship_approval_freq, disabled: true }],
      family_only_task_freq: [{ value: familyRecord.family_only_task_freq, disabled: true }],
      family_only_preference_freq: [{ value: familyRecord.family_only_preference_freq, disabled: true }],
      free_time_together_freq: [{ value: familyRecord.free_time_together_freq, disabled: true }],
      family_proximity_perception_freq: [{ value: familyRecord.family_proximity_perception_freq, disabled: true }],
      all_family_tasks_freq: [{ value: familyRecord.all_family_tasks_freq, disabled: true }],
      family_tasks_opportunity_freq: [{ value: familyRecord.family_tasks_opportunity_freq, disabled: true }],
      family_decision_support_freq: [{ value: familyRecord.family_decision_support_freq, disabled: true }],
      family_union_relevance_freq: [{ value: familyRecord.family_union_relevance_freq, disabled: true }],
      family_cohesion_result: [{ value: familyRecord.family_cohesion_result, disabled: true }]
    });
    this.familyForm.get('family_mutual_aid_freq').patchValue(this.frequencyPipe.transform(familyRecord.family_mutual_aid_freq));
    this.familyForm.get('friendship_approval_freq').patchValue(this.frequencyPipe.transform(familyRecord.friendship_approval_freq));
    this.familyForm.get('family_only_task_freq').patchValue(this.frequencyPipe.transform(familyRecord.family_only_task_freq));
    this.familyForm.get('family_only_preference_freq').patchValue(this.frequencyPipe.transform(familyRecord.family_only_preference_freq));
    this.familyForm.get('free_time_together_freq').patchValue(this.frequencyPipe.transform(familyRecord.free_time_together_freq));
    this.familyForm.get('family_proximity_perception_freq')
      .patchValue(this.frequencyPipe.transform(familyRecord.family_proximity_perception_freq));
    this.familyForm.get('all_family_tasks_freq').patchValue(this.frequencyPipe.transform(familyRecord.all_family_tasks_freq));
    this.familyForm.get('family_tasks_opportunity_freq')
      .patchValue(this.frequencyPipe.transform(familyRecord.family_tasks_opportunity_freq));
    this.familyForm.get('family_decision_support_freq').patchValue(this.frequencyPipe.transform(familyRecord.family_decision_support_freq));
    this.familyForm.get('family_union_relevance_freq').patchValue(this.frequencyPipe.transform(familyRecord.family_union_relevance_freq));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.patientId && changes.patientId.currentValue != changes.patientId.previousValue) {
      this.familyService.getAll(this.patientId)
        .then(familyRecords => {
          this.listFamilyCohesion = familyRecords;
          this.createFamilyForm(familyRecords[0]);// FIXME: Aqui estou pegando apenas o primeiro registro 
        })
        .catch(errorResponse => {
          //this.toastService.error('Não foi possível buscar coesão familiar!');
          //console.log('Não foi possível buscar coesão familiar!', errorResponse);
        });
    }
  }

  prev() {
    if (this.index) {
      this.index--;
    }
    this.createFamilyForm(this.listFamilyCohesion[this.index]);
  }
  next() {
    this.index++;
    this.createFamilyForm(this.listFamilyCohesion[this.index]);
  }

}
