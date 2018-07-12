import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HaniotEasyTableComponent } from './haniot-easy-table.component';

describe('NgxEasyTableComponent', () => {
  let component: HaniotEasyTableComponent;
  let fixture: ComponentFixture<HaniotEasyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HaniotEasyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HaniotEasyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
