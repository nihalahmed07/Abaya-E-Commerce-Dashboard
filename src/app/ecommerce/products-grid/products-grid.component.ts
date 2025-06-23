import { Component, OnInit } from '@angular/core';
import { WpProductsService } from 'src/app/services/wp-products.service';

@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss']
})
export class ProductsGridComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;

  constructor(private wpService: WpProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.wpService.getProducts({ per_page: 20 }).subscribe(response => {
      this.products = response.body;
    });
  }

  editProduct(product: any): void {
    this.selectedProduct = { ...product };
    // You can show a modal here (Bootstrap/ngx-bootstrap/etc.)
  }

  deleteProduct(id: number): void {
    if (confirm('Delete this product?')) {
      this.wpService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
