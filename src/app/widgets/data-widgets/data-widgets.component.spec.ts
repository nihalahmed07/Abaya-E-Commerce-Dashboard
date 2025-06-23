import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataWidgetsComponent } from './data-widgets.component';

describe('DataWidgetsComponent', () => {
  let component: DataWidgetsComponent;
  let fixture: ComponentFixture<DataWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
