import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HaniotTableComponent } from './haniot-table.component';

describe('HaniotTableComponent', () => {
  let component: HaniotTableComponent;
  let fixture: ComponentFixture<HaniotTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HaniotTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HaniotTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
