import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  totalOrders = 0;
  totalSales = 0;
  totalCustomers = 0;
  purchaseAmount = 0;
  returnCount = 0;
  transactions: any[] = [];
  customers: any[] = [];
  pagedCustomers: any[] = [];
currentPage = 1;
itemsPerPage = 5;

totalPages = 1;

  private siteUrl = '/wp-json/wc/v3';
  private consumerKey = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4';
  private consumerSecret = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
    $.getScript('./assets/js/sales-dashboard.js');
  }

  loadStats() {
    const ordersUrl = `${this.siteUrl}/orders?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}&per_page=100`;
    const customersUrl = `${this.siteUrl}/customers?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`;

    // Fetch Orders
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

      // ✅ Calculate completed purchase total
      this.purchaseAmount = res
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + parseFloat(order.total), 0);
    });

    // Fetch Customers
    this.http.get<any[]>(customersUrl).subscribe(res => {
  this.customers = res;
  this.totalCustomers = res.length;
  this.totalPages = Math.ceil(this.totalCustomers / this.itemsPerPage);
  this.updatePagedCustomers();
});

  }

  deleteCustomer(id: number): void {
    const deleteUrl = `${this.siteUrl}/customers/${id}?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}&force=true`;

    if (confirm('Are you sure you want to delete this customer?')) {
      this.http.delete(deleteUrl).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.id !== id);
          alert('Customer deleted successfully.');
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Failed to delete customer. Check API permissions.');
        }
      });
    }
  }
  updatePagedCustomers(): void {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.pagedCustomers = this.customers.slice(start, end);
}

changePage(step: number): void {
  const newPage = this.currentPage + step;
  if (newPage >= 1 && newPage <= this.totalPages) {
    this.currentPage = newPage;
    this.updatePagedCustomers();
  }
}
get showingTo(): number {
  return Math.min(this.currentPage * this.itemsPerPage, this.totalCustomers);
}


}




