import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMaterialComponent } from './table-material.component';

describe('TableMaterialComponent', () => {
  let component: TableMaterialComponent;
  let fixture: ComponentFixture<TableMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
