/* import { Component } from '@angular/core';
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
 */


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WpProductsService } from 'src/app/services/wp-products.service';
import { CategoryService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-add-new-product2',
  templateUrl: './add-new-product2.component.html',
  styleUrls: ['./add-new-product2.component.scss']
})
export class AddNewProduct2Component implements OnInit {
  productId: string | null = null;
  isEditMode: boolean = false;
  imageFile: File | null = null;
  isLoading = false;
    categoriesList: any[] = [];
  tagInput: string = '';
  newTag: string = '';

  product: any = {
    name: '',
    sku: '',
    color: '',
    size: '',
    brand: '',
    price: '',
    description: '',
    status: 'publish',
 
    tags: [] as string[],
    categories: [] as number[],
    image: null
  };

  constructor(
    private route: ActivatedRoute,
    private wpService: WpProductsService,
      private http: HttpClient,
     private categoryService: CategoryService 
  ) {}

  ngOnInit(): void {
       this.fetchCategories();
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(Number(this.productId));
    }
  }
fetchCategories(): void {
  this.categoryService.getCategories().subscribe({
    next: (data) => {
      this.categoriesList = data;
    },
    error: (err) => console.error('❌ Failed to fetch categories:', err)
  });
}
  loadProduct(id: number) {
    this.wpService.getProduct(id).subscribe({
      next: (res) => {
        this.product = {
          name: res.name || '',
          sku: res.sku || '',
          color: '', // WooCommerce may not store color directly
          size: '',
          brand: '',
          price: res.regular_price || '',
          description: res.description || '',
          status: res.status || 'publish',
          tags: res.tags?.map((tag: any) => tag.name).join(', ') || '',
          categories: res.categories?.map((cat: any) => cat.id) || [],
            image: res.images?.[0]?.src ? { url: res.images[0].src } : null
        };
      },
      error: (err) => {
        console.error('Failed to load product:', err);
      }
    });
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      console.log('Selected image:', file.name);
    }
  }
uploadImageAndPublish() {
    if (!this.imageFile) {
      this.publishProduct(); // No image to upload
      return;
    }

    const formData = new FormData();
    formData.append('image', this.imageFile);

    this.http.post<any>('https://cybercloudapp.com/wp-json/custom/v1/upload-image', formData).subscribe({
      next: (res) => {
        if (res.success && res.id) {
          this.product.image = { id: res.id, url: res.url };
          this.publishProduct(); // Continue after image upload
        } else {
          alert('Image upload failed.');
        }
      },
      error: (err) => {
        console.error('❌ Image upload error:', err);
        alert('Image upload failed.');
      }
    });
  }
toggleCategory(id: number, checked: boolean) {
  if (checked) {
    if (!this.product.categories.includes(id)) {
      this.product.categories.push(id);
    }
  } else {
    this.product.categories = this.product.categories.filter(catId => catId !== id);
  }
}

removeCategory(id: number) {
  this.product.categories = this.product.categories.filter(catId => catId !== id);
}
addTag() {
  const trimmedTag = this.newTag.trim();
  if (trimmedTag && !this.product.tags.includes(trimmedTag)) {
    this.product.tags.push(trimmedTag);
  }
  this.newTag = ''; // Clear input
}

removeTag(tag: string) {
  this.product.tags = this.product.tags.filter(t => t !== tag);
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
      // tags: this.product.tags.split(',').map((tag: string) => ({ name: tag.trim() })),
        tags: this.product.tags.map((tag: string) => ({ name: tag.trim() })),
      categories: this.product.categories.map((id: number) => ({ id }))

    };

       // ✅ Include uploaded image
    if (this.product.image?.id) {
      payload.images = [{ id: this.product.image.id }];
    }

//     if (this.isEditMode && this.productId) {
//       this.wpService.updateProduct(Number(this.productId), payload).subscribe({
//         next: (res) => {
//           alert('✅ Product updated successfully!');
//         },
//         error: (err) => {
//           console.error('❌ Update failed:', err);
//           alert('Failed to update product.');
//         }
//       });
//     } else {
//       this.wpService.addProduct(payload).subscribe({
//         next: (res) => {
//           alert('✅ Product created successfully!');
//         },
//         error: (err) => {
//           console.error('❌ Creation failed:', err);
//           alert('Failed to create product.');
//         }
//       });
//     }
//   }
// }

 if (this.isEditMode && this.productId) {
      this.wpService.updateProduct(Number(this.productId), payload).subscribe({
        next: () => alert('✅ Product updated successfully!'),
        error: (err) => {
          console.error('❌ Update failed:', err);
          alert('Failed to update product.');
        }
      });
    } else {
      this.wpService.addProduct(payload).subscribe({
        next: () => alert('✅ Product created successfully!'),
        error: (err) => {
          console.error('❌ Creation failed:', err);
          alert('Failed to create product.');
        }
      });
    }
  }
}