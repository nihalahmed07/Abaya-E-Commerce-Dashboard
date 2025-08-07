import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WpProductsService } from 'src/app/services/wp-products.service';
import { CategoryService } from 'src/app/services/categories.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-new-product2',
  templateUrl: './add-new-product2.component.html',
  styleUrls: ['./add-new-product2.component.scss']
})
export class AddNewProduct2Component implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  productId: string | null = null;
  isEditMode = false;
  isLoading = false;
  categoriesList: any[] = [];

  newTag = '';
  customSize = '';

  predefinedSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  imageFiles: File[] = [];
  imagePreviews: { url: string, index: number }[] = [];

  product: any = {
    name: '',
    sku: '',
    color: '',
    brand: '',
    description: '',
    status: 'publish',
    tags: [],
    categories: [],
    sizes: [],
    images: []
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
      this.loadProduct(+this.productId);
    }
  }

  fetchCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categoriesList = data,
      error: (err) => console.error('❌ Categories fetch failed', err)
    });
  }

  loadProduct(id: number) {
    this.wpService.getProduct(id).subscribe({
      next: (res) => {
        this.product = {
          name: res.name || '',
          sku: res.sku || '',
          color: this.getMetaValue(res.meta_data, 'color'),
          brand: this.getMetaValue(res.meta_data, 'brand'),
          description: res.description || '',
          status: res.status || 'publish',
          tags: [],
          categories: res.categories?.map((cat: any) => cat.id) || [],
          sizes: [],
          images: res.images?.map((img: any) => ({ id: img.id, url: img.src })) || []
        };

        this.imagePreviews = this.product.images.map((img, i) => ({
          url: img.url!,
          index: i
        }));

        const tagIds = res.tags?.map((tag: any) => tag.id) || [];
        if (tagIds.length > 0) {
          this.wpService.getTagsByIds(tagIds).subscribe({
            next: (tags: any[]) => {
              this.product.tags = tags.map(tag => tag.name);
            }
          });
        }

        this.wpService.getProductVariations(id).subscribe({
          next: (variations) => {
            this.product.sizes = variations.map(v => {
              const sizeAttr = v.attributes.find((a: any) => a.name.toLowerCase() === 'size');
              return {
                variation_id: v.id,
                size: sizeAttr?.option || '',
                stock: v.stock_quantity || 0,
                price: parseFloat(v.regular_price || '0')
              };
            });
          }
        });
      }
    });
  }

  getMetaValue(meta: any[], key: string): string {
    const found = meta.find(m => m.key.toLowerCase() === key.toLowerCase());
    return found?.value || '';
  }

  onImageChange(event: any) {
  const files = Array.from(event.target.files) as File[];

  const startingIndex = this.imageFiles.length;

  files.forEach((file, i) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreviews.push({
        url: e.target.result,
        index: startingIndex + i
      });
    };

    this.imageFiles.push(file);
    reader.readAsDataURL(file);
  });
}

 removeImage(index: number) {
  this.imagePreviews = this.imagePreviews.filter(img => img.index !== index);
  this.imageFiles.splice(index, 1);

  // Re-index after removal
  this.imagePreviews = this.imagePreviews.map((img, i) => ({
    ...img,
    index: i
  }));
}


  addTag() {
    const tag = this.newTag.trim();
    if (tag && !this.product.tags.includes(tag)) {
      this.product.tags.push(tag);
    }
    this.newTag = '';
  }

  removeTag(tag: string) {
    this.product.tags = this.product.tags.filter(t => t !== tag);
  }

  toggleCategory(id: number, checked: boolean) {
    if (checked && !this.product.categories.includes(id)) {
      this.product.categories.push(id);
    } else {
      this.product.categories = this.product.categories.filter(catId => catId !== id);
    }
  }

  removeCategory(id: number) {
    this.product.categories = this.product.categories.filter(catId => catId !== id);
  }

  isSizeAdded(size: string) {
    return this.product.sizes.some(s => s.size.toUpperCase() === size.toUpperCase());
  }

  addSize(size: string) {
    const s = size.trim().toUpperCase();
    if (!this.isSizeAdded(s)) {
      this.product.sizes.push({ size: s, stock: 0, price: 0 });
    }
  }

  addCustomSize() {
    const s = this.customSize.trim().toUpperCase();
    if (s && !this.isSizeAdded(s)) {
      this.product.sizes.push({ size: s, stock: 0, price: 0 });
    }
    this.customSize = '';
  }

  removeSize(i: number) {
    this.product.sizes.splice(i, 1);
  }

  uploadImageAndPublish() {
    if (this.imageFiles.length === 0) {
      this.publishProduct();
      return;
    }

    const uploads = this.imageFiles.map(file =>
      this.wpService.uploadImageCustom(file)
    );

    forkJoin(uploads).subscribe({
      next: (responses) => {
        this.product.images = responses
          .filter(res => res.success && res.id)
          .map(res => ({ id: res.id, url: res.url }));
        this.publishProduct();
      },
      error: () => {
        alert('❌ Failed to upload images.');
      }
    });
  }

  async publishProduct() {
    this.isLoading = true;

    const payload: any = {
      name: this.product.name,
      type: 'variable',
      status: this.product.status,
      description: this.product.description,
      short_description: `${this.product.brand} - ${this.product.color} - Sizes: ${this.product.sizes.map(s => s.size).join(', ')}`,
      tags: this.product.tags.map(t => ({ name: t })),
      categories: this.product.categories.map(id => ({ id })),
      attributes: [{
        name: 'Size',
        variation: true,
        visible: true,
        options: this.product.sizes.map(s => s.size)
      }],
      meta_data: [
        { key: 'brand', value: this.product.brand },
        { key: 'color', value: this.product.color }
      ],
      images: this.product.images.map(img => ({ id: img.id }))
    };

    try {
      const id = this.isEditMode
        ? +this.productId!
        : (await this.wpService.addProduct(payload).toPromise()).id;

      if (this.isEditMode) {
        await this.wpService.updateProduct(id, payload).toPromise();
      }

      const variationPromises = this.product.sizes.map(async (s) => {
        const data = {
          regular_price: s.price.toString(),
          stock_quantity: s.stock,
          manage_stock: true,
          status: 'publish',
          attributes: [{ name: 'Size', option: s.size }]
        };

        if (s.variation_id) {
          return this.wpService.updateVariation(id, s.variation_id, data).toPromise();
        } else {
          return this.wpService.createVariation(id, data).toPromise();
        }
      });

      await Promise.all(variationPromises);
      alert('✅ Product and variations saved!');
    } catch (err) {
      console.error('❌ Product publish error', err);
      alert('❌ Failed to publish product');
    } finally {
      this.isLoading = false;
    }
  }
}
