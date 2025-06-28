import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { OrdersDetailsComponent } from './ecommerce/orders-details/orders-details.component';
import { InvoiceComponent } from './application/invoice/invoice.component';

import { FullLayoutComponent } from './layouts/full/full-layout.component';
import { ContentLayoutComponent } from './layouts/content/content-layout.component';

import { Full_ROUTES } from './shared/routes/full-layout.routes';
import { CONTENT_ROUTES } from './shared/routes/content-layout.routes';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/sales',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: { title: 'full Views' },
    children: Full_ROUTES
  },
  {
    path: '',
    component: ContentLayoutComponent,
    data: { title: 'content Views' },
    children: CONTENT_ROUTES
  },
  { 
    path: '**', 
    redirectTo: 'dashboard/sales' 
  },
  { 
    path: 'order-details/:id', 
    component: OrdersDetailsComponent 
  },
  { 
    path: 'invoice/:id', 
    component: InvoiceComponent 
  },
   { path: 'application/invoice/:id', component: InvoiceComponent },  // Ensure this is correct
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
