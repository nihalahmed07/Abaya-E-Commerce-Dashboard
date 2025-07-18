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
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-add-new-product2',
  templateUrl: './add-new-product2.component.html',
  styleUrls: ['./add-new-product2.component.scss']
})

export class AddNewProduct2Component implements OnInit {
   @ViewChild('fileInput') fileInput!: ElementRef;
  productId: string | null = null;
  isEditMode: boolean = false;
  imageFile: File | null = null;
  isLoading = false;
  categoriesList: any[] = [];
  tagInput: string = '';
  newTag: string = '';
  imagePreview: string = '';
  color: string = '';
size: string = '';
brand: string = '';
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
  // loadProduct(id: number) {
  //   this.wpService.getProduct(id).subscribe({
  //     next: (res) => {
  //       this.product = {
  //         name: res.name || '',
  //         sku: res.sku || '',
  //         color: '',
  //         size: '',
  //         brand: '',
  //         price: res.regular_price || '',
  //         description: res.description || '',
  //         status: res.status || 'publish',
  //         tags: res.tags?.map((tag: any) => tag.name).join(', ') || '',
  //         categories: res.categories?.map((cat: any) => cat.id) || [],
  //         image: res.images?.[0]?.src ? { url: res.images[0].src } : null
  //       };
  //     },
  //     error: (err) => {
  //       console.error('Failed to load product:', err);
  //     }
  //   });
  // }

loadProduct(id: number) {
  this.wpService.getProduct(id).subscribe({
    next: (res) => {
      console.log('✅ FULL PRODUCT RESPONSE:', res);
      console.log('🟡 META DATA:', res.meta_data);

      const color = this.getMetaValue(res.meta_data, 'color');
      const size = this.getMetaValue(res.meta_data, 'size');
      const brand = this.getMetaValue(res.meta_data, 'brand');

      console.log('🎯 Extracted Meta:', { color, size, brand });

      this.product = {
        name: res.name || '',
        sku: res.sku || '',
        color,
        size,
        brand,
        price: res.regular_price || '',
        description: res.description || '',
        status: res.status || 'publish',
        tags: [],
        categories: res.categories?.map((cat: any) => cat.id) || [],
        image: res.images?.[0]
          ? { id: res.images[0].id, url: res.images[0].src }
          : null,
      };

      this.color = color;
      this.size = size;
      this.brand = brand;

      const tagIds = res.tags?.map(tag => tag.id) || [];
      if (tagIds.length > 0) {
        this.wpService.getTagsByIds(tagIds).subscribe({
          next: (tags: any[]) => {
            this.product.tags = tags.map(tag => tag.name);
          },
          error: (err) => console.error('Failed to load tags:', err)
        });
      }

      this.imagePreview = this.product.image?.url || '';
    },
    error: (err) => {
      console.error('❌ Failed to load product:', err);
    }
  });
}


getMetaValue(metaData: any[], key: string): string {
  if (!Array.isArray(metaData)) return '';
  const found = metaData.find(meta => meta.key.toLowerCase() === key.toLowerCase());
  return found?.value ?? '';
}
handleImageUpload(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.imageFile = file;

    // ✅ Create a preview URL immediately
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result; // This will be the base64 image
    };
    reader.readAsDataURL(file);

    console.log('✅ Selected image:', file.name);
  }
}
removeImage() {
  this.imagePreview = null;
  this.imageFile = null;
    if (this.fileInput) {
    this.fileInput.nativeElement.value = '';
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
    regular_price: (this.product.price ?? '').toString(),
    status: this.product.status,
    sku: this.product.sku,
    description: this.product.description,
    short_description: `${this.product.brand} - ${this.product.color} - ${this.product.size}`,
    tags: this.product.tags
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0)
      .map((tag: string) => ({ name: tag })),
    categories: this.product.categories.map((id: number) => ({ id })),
    meta_data: [
      { key: 'color', value: this.product.color },
      { key: 'size', value: this.product.size },
      { key: 'brand', value: this.product.brand }
    ]
  };

  if (this.product.image?.id) {
    payload.images = [{ id: this.product.image.id }];
  }

  // 🔍 Debug here:
  console.log('📦 FINAL PAYLOAD SENT TO API:', payload);

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

  get tagsAsString(): string {
  return this.product.tags.join(', ');
}

set tagsAsString(value: string) {
  this.product.tags = value.split(',').map(tag => tag.trim());
}
}
