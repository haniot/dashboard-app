import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { PhysicalActivityHabitsRecord } from '../models/physicalActivity';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PhysicalActivityRecordService } from '../services/physical-activity-record.service';
import { ToastrService } from 'ngx-toastr';
import { PhysicalActivityPipe } from '../pipes/physical-activity-frequency.pipe';

@Component({
  selector: 'physical-activity-habits',
  templateUrl: './physical-activity-habits.component.html',
  styleUrls: ['./physical-activity-habits.component.scss']
})
export class PhysicalActivityHabitsComponent implements OnInit, OnChanges {

  listPhysicalActivits: Array<PhysicalActivityHabitsRecord>;
  physicalActivityForm: FormGroup;
  @Input() patientId: string;
  index: number;

  constructor(
    private fb: FormBuilder,
    private physicalActivityService: PhysicalActivityRecordService,
    private physicalActivityPipe: PhysicalActivityPipe,
    private toastService: ToastrService
  ) {
    this.index = 0;
    this.listPhysicalActivits = new Array<PhysicalActivityHabitsRecord>();
  }

  ngOnInit() {
    this.createPhysicalActivityFormInit();
  }

  /**Create form feeding */
  createPhysicalActivityFormInit() {
    this.physicalActivityForm = this.fb.group({
      id: [''],
      created_at: [{ value: '', disabled: true }],
      school_activity_freq: [{ value: '', disabled: true }],
      weekly_activities: this.fb.array([])
    });
  }

  createPhysicalActivityForm(physicalActivity: PhysicalActivityHabitsRecord) {
    this.physicalActivityForm = this.fb.group({
      id: [{ value: physicalActivity.id }],
      created_at: [{ value: physicalActivity.created_at, disabled: true }],
      school_activity_freq: [{ value: physicalActivity.school_activity_freq, disabled: true }],
      weekly_activities: [{ value: physicalActivity.weekly_activities, disabled: true }]
    });
    this.physicalActivityForm.get('school_activity_freq').patchValue(this.physicalActivityPipe.transform(physicalActivity.school_activity_freq));
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.patientId && changes.patientId.currentValue != changes.patientId.previousValue) {
      this.physicalActivityService.getAll(this.patientId)
        .then(sleepRecords => {
          this.listPhysicalActivits = sleepRecords;
          this.createPhysicalActivityForm(sleepRecords[0]);// FIXME: Aqui estou pegando apenas o primeiro registro 
        })
        .catch(errorResponse => {
          this.toastService.error('Não foi possível buscar hábitos de sono!');
          console.log('Não foi possível buscar hábitos de sono!', errorResponse);
        });
    }
  }

  prev() {
    if (this.index) {
      this.index--;
    }
    this.createPhysicalActivityForm(this.listPhysicalActivits[this.index]);
  }
  next() {
    this.index++;
    this.createPhysicalActivityForm(this.listPhysicalActivits[this.index]);
  }

}
