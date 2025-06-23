import { Component, OnInit } from '@angular/core';

import { ToastService } from './toast-service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  show = true;

  close() {
    this.show = false;
    setTimeout(() => this.show = true, 3000);
  }


  show2 = false;
  autohide = true;


  constructor(public toastService: ToastService) {}

  showStandard() {
    this.toastService.show('I am a standard toast');
  }

  showSuccess() {
    this.toastService.show('I am a success toast', { classname: 'bg-success text-light', delay: 10000 });
  }

  showDanger(dangerTpl) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 15000 });
  }


  ngOnInit(): void {
  }

}
