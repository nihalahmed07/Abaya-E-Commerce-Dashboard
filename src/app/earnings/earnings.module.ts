import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarningsRoutingModule } from './earnings-routing.module';
import { EarningsComponent } from './earnings/earnings.component';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [EarningsComponent],
  imports: [
    CommonModule,
    EarningsRoutingModule,
    HttpClientModule,
    NgApexchartsModule
  ]
})
export class EarningsModule {}