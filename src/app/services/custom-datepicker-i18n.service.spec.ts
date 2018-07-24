import { TestBed, inject } from '@angular/core/testing';

import { CustomDatepickerI18nService } from './custom-datepicker-i18n.service';

describe('CustomDatepickerI18nService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomDatepickerI18nService]
    });
  });

  it('should be created', inject([CustomDatepickerI18nService], (service: CustomDatepickerI18nService) => {
    expect(service).toBeTruthy();
  }));
});
