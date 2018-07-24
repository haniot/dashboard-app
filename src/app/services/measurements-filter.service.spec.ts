import { TestBed, inject } from '@angular/core/testing';

import { MeasurementsFilterService } from './measurements-filter.service';

describe('MeasurementsFilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeasurementsFilterService]
    });
  });

  it('should be created', inject([MeasurementsFilterService], (service: MeasurementsFilterService) => {
    expect(service).toBeTruthy();
  }));
});
