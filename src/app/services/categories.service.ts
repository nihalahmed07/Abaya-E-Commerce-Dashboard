import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = 'https://cybercloudapp.com/wp-json/wc/v3/products/categories';
  private consumerKey = 'ck_a5d1866cd08f77c20b601dd09746f0f00c3b6878';
  private consumerSecret = 'cs_729c552b1298055023ea6985f4120d5619ae1c0a';
  private username = 'Admin'; // replace with your WP username
  private appPassword = 'rYM3 RRGW GUB7 O1xg Thua h3Am'; // replace with your WP app password

  constructor(private http: HttpClient) {}

  private getAuthParams(): HttpParams {
    return new HttpParams()
      .set('consumer_key', this.consumerKey)
      .set('consumer_secret', this.consumerSecret);
  }

  // ✅ Get all categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { params: this.getAuthParams() });
  }

  // ✅ Add a new category
  addCategory(category: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, category, { params: this.getAuthParams() });
  }

  // ✅ Update existing category
  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, category, { params: this.getAuthParams() });
  }

  // ✅ Delete a category
  deleteCategory(id: number): Observable<any> {
  const url = `${this.baseUrl}/${id}?force=true`;
  const auth = btoa(`${this.username}:${this.appPassword}`);

  const headers = {
    'Authorization': `Basic ${auth}`
  };

  return this.http.delete(url, { headers });
}

}




