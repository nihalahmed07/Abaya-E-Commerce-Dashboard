import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
  selector: 'app-popovers',
  templateUrl: './popovers.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./popovers.component.scss']
})
export class PopoversComponent implements OnInit {

  name = 'World';

  toggleWithGreeting(popover, greeting: string, language: string) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({greeting, language});
    }
  }

  lastShown: Date;
  lastHidden: Date;

  recordShown() {
    this.lastShown = new Date();
  }

  recordHidden() {
    this.lastHidden = new Date();
  }

  constructor() { }

  ngOnInit(): void {
  }

}
