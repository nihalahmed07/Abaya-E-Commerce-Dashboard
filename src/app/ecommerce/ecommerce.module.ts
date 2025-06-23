import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcommerceRoutingModule } from './ecommerce-routing.module';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsGridComponent } from './products-grid/products-grid.component';
import { CategoriesComponent } from './categories/categories.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersDetailsComponent } from './orders-details/orders-details.component';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import { AddNewProduct2Component } from './add-new-product2/add-new-product2.component';
import { TransationsComponent } from './transations/transations.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProductsListComponent,
    ProductsGridComponent,
    CategoriesComponent,
    OrdersComponent,
    OrdersDetailsComponent,
    AddNewProductComponent,
    AddNewProduct2Component,
    TransationsComponent
  ],
  imports: [
    CommonModule,
    EcommerceRoutingModule,
    FormsModule
  ]
})
export class EcommerceModule { }
