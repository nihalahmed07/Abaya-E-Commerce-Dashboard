import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private siteUrl = 'https://cybercloudapp.com/wp-json/wc/v3/orders';
  private consumerKey = 'ck_a5d1866cd08f77c20b601dd09746f0f00c3b6878';  
  private consumerSecret = 'cs_729c552b1298055023ea6985f4120d5619ae1c0a'; 

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<any[]> {
    const url = `${this.siteUrl}/wp-json/wc/v3/customers?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`;
    return this.http.get<any[]>(url);
  }
}
