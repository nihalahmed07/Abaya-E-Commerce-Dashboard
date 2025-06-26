import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  totalOrders = 0;
  totalSales = 0;
  totalCustomers = 0;
  purchaseAmount = 0;       // Optional: track separately if you maintain it
  returnCount = 0;
  transactions: any[] = [];

 private siteUrl = 'https://cybercloudapp.com/wp-json/wc/v3';
private consumerKey = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4';
private consumerSecret = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987';



  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
    $.getScript("./assets/js/sales-dashboard.js"); // If charts are initialized here
  }

  loadStats() {
  const ordersUrl = `${this.siteUrl}/orders?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}&per_page=100`;
  const customersUrl = `${this.siteUrl}/customers?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`;

  this.http.get<any[]>(ordersUrl).subscribe(res => {
    this.totalOrders = res.length;
    this.totalSales = res.reduce((sum, order) => sum + parseFloat(order.total), 0);
    this.returnCount = res.filter(order => order.status === 'refunded').length;
    this.transactions = res.map(order => ({
      billing: order.billing,
      id: order.id,
      date_created: order.date_created,
      total: order.total,
      status: order.status
    }));
  });

  this.http.get<any[]>(customersUrl).subscribe(res => {
    this.totalCustomers = res.length;
  });
}

}


