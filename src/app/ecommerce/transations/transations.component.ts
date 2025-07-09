import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-transations',
  templateUrl: './transations.component.html',
  styleUrls: ['./transations.component.scss']
})
export class TransationsComponent implements OnInit {
  transactions: any[] = [];
  allTransactions: any[] = [];
  selectedStatus: string = '';
  perPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    const url = 'https://cybercloudapp.com/wp-json/wc/v3/orders';
    const username = 'ck_a5d1866cd08f77c20b601dd09746f0f00c3b6878';
    const password = 'cs_729c552b1298055023ea6985f4120d5619ae1c0a';

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });

    let params = new HttpParams()
      .set('per_page', '100') // Get max records initially
      .set('page', '1');

    if (this.selectedStatus) {
      params = params.set('status', this.selectedStatus);
    }

    this.http.get<any[]>(url, { headers, params, observe: 'response' }).subscribe(
      response => {
        this.allTransactions = response.body || [];

        // Sort transactions by status priority
        const statusPriority: { [key: string]: number } = {
          'completed': 1,
          'processing': 2,
          'on-hold': 3,
          'pending': 4,
          'refunded': 5,
          'failed': 6,
          'cancelled': 7
        };

        this.allTransactions.sort((a, b) => {
          const pA = statusPriority[a.status] || 99;
          const pB = statusPriority[b.status] || 99;
          return pA - pB;
        });

        this.applyFilters();
      },
      error => {
        console.error('❌ Failed to fetch transactions', error);
      }
    );
  }

  applyFilters() {
    let filtered = this.allTransactions;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(txn =>
        txn.billing?.first_name?.toLowerCase().includes(term) ||
        txn.billing?.last_name?.toLowerCase().includes(term) ||
        txn.billing?.email?.toLowerCase().includes(term)
      );
    }

    const total = filtered.length;
    this.totalPages = Math.ceil(total / this.perPage);
    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;

    this.transactions = filtered.slice(start, end);
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  changePage(page: number, event: Event) {
    event.preventDefault();
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadTransactions();
  }

  onPerPageChange() {
    this.currentPage = 1;
    this.applyFilters();
  }
}
