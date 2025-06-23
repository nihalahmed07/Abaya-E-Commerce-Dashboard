import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetsRoutingModule } from './widgets-routing.module';
import { StaticWidgetsComponent } from './static-widgets/static-widgets.component';
import { DataWidgetsComponent } from './data-widgets/data-widgets.component';


@NgModule({
  declarations: [StaticWidgetsComponent, DataWidgetsComponent],
  imports: [
    CommonModule,
    WidgetsRoutingModule
  ]
})
export class WidgetsModule { }
