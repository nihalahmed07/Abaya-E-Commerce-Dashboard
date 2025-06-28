import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EarningsService {
  private siteUrl = '/wp-json/wc-analytics';
  private consumerKey = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4';
  private consumerSecret = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987';

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
