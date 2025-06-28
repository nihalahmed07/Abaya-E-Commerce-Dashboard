import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  pagedCategories: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  newCategory = {
    name: '',
    slug: '',
    parent: 0,
    description: ''
  };
  editingCategoryId: number | null = null;

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
        this.updatePagedCategories();
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  updatePagedCategories() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedCategories = this.categories.slice(start, end);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagedCategories();
  }

  changePage(step: number) {
    const nextPage = this.currentPage + step;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.currentPage = nextPage;
      this.updatePagedCategories();
    }
  }

  addCategory() {
    this.categoryService.addCategory(this.newCategory).subscribe({
      next: () => {
        this.loadCategories();
        this.newCategory = { name: '', slug: '', parent: 0, description: '' };
      },
      error: (err) => console.error('Failed to add category', err)
    });
  }

  editCategory(category: any) {
    this.editingCategoryId = category.id;
    this.newCategory = { ...category };
  }

  updateCategory() {
    if (this.editingCategoryId !== null) {
      this.categoryService.updateCategory(this.editingCategoryId, this.newCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.editingCategoryId = null;
          this.newCategory = { name: '', slug: '', parent: 0, description: '' };
        },
        error: (err) => console.error('Failed to update category', err)
      });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          alert('Category deleted successfully.');
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Failed to delete category.');
        }
      });
    }
  }

  viewCategory(slug: string) {
    window.open(`https://cybercloudapp.com/product-category/${slug}`, '_blank');
  }
}
