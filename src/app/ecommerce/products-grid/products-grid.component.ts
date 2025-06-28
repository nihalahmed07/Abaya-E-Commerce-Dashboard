/* import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WpProductsService } from 'src/app/services/wp-products.service';

@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss']
})
export class ProductsGridComponent implements OnInit {
  products: any[] = [];
  searchTerm: string = ''; // 👈 for search input binding
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private wpService: WpProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // ✅ Load products with optional search term
  loadProducts(): void {
    const params: any = {
      per_page: 12,
      page: this.currentPage
    };

    if (this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }

    this.wpService.getProducts(params).subscribe(response => {
      this.products = response.body;
      const total = Number(response.headers.get('X-WP-Total'));
    this.totalPages = Math.ceil(total / 12);
    });
  }

  // ✅ Triggered when user types in search box
  onSearchChange(): void {
    this.currentPage=1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  // ✅ Navigate to edit page
  editProduct(product: any): void {
    this.router.navigate(['/ecommerce/edit-product', product.id]);
  }

  // ✅ Delete product and refresh list
  deleteProduct(id: number): void {
    if (confirm('Delete this product?')) {
      this.wpService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
} */



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WpProductsService } from 'src/app/services/wp-products.service';

@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss']
})
export class ProductsGridComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  perPage: number = 12;

  selectedCategory: string = '';
  selectedSort: string = '';

  constructor(
    private wpService: WpProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.wpService.getCategories().subscribe((data: any[]) => {
      this.categories = data;
    });
  }

  loadProducts(): void {
    const params: any = {
      per_page: this.perPage,
      page: this.currentPage
    };

    if (this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }

    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }

    if (this.selectedSort) {
      switch (this.selectedSort) {
        case 'date-desc':
          params.orderby = 'date';
          params.order = 'desc';
          break;
          case 'price-asc':
            params.orderby = 'meta_value';
            params.meta_key = '_price';
            params.order = 'asc';
            break;
            case 'price-desc':
              params.orderby = 'price';
              params.order = 'desc';
              break;
              case 'title-asc':
                params.orderby = 'title';
                params.order = 'asc';
                break;
                case 'title-desc':
                  params.orderby = 'title';
                  params.order = 'desc';
                  break;
                }
                console.log('Loading with params:', params);
    }


    this.wpService.getProducts(params).subscribe(response => {
      this.products = response.body;
      const totalItems = Number(response.headers.get('X-WP-Total')) || 0;
      this.totalPages = Math.ceil(totalItems / this.perPage);
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }
  
  onCategoryChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }
  
  onSortChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  editProduct(product: any): void {
    this.router.navigate(['/ecommerce/edit-product', product.id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Delete this product?')) {
      this.wpService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}

