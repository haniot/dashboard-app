import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlucoseGraphComponent } from './glucose-graph.component';

describe('GlucoseGraphComponent', () => {
  let component: GlucoseGraphComponent;
  let fixture: ComponentFixture<GlucoseGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlucoseGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlucoseGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
