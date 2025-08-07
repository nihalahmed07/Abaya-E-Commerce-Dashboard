import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WpProductsService {
  private baseUrl = 'https://cybercloudapp.com/wp-json/wc/v3/products';
  private consumerKey = 'ck_a5d1866cd08f77c20b601dd09746f0f00c3b6878';
  private consumerSecret = 'cs_729c552b1298055023ea6985f4120d5619ae1c0a';

  constructor(private http: HttpClient) {}

  private authParams(): HttpParams {
    return new HttpParams()
      .set('consumer_key', this.consumerKey)
      .set('consumer_secret', this.consumerSecret);
  }

  // ✅ Add Product
  addProduct(data: any): Observable<any> {
    const params = this.authParams();
    return this.http.post(this.baseUrl, data, { params });
  }

  // ✅ Get All Products with Filters
  getProducts(params: any): Observable<any> {
    let httpParams = this.authParams()
      .set('per_page', params.per_page || '10')
      .set('page', params.page || '1');

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.status && params.status !== 'all') httpParams = httpParams.set('status', params.status);
    if (params.stock_status && params.stock_status !== 'all') httpParams = httpParams.set('stock_status', params.stock_status);
    if (params.category && params.category !== 'all') httpParams = httpParams.set('category', params.category);

    return this.http.get(this.baseUrl, { params: httpParams, observe: 'response' });
  }

  // ✅ Get Single Product
  getProduct(id: number): Observable<any> {
    const params = this.authParams().set(
      '_fields',
      'id,name,sku,regular_price,description,status,categories,tags,images,meta_data'
    );
    return this.http.get(`${this.baseUrl}/${id}`, { params });
  }

  // ✅ Get Product Variations
  getProductVariations(productId: number): Observable<any[]> {
    const url = `${this.baseUrl}/${productId}/variations`;
    return this.http.get<any[]>(url, { params: this.authParams() });
  }

  // ✅ Create Variation
  createVariation(productId: number, data: any): Observable<any> {
    const params = this.authParams();
    return this.http.post(
      `https://cybercloudapp.com/wp-json/wc/v3/products/${productId}/variations`,
      data,
      { params }
    );
  }

  // ✅ Update Variation
  updateVariation(productId: number, variationId: number, data: any): Observable<any> {
    const params = this.authParams();
    return this.http.put(
      `https://cybercloudapp.com/wp-json/wc/v3/products/${productId}/variations/${variationId}`,
      data,
      { params }
    );
  }

  // ✅ Update Product
  updateProduct(id: number, data: any): Observable<any> {
    const params = this.authParams();
    return this.http.put(`${this.baseUrl}/${id}`, data, { params });
  }

  // ✅ Delete Product
  deleteProduct(id: number): Observable<any> {
    const params = this.authParams().set('force', 'true');
    return this.http.delete(`${this.baseUrl}/${id}`, { params });
  }

  // ✅ Get Categories
  getCategories(): Observable<any[]> {
    const url = 'https://cybercloudapp.com/wp-json/wc/v3/products/categories';
    const params = this.authParams().set('per_page', '100');
    return this.http.get<any[]>(url, { params });
  }

  // ✅ Get Tags by IDs
  getTagsByIds(ids: number[]): Observable<any[]> {
    const params = this.authParams().set('include', ids.join(','));
    return this.http.get<any[]>('https://cybercloudapp.com/wp-json/wc/v3/products/tags', { params });
  }

  // ✅ Upload Product Image (via custom secure endpoint)
  uploadImageCustom(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post('https://cybercloudapp.com/wp-json/custom/v1/upload-image', formData);
  }
}
