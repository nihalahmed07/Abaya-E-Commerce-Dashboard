import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticWidgetsComponent } from './static-widgets.component';

describe('StaticWidgetsComponent', () => {
  let component: StaticWidgetsComponent;
  let fixture: ComponentFixture<StaticWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
