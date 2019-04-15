import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { SleepHabitsRecord } from '../models/sleep';
import { ToastrService } from 'ngx-toastr';
import { SleepRecordService } from '../services/sleep-record.service';

@Component({
  selector: 'sleep-habits',
  templateUrl: './sleep-habits.component.html',
  styleUrls: ['./sleep-habits.component.scss']
})
export class SleepHabitsComponent implements OnInit, OnChanges {

  listSleep: Array<SleepHabitsRecord>;
  sleepForm: FormGroup;
  @Input() patientId: string;
  index: number;

  constructor(
    private fb: FormBuilder,
    private sleepService: SleepRecordService,
    private toastService: ToastrService
  ) {
    this.index = 0;
    this.listSleep = new Array<SleepHabitsRecord>();
  }

  ngOnInit() {
    this.createSleepFormInit();
  }

  /**Create form feeding */
  createSleepFormInit() {
    this.sleepForm = this.fb.group({
      id: [''],
      created_at: [{ value: '', disabled: true }],
      week_day_sleep: [{ value: 0, disabled: true }],
      week_day_wake_up: [{ value: 0, disabled: true }]      
    });
  }

  createSleepForm(sleepRecord: SleepHabitsRecord) {
    this.sleepForm = this.fb.group({
      id: [{value: sleepRecord.id}],
      created_at: [{ value: sleepRecord.created_at, disabled: true }],
      week_day_sleep: [{ value: sleepRecord.week_day_sleep, disabled: true }],
      week_day_wake_up: [{ value: sleepRecord.week_day_wake_up, disabled: true }]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.patientId && changes.patientId.currentValue != changes.patientId.previousValue) {
      this.sleepService.getAll(this.patientId)
        .then(sleepRecords => {
          this.listSleep = sleepRecords;
          this.createSleepForm(sleepRecords[0]);// FIXME: Aqui estou pegando apenas o primeiro registro 
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
    this.createSleepForm(this.listSleep[this.index]);
  }
  next() {
    this.index++;
    this.createSleepForm(this.listSleep[this.index]);
  }

}

