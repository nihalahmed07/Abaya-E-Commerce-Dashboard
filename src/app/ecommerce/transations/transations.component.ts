import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-transations',
  templateUrl: './transations.component.html',
  styleUrls: ['./transations.component.scss']
})
export class TransationsComponent implements OnInit {
  transactions: any[] = [];

  constructor(private http: HttpClient) {}

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

    this.http.get<any[]>(url, { headers }).subscribe(
      data => {
        console.log(data);
        this.transactions = data;
      },
      error => {
        console.error('Failed to fetch transactions', error);
      }
    );
  }
}
