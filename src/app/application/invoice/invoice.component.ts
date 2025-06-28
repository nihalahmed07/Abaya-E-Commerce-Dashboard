/* import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

} */


  import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  order: any; // To store the order details
  orderId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');

    if (this.orderId) {
      this.loadOrder(this.orderId);
    }
  }

  loadOrder(id: string): void {
    this.orderService.getOrder(id).subscribe({
      next: (data) => {
        if (!data.shipping || Object.keys(data.shipping).length === 0) {
          data.shipping = { ...data.billing }; // Use billing address as shipping if not available
        }
        this.order = data;
      },
      error: (err) => {
        console.error('Failed to fetch order details for invoice', err);
      }
    });
  }
}



  