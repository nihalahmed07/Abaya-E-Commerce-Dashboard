import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {

  public beforeChange($event: NgbPanelChangeEvent) {

    if ($event.panelId === 'preventchange-2') {
      $event.preventDefault();
    }

    if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
      $event.preventDefault();
    }
  }

  disabled = false;

  constructor() { }

  ngOnInit(): void {
  }

}
