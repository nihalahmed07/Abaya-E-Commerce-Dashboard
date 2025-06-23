import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgComponentsRoutingModule } from './ng-components-routing.module';
import { AccordionComponent } from './accordion/accordion.component';
import { AlertComponent } from './alert/alert.component';
import { NgbdAlertSelfclosing } from './alert/alert.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CollapseComponent } from './collapse/collapse.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ModalComponent } from './modal/modal.component';
import { NgbdModalOptions } from './modal/modal-options';
import { NavComponent } from './nav/nav.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { TableComponent } from './table/table.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { ToastComponent } from './toast/toast.component';
import { ToastsContainer } from './toast/toast-container';
import { TooltipComponent } from './tooltip/tooltip.component';
import { PopoversComponent } from './popovers/popovers.component';


@NgModule({
  declarations: [
    AccordionComponent, 
    AlertComponent, 
    NgbdAlertSelfclosing, 
    ButtonsComponent, 
    CarouselComponent, 
    CollapseComponent, 
    DatepickerComponent, 
    DropdownComponent, 
    ModalComponent,
    NgbdModalOptions,
    NavComponent,
    PaginationComponent,
    ProgressBarComponent,
    TableComponent,
    TimepickerComponent,
    ToastComponent,
    ToastsContainer,
    TooltipComponent,
    PopoversComponent
  ],
  imports: [
  CommonModule,
    NgComponentsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NgComponentsModule { }
