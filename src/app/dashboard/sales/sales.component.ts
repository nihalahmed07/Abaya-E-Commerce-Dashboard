
/* import { Component, OnInit } from '@angular/core';
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


} */



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
  searchTerm: string = '';
filteredTransactions: any[] = [];
paginatedTransactions: any[] = [];
transactionCurrentPage = 1;
transactionItemsPerPage = 5;
  private siteUrl = 'https://cybercloudapp.com/wp-json/wc/v3';
  private consumerKey = 'ck_a5d1866cd08f77c20b601dd09746f0f00c3b6878';
  private consumerSecret = 'cs_729c552b1298055023ea6985f4120d5619ae1c0a';



  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadCustomers();
    $.getScript('./assets/js/sales-dashboard.js'); // Ensure external JS loads if needed
  }

  // Load statistics for orders and sales data
  // loadStats() {
  //   const ordersUrl = `${this.siteUrl}/orders?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}&per_page=100`;
  //   const customersUrl = `${this.siteUrl}/customers?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`;

  //   // Fetch Orders
  //   this.http.get<any[]>(ordersUrl).subscribe(res => {
  //     this.totalOrders = res.length;
  //     this.totalSales = res.reduce((sum, order) => sum + parseFloat(order.total), 0);
  //     this.returnCount = res.filter(order => order.status === 'refunded').length;
  //     this.transactions = res.map(order => ({
  //       billing: order.billing,
  //       id: order.id,
  //       date_created: order.date_created,
  //       total: order.total,
  //       status: order.status
  //     }));

  //     // Calculate completed purchase total
  //     this.purchaseAmount = res
  //       .filter(order => order.status === 'completed')
  //       .reduce((sum, order) => sum + parseFloat(order.total), 0);
  //   });
  // }
    loadStats() {
  const ordersUrl = `${this.siteUrl}/orders?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}&per_page=100`;

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

    this.purchaseAmount = res
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + parseFloat(order.total), 0);

    // Initial setup for filtered and paginated transactions
    this.filteredTransactions = this.transactions;
    this.updatePaginatedTransactions();
  });
}
updatePaginatedTransactions(): void {
  const filtered = this.transactions.filter(t =>
    (t.billing.first_name + ' ' + t.billing.last_name)
      .toLowerCase()
      .includes(this.searchTerm.toLowerCase())
  );

  this.filteredTransactions = filtered;

  const start = (this.transactionCurrentPage - 1) * this.transactionItemsPerPage;
  const end = start + this.transactionItemsPerPage;
  this.paginatedTransactions = filtered.slice(start, end);
}
  // Fetch Customers
  // loadCustomers() {
  //   const customersUrl = `${this.siteUrl}/customers?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`;
  //   this.http.get<any[]>(customersUrl).subscribe(res => {
  //     this.customers = res;
  //     this.totalCustomers = res.length;
  //     this.totalPages = Math.ceil(this.totalCustomers / this.itemsPerPage);
  //     this.updatePagedCustomers();
  //   });
  // }
   loadCustomers() {
  const customersUrl = `${this.siteUrl}/customers?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}&per_page=100`;

  this.http.get<any[]>(customersUrl).subscribe(res => {
    console.log('Fetched customers:', res);
    // Sort manually by creation date (latest first)
    const sorted = res.sort((a, b) =>
      new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );

    // Take only the latest 5 customers
    this.pagedCustomers = sorted.slice(0, 5);
  });
}

  // Handle deletion of a customer
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

  // Handle pagination for customers
  updatePagedCustomers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedCustomers = this.customers.slice(start, end);
  }

  // Change page for pagination
  changePage(step: number): void {
    const newPage = this.currentPage + step;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updatePagedCustomers();
    }
  }
changeTransactionPage(step: number): void {
  const newPage = this.transactionCurrentPage + step;
  const maxPage = Math.ceil(this.filteredTransactions.length / this.transactionItemsPerPage);
  if (newPage >= 1 && newPage <= maxPage) {
    this.transactionCurrentPage = newPage;
    this.updatePaginatedTransactions();
  }
}

onSearchChange(): void {
  this.transactionCurrentPage = 1;
  this.updatePaginatedTransactions();
}
onTransactionLimitChange(): void {
  this.transactionCurrentPage = 1;
  this.updatePaginatedTransactions();
}
getTransactionRangeEnd(): number {
  return Math.min(
    this.transactionCurrentPage * this.transactionItemsPerPage,
    this.filteredTransactions.length
  );
}
get totalTransactionPages(): number {
  return Math.ceil(this.filteredTransactions.length / this.transactionItemsPerPage);
}
  // Show correct number of entries being displayed on current page
  get showingTo(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalCustomers);
  }
}





