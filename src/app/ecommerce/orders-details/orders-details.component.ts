/* import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
 */



/* import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {
  order: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);
    }
  }

  loadOrder(id: string): void {
    this.orderService.getOrder(id).subscribe({
      next: (data) => (this.order = data),
      error: (err) => console.error('Failed to fetch order details', err)
    });
  }
} */




  import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {
  order: any; // To store the order details
  orderId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Get the order ID from the route parameters
    this.orderId = this.route.snapshot.paramMap.get('id');

    if (this.orderId) {
      this.loadOrder(this.orderId);
    }
  }

  loadOrder(id: string): void {
    // Call the service method to fetch the order by ID
    this.orderService.getOrder(id).subscribe({
      next: (data) => {
        if (!data.shipping || Object.keys(data.shipping).length === 0) {
          data.shipping = { ...data.billing }; // Use billing address as shipping
        }
        this.order = data;
         
      },
      error: (err) => console.error('Failed to fetch order details', err)
    });
  }
}

