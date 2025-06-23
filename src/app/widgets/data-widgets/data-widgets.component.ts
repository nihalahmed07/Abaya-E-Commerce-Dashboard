import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-widgets',
  templateUrl: './data-widgets.component.html',
  styleUrls: ['./data-widgets.component.scss']
})
export class DataWidgetsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $.getScript('./assets/js/data-widgets.js');
  }

}
