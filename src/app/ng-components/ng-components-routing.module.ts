import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccordionComponent } from './accordion/accordion.component';
import { AlertComponent } from './alert/alert.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CollapseComponent } from './collapse/collapse.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ModalComponent } from './modal/modal.component';
import { NavComponent } from './nav/nav.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PopoversComponent } from './popovers/popovers.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { TableComponent } from './table/table.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { ToastComponent } from './toast/toast.component';
import { TooltipComponent } from './tooltip/tooltip.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'accordion',
        component: AccordionComponent,
        data: {
          title: 'accordion'
        }
      },
      {
        path: 'alert',
        component: AlertComponent,
        data: {
          title: 'alert'
        }
      },
      {
        path: 'buttons',
        component: ButtonsComponent,
        data: {
          title: 'Buttons'
        }
      },
      {
        path: 'carousel',
        component: CarouselComponent,
        data: {
          title: 'Carousel'
        }
      },
      {
        path: 'collapse',
        component: CollapseComponent,
        data: {
          title: 'Collapse'
        }
      },
      {
        path: 'datepicker',
        component: DatepickerComponent,
        data: {
          title: 'Datepicker'
        }
      },
      {
        path: 'dropdown',
        component: DropdownComponent,
        data: {
          title: 'dropdown'
        }
      },
      {
        path: 'modal',
        component: ModalComponent,
        data: {
          title: 'Modal'
        }
      },
      {
        path: 'nav',
        component: NavComponent,
        data: {
          title: 'Nav'
        }
      },
      {
        path: 'popovers',
        component: PopoversComponent,
        data: {
          title: 'popovers'
        }
      },
      {
        path: 'pagination',
        component: PaginationComponent,
        data: {
          title: 'Pagination'
        }
      },
      {
        path: 'progress-bar',
        component: ProgressBarComponent,
        data: {
          title: 'Progressbar'
        }
      },
      {
        path: 'table',
        component: TableComponent,
        data: {
          title: 'Table'
        }
      },
      {
        path: 'timepicker',
        component: TimepickerComponent,
        data: {
          title: 'Timepicker'
        }
      },
      {
        path: 'toast',
        component: ToastComponent,
        data: {
          title: 'Toast'
        }
      },
      {
        path: 'tooltip',
        component: TooltipComponent,
        data: {
          title: 'Tooltip'
        }
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgComponentsRoutingModule { }
