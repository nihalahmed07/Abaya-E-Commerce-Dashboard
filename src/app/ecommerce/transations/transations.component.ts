import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-transations',
  templateUrl: './transations.component.html',
  styleUrls: ['./transations.component.scss']
})
export class TransationsComponent implements OnInit {
  transactions: any[] = [];
  selectedStatus: string = '';
  perPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadTransactions();

  }

  loadTransactions() {
    const url = 'https://cybercloudapp.com/wp-json/wc/v3/orders';

    const username = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4';
    const password = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987';

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });



    let params = new HttpParams()
      .set('per_page', this.perPage.toString())
      .set('page', this.currentPage.toString());


    if (this.selectedStatus) {
      params = params.set('status', this.selectedStatus);
    }


    this.http.get<any[]>(url, { headers, params, observe: 'response' }).subscribe(
      response => {
        const totalRecords = Number(response.headers.get('X-WP-Total')) || 0;
        this.totalPages = Math.ceil(totalRecords / this.perPage);
        this.transactions = response.body || [];

        const statusPriority: { [key: string]: number } = {
          'completed': 1,
          'processing': 2,
          'on-hold': 3,
          'pending': 4,
          'refunded': 5,
          'failed': 6,
          'cancelled': 7
        };
        this.transactions.sort((a, b) => {
          const priorityA = statusPriority[a.status] || 99;
          const priorityB = statusPriority[b.status] || 99;
          return priorityA - priorityB;
        });
      },
      error => {
        console.error('❌ Failed to fetch transactions', error);
      }
    );

  }

  changePage(page: number, event: Event) {
    event.preventDefault();
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTransactions();
    }
  }


}
