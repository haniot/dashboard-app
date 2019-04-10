import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaGraphComponent } from './area-graph.component';

describe('AreaGraphComponent', () => {
  let component: AreaGraphComponent;
  let fixture: ComponentFixture<AreaGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
