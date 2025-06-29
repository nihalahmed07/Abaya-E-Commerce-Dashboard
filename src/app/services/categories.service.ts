import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = 'https://cybercloudapp.com/wp-json/wc/v3/products/categories';
  private consumerKey = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4';
  private consumerSecret = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987';
  private username = 'Admin'; // replace with your WP username
  private appPassword = 'ovNL rJL8 5J84 rF8g vV43 Fi60'; // replace with your WP app password

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
  const url = `${this.baseUrl}/${id}`;
  const auth = btoa(`${this.username}:${this.appPassword}`);

  const headers = {
    'Authorization': `Basic ${auth}`
  };

  return this.http.delete(url, { headers });
}

}




