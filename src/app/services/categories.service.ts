/* // services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = 'https://yourdomain.com/wp-json/wc/v3/products/categories';
  private consumerKey = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4';
  private consumerSecret = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    const params = new HttpParams()
      .set('consumer_key', this.consumerKey)
      .set('consumer_secret', this.consumerSecret);

    return this.http.get<any[]>(this.baseUrl, { params });
  }
} */


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = 'https://cybercloudapp.com/wp-json/wc/v3/products/categories';
  private consumerKey = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4';
  private consumerSecret = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987';

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
  const headers = {
    Authorization: 'Basic ' + btoa(`${this.consumerKey}:${this.consumerSecret}`)
  };

  return this.http.delete(url, { headers });
}

}




