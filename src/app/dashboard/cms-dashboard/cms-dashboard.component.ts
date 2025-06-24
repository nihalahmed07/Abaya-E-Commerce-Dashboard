import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-cms-dashboard',
  templateUrl: './cms-dashboard.component.html',
  styleUrls: ['./cms-dashboard.component.scss']
})
export class CmsDashboardComponent implements OnInit {

  productCount = 0;
  pageCount = 0;
  userCount = 0;
  categoryCount = 0;

  private baseUrl = 'https://cybercloudapp.com/wp-json';
  private wcKey = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4';
  private wcSecret = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProductCount();
    this.fetchPageCount();
    this.fetchUserCount();
    this.fetchCategoryCount();
  }

  fetchProductCount() {
    const url = `${this.baseUrl}/wc/v3/products`;
    const params = new HttpParams()
      .set('consumer_key', this.wcKey)
      .set('consumer_secret', this.wcSecret)
      .set('per_page', '1');
    this.http.get<any[]>(url, { params, observe: 'response' }).subscribe(res => {
      this.productCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
    });
  }

  fetchPageCount() {
    const url = `${this.baseUrl}/wp/v2/pages`;
    this.http.get<any[]>(url, { observe: 'response' }).subscribe(res => {
      this.pageCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
    });
  }

  fetchUserCount() {
    const url = `${this.baseUrl}/wp/v2/users`;
    const params = new HttpParams()
      .set('context', 'edit') // May require auth
      .set('per_page', '1');
    this.http.get<any[]>(url, { params, observe: 'response' }).subscribe(res => {
      this.userCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
    }, err => {
      this.userCount = 0;
    });
  }

  fetchCategoryCount() {
    const url = `${this.baseUrl}/wp/v2/categories`;
    this.http.get<any[]>(url, { observe: 'response' }).subscribe(res => {
      this.categoryCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
    });
  }
}
