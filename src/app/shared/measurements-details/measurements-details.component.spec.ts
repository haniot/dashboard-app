import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementsDetailsComponent } from './measurements-details.component';

describe('MeasurementsDetailsComponent', () => {
  let component: MeasurementsDetailsComponent;
  let fixture: ComponentFixture<MeasurementsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurementsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
