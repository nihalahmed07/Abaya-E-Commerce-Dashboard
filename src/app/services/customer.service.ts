import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private siteUrl = '/wp-json/wc/v3/orders';
  private consumerKey = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4';  
  private consumerSecret = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987'; 

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<any[]> {
    const url = `${this.siteUrl}/wp-json/wc/v3/customers?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`;
    return this.http.get<any[]>(url);
  }
}
