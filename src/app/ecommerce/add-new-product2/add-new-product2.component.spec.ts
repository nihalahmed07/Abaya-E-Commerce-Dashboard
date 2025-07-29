/* import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewProduct2Component } from './add-new-product2.component';

describe('AddNewProduct2Component', () => {
  let component: AddNewProduct2Component;
  let fixture: ComponentFixture<AddNewProduct2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewProduct2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewProduct2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); */


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // ✅ Needed for ngModel
import { CommonModule } from '@angular/common'; // Optional but good practice

import { AddNewProduct2Component } from './add-new-product2.component';

describe('AddNewProduct2Component', () => {
  let component: AddNewProduct2Component;
  let fixture: ComponentFixture<AddNewProduct2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewProduct2Component ],
      imports: [
        FormsModule,  // ✅ Required for ngModel
        CommonModule  // Optional but recommended
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewProduct2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

