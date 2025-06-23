import { Component } from '@angular/core';
import { WpProductsService } from 'src/app/services/wp-products.service';

@Component({
  selector: 'app-add-new-product2',
  templateUrl: './add-new-product2.component.html',
  styleUrls: ['./add-new-product2.component.scss']
})
export class AddNewProduct2Component {
  product: any = {
    name: '',
    sku: '',
    color: '',
    size: '',
    brand: '',
    price: '',
    description: '',
    status: 'publish', // 'draft' or 'publish'
    tags: '',
    categories: [],    // category IDs, handled separately if needed
    image: null
  };

  imageFile: File | null = null;
  isLoading = false;


  constructor(private wpService: WpProductsService) {}

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      console.log('Selected image:', file.name);
    }
  }

  publishProduct() {
    const payload: any = {
      name: this.product.name,
      type: 'simple',
      regular_price: this.product.price.toString(),
      status: this.product.status,
      sku: this.product.sku,
      description: this.product.description,
      short_description: `${this.product.brand} - ${this.product.color} - ${this.product.size}`,
      tags: this.product.tags.split(',').map(tag => ({ name: tag.trim() })),
      // categories: [{ id: 15 }, { id: 16 }] // if you're mapping categories by checkbox
    };

    this.wpService.addProduct(payload).subscribe({
      next: (res) => {
        console.log('✅ Product created:', res);
        alert('Product published successfully!');
      },
      error: (err) => {
        console.error('❌ Product creation failed:', err);
        alert('Failed to publish product.');
      }
    });
  }
}
