import { TestBed, inject } from '@angular/core/testing';

import { NgbDatePtparserFormatterService } from './ngb-date-ptparser-formatter.service';

describe('NgbDatePtparserFormatterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgbDatePtparserFormatterService]
    });
  });

  it('should be created', inject([NgbDatePtparserFormatterService], (service: NgbDatePtparserFormatterService) => {
    expect(service).toBeTruthy();
  }));
});
