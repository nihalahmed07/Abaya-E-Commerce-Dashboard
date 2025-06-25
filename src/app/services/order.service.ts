import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'https://cybercloudapp.com/wp-json/wc/v3/orders';
  private consumerKey = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4';  // 🔑 your WooCommerce CK
  private consumerSecret = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987';  // 🔐 your WooCommerce CS

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any[]> {
    const params = new HttpParams()
      .set('consumer_key', this.consumerKey)
      .set('consumer_secret', this.consumerSecret);

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
