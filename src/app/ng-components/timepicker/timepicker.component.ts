import { Component, OnInit, Injectable } from '@angular/core';
import {NgbTimeStruct, NgbTimeAdapter} from '@ng-bootstrap/ng-bootstrap';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent implements OnInit {

  time: NgbTimeStruct = {hour: 13, minute: 30, second: 0};

  Meridiantime = {hour: 13, minute: 30};
  meridian = true;

  spinnerstime = {hour: 13, minute: 30};
  spinners = true;

  sectime: NgbTimeStruct = {hour: 13, minute: 30, second: 30};
  seconds = true;

  customsteptime: NgbTimeStruct = {hour: 13, minute: 30, second: 0};
  hourStep = 1;
  minuteStep = 15;
  secondStep = 30;


  toggleMeridian() {
      this.meridian = !this.meridian;
  }

  toggleSeconds() {
    this.seconds = !this.seconds;
  }

  toggleSpinners() {
    this.spinners = !this.spinners;
}

ctrl = new FormControl('', (control: FormControl) => {
  const value = control.value;

  if (!value) {
    return null;
  }

  if (value.hour < 12) {
    return {tooEarly: true};
  }
  if (value.hour > 13) {
    return {tooLate: true};
  }

  return null;
});

  constructor() { }

  ngOnInit() {
  }

}
