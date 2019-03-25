import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTopComponent } from './card-top.component';

describe('CardTopComponent', () => {
  let component: CardTopComponent;
  let fixture: ComponentFixture<CardTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
