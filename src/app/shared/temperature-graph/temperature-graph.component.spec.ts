import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureGraphComponent } from './temperature-graph.component';

describe('TemperatureGraphComponent', () => {
  let component: TemperatureGraphComponent;
  let fixture: ComponentFixture<TemperatureGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
