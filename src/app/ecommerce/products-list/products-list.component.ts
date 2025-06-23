import { Component, OnInit } from '@angular/core';
import { WpProductsService } from 'src/app/services/wp-products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  products: any[] = [];
  totalPages = 1;
  currentPage = 1;

  filter = {
    category: 'all',
    status: 'all',
    stock_status: 'all',
    search: ''
  };

  selectedProduct: any = null;
  editMode = false;

  constructor(private wpService: WpProductsService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 1): void {
    this.currentPage = page;
    this.wpService.getProducts({ ...this.filter, page }).subscribe(response => {
      this.products = response.body;
      this.totalPages = +response.headers.get('X-WP-TotalPages') || 1;
    });
  }

  onCategoryChange(val: string) {
    this.filter.category = val;
    this.loadProducts(1);
  }

  onStatusChange(val: string) {
    this.filter.status = val;
    this.loadProducts(1);
  }

  onStockChange(val: string) {
    this.filter.stock_status = val;
    this.loadProducts(1);
  }

  onSearch(val: string) {
    this.filter.search = val;
    this.loadProducts(1);
  }

  viewProduct(product: any): void {
    this.selectedProduct = product;
    this.editMode = false;
  }

  editProduct(product: any): void {
    this.selectedProduct = { ...product };;
    this.editMode = true;
  }


  saveProduct(): void {
const payload = {
  name: this.selectedProduct.name,
  price: this.selectedProduct.price.toString(),
  status: this.selectedProduct.status,
  type: 'simple' // 🔒 fallback
};
console.log('Sending update payload:', payload);

  this.wpService.updateProduct(this.selectedProduct.id, payload).subscribe({
    next: () => {
      this.loadProducts(this.currentPage);
      this.selectedProduct = null;
      this.editMode = false;
    },
    error: (err) => {
      console.error('Failed to update product:', err);
      alert('Error saving product');
    }
  });
}



  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.wpService.deleteProduct(id).subscribe(() => {
        this.loadProducts(this.currentPage);
      });
    }
  }
}
