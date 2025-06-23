import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cms-dashboard',
  templateUrl: './cms-dashboard.component.html',
  styleUrls: ['./cms-dashboard.component.scss']
})
export class CmsDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $.getScript("./assets/js/cms-dashboard.js");
  }

}
