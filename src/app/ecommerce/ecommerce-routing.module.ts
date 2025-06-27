import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import { AddNewProduct2Component } from './add-new-product2/add-new-product2.component';
import { CategoriesComponent } from './categories/categories.component';
import { OrdersDetailsComponent } from './orders-details/orders-details.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsGridComponent } from './products-grid/products-grid.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { TransationsComponent } from './transations/transations.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /* {
        path: 'products-list',
        component: ProductsListComponent,
        data: {
          title: 'Products List'
        }
      }, */
      {
        path: 'products-grid',
        component: ProductsGridComponent,
        data: {
          title: 'Products Grid'
        }
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        data: {
          title: 'Categories'
        }
      },
      {
        path: 'orders',
        component: OrdersComponent,
        data: {
          title: 'Orders'
        }
      },
      {
        path: 'orders-details',
        component: OrdersDetailsComponent,
        data: {
          title: 'Orders Details'
        }
      },
      // {
      //   path: 'add-new-product',
      //   component: AddNewProductComponent,
      //   data: {
      //     title: 'Add New Product'
      //   }
      // },
      {
  path: 'add-new-product',
  component: AddNewProduct2Component,
  data: {
    title: 'Add New Product'
  }
},
{
  path: 'edit-product/:id',
  component: AddNewProduct2Component,
  data: {
    title: 'Edit Product'
  }
},

      {
        path: 'transations',
        component: TransationsComponent,
        data: {
          title: 'Transations'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcommerceRoutingModule { }
