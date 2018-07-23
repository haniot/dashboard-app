import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMeasurementsTabsComponent } from './user-measurements-tabs.component';

describe('UserMeasurementsTabsComponent', () => {
  let component: UserMeasurementsTabsComponent;
  let fixture: ComponentFixture<UserMeasurementsTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMeasurementsTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMeasurementsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
