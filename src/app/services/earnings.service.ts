import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EarningsService {
  private siteUrl = 'https://cybercloudapp.com/wp-json/wc-analytics';
  private consumerKey = 'ck_a5d1866cd08f77c20b601dd09746f0f00c3b6878';
  private consumerSecret = 'cs_729c552b1298055023ea6985f4120d5619ae1c0a';

  constructor(private http: HttpClient) {}

  getDailyStats() {
    const url = `${this.siteUrl}/reports/orders/stats?interval=day&per_page=30&consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`;
    return this.http.get<any>(url);
  }

  getOrders() {
    const url = `${this.siteUrl.replace('/wc-analytics', '/wc/v3')}/orders?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}&per_page=100`;
    return this.http.get<any[]>(url);
  }
}
