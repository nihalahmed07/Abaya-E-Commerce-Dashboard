import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WpProductsService {
  private baseUrl = 'https://cybercloudapp.com/wp-json/wc/v3/products';
  private consumerKey = 'ck_a5d1866cd08f77c20b601dd09746f0f00c3b6878';
  private consumerSecret = 'cs_729c552b1298055023ea6985f4120d5619ae1c0a';

  constructor(private http: HttpClient) {}

  getProducts(params: any): Observable<any> {
    let httpParams = new HttpParams()
      .set('consumer_key', this.consumerKey)
      .set('consumer_secret', this.consumerSecret)
      .set('per_page', params.per_page || '10')
      .set('page', params.page || '1');

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.status && params.status !== 'all') httpParams = httpParams.set('status', params.status);
    if (params.stock_status && params.stock_status !== 'all') httpParams = httpParams.set('stock_status', params.stock_status);
    if (params.category && params.category !== 'all') httpParams = httpParams.set('category', params.category);

    return this.http.get(this.baseUrl, { params: httpParams, observe: 'response' });
  }

  getCategories(): Observable<any[]> {
  const url = 'https://cybercloudapp.com/wp-json/wc/v3/products/categories';
  const params = new HttpParams()
    .set('consumer_key', this.consumerKey)
    .set('consumer_secret', this.consumerSecret)
    .set('per_page', '100');

  return this.http.get<any[]>('https://cybercloudapp.com/wp-json/wc/v3/products/categories', { params });
}


  // Get single product
// getProduct(id: number): Observable<any> {
//   const params = this.authParams();
//   return this.http.get(`${this.baseUrl}/${id}`, { params });
// }
getProduct(id: number): Observable<any> {
  const params = this.authParams()
    .set('_fields', 'id,name,sku,regular_price,description,status,categories,tags,images,meta_data');

  return this.http.get(`${this.baseUrl}/${id}`, { params });
}
// Update product
updateProduct(id: number, data: any): Observable<any> {
  const params = this.authParams();
  return this.http.put(`${this.baseUrl}/${id}`, data, { params });
}

// Delete product
deleteProduct(id: number): Observable<any> {
  const params = this.authParams().set('force', 'true'); // hard delete, remove for soft
  return this.http.delete(`${this.baseUrl}/${id}`, { params });
}

// Utility for auth
private authParams(): HttpParams {
  return new HttpParams()
    .set('consumer_key', this.consumerKey)
    .set('consumer_secret', this.consumerSecret);
}

addProduct(data: any) {
  const params = new HttpParams()
    .set('consumer_key', this.consumerKey)
    .set('consumer_secret', this.consumerSecret);

  return this.http.post(this.baseUrl, data, { params });
}
// uploadImage(file: File): Observable<any> {
//   const formData = new FormData();
//   formData.append('file', file);

//   const username = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4'; // 🔐 Your Consumer Key
//   const password = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987'; // 🔐 Your Consumer Secret
//   const authHeader = 'Basic ' + btoa(`${username}:${password}`);

//   return this.http.post(`https://cybercloudapp.com/wp-json/wp/v2/media`, formData, {
//     headers: {
//       Authorization: authHeader,
//       'Content-Disposition': `attachment; filename="${file.name}"`
//     }
//   });
// }

uploadImage(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);

  const username = 'admin';
  const appPassword = 'Abcd246@1'; // Create from WordPress user profile
  const base64Token = btoa(`${username}:${appPassword}`);

  return this.http.post('https://cybercloudapp.com/wp-json/wp/v2/media', formData, {
    headers: {
      Authorization: `Basic ${base64Token}`,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    }
  });
}


getTagsByIds(ids: number[]): Observable<any[]> {
  const params = new HttpParams()
    .set('consumer_key', this.consumerKey)
    .set('consumer_secret', this.consumerSecret)
    .set('include', ids.join(','));

  return this.http.get<any[]>('https://cybercloudapp.com/wp-json/wc/v3/products/tags', { params });
}


}
