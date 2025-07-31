import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('fileInput') fileInput!: ElementRef;

  productId: string | null = null;
  isEditMode = false;
  imageFile: File | null = null;
  isLoading = false;
  categoriesList: any[] = [];

  newTag = '';
  imagePreview = '';
  customSize = '';

  predefinedSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  product: any = {
    name: '',
    sku: '',
    color: '',
    brand: '',
    description: '',
    status: 'publish',
    tags: [] as string[],
    categories: [] as number[],
    sizes: [] as { size: string; stock: number; price: number }[],
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
          color: this.getMetaValue(res.meta_data, 'color'),
          brand: this.getMetaValue(res.meta_data, 'brand'),
          description: res.description || '',
          status: res.status || 'publish',
          tags: [],
          categories: res.categories?.map((cat: any) => cat.id) || [],
          image: res.images?.[0] ? { id: res.images[0].id, url: res.images[0].src } : null,
          sizes: []
        };

        this.imagePreview = this.product.image?.url || '';

        const tagIds = res.tags?.map(tag => tag.id) || [];
        if (tagIds.length > 0) {
          this.wpService.getTagsByIds(tagIds).subscribe({
            next: (tags: any[]) => {
              this.product.tags = tags.map(tag => tag.name);
            },
            error: (err) => console.error('Failed to load tags:', err)
          });
        }
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
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const targetWidth = 433;
        const targetHeight = 577;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Fill white background
        ctx!.fillStyle = '#ffffff';
        ctx!.fillRect(0, 0, targetWidth, targetHeight);

        // Maintain aspect ratio
        const imgRatio = img.width / img.height;
        const targetRatio = targetWidth / targetHeight;

        let drawWidth = targetWidth;
        let drawHeight = targetHeight;

        if (imgRatio > targetRatio) {
          drawWidth = targetHeight * imgRatio;
          drawHeight = targetHeight;
        } else {
          drawWidth = targetWidth;
          drawHeight = targetWidth / imgRatio;
        }

        const offsetX = (targetWidth - drawWidth) / 2;
        const offsetY = (targetHeight - drawHeight) / 2;

        ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], file.name, { type: 'image/jpeg' });
            this.imageFile = croppedFile;

            const previewReader = new FileReader();
            previewReader.onload = (pe: any) => {
              this.imagePreview = pe.target.result;
            };
            previewReader.readAsDataURL(croppedFile);
          }
        }, 'image/jpeg', 0.9); // 90% quality
      };
    };

    reader.readAsDataURL(file);
  }

  removeImage() {
    this.imagePreview = '';
    this.imageFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  addTag() {
    const trimmedTag = this.newTag.trim();
    if (trimmedTag && !this.product.tags.includes(trimmedTag)) {
      this.product.tags.push(trimmedTag);
    }
    this.newTag = '';
  }

  removeTag(tag: string) {
    this.product.tags = this.product.tags.filter(t => t !== tag);
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

  isSizeAdded(size: string): boolean {
    return this.product.sizes.some(s => s.size.trim().toUpperCase() === size.trim().toUpperCase());
  }

  addSize(size: string): void {
    const normalized = size.trim().toUpperCase();
    if (!this.isSizeAdded(normalized)) {
      this.product.sizes.push({ size: normalized, stock: 0, price: 0 });
    }
  }

  addCustomSize(): void {
    const trimmed = this.customSize.trim().toUpperCase();
    if (trimmed && !this.isSizeAdded(trimmed)) {
      this.product.sizes.push({ size: trimmed, stock: 0, price: 0 });
      this.customSize = '';
    }
  }

  removeSize(index: number): void {
    this.product.sizes.splice(index, 1);
  }

  updateStock(index: number, stock: number) {
    this.product.sizes[index].stock = stock;
  }

  updatePrice(index: number, price: number) {
    this.product.sizes[index].price = price;
  }

  async uploadImageAndPublish() {
    if (!this.imageFile) {
      this.publishProduct();
      return;
    }

    const formData = new FormData();
    formData.append('image', this.imageFile);

    this.http.post<any>('https://cybercloudapp.com/wp-json/custom/v1/upload-image', formData).subscribe({
      next: (res) => {
        if (res.success && res.id) {
          this.product.image = { id: res.id, url: res.url };
          this.publishProduct();
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

  async publishProduct() {
    this.isLoading = true;

    const payload: any = {
      name: this.product.name,
      type: 'variable',
      status: this.product.status,
      description: this.product.description,
      short_description: `${this.product.brand} - ${this.product.color} - Sizes: ${this.product.sizes.map(s => s.size).join(', ')}`,
      tags: this.product.tags.map(tag => ({ name: tag.trim() })),
      categories: this.product.categories.map(id => ({ id })),
      attributes: [
        {
          name: 'Size',
          variation: true,
          visible: true,
          options: this.product.sizes.map(s => s.size)
        }
      ],
      meta_data: [
        { key: 'color', value: this.product.color },
        { key: 'brand', value: this.product.brand }
      ]
    };

    if (this.product.image?.id) {
      payload.images = [{ id: this.product.image.id }];
    }

    try {
      if (this.isEditMode && this.productId) {
        await this.wpService.updateProduct(Number(this.productId), payload).toPromise();
        alert('✅ Product updated!');
      } else {
        const createdProduct = await this.wpService.addProduct(payload).toPromise();
        const productId = createdProduct.id;

        const variationPromises = this.product.sizes.map(s => this.wpService.createVariation(productId, {
          regular_price: s.price.toString(),
          stock_quantity: s.stock,
          manage_stock: true,
          status: 'publish',
          attributes: [
            {
              name: 'Size',
              option: s.size
            }
          ]
        }).toPromise());

        await Promise.all(variationPromises);
        alert('✅ Product and variations added!');
      }
    } catch (err) {
      console.error('❌ Failed to publish product:', err);
      alert('❌ Product publish failed.');
    } finally {
      this.isLoading = false;
    }
  }

  get tagsAsString(): string {
    return this.product.tags.join(', ');
  }

  set tagsAsString(value: string) {
    this.product.tags = value.split(',').map(tag => tag.trim());
  }
}
