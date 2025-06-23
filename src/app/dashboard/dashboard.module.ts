import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighchartsChartModule } from 'highcharts-angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { SalesComponent } from './sales/sales.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { CmsDashboardComponent } from './cms-dashboard/cms-dashboard.component';


@NgModule({
  declarations: [
     ECommerceComponent, SalesComponent, AnalyticsComponent, ProjectManagementComponent, CmsDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PerfectScrollbarModule,
    HighchartsChartModule
  ]
})
export class DashboardModule { }
