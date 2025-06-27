/* import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

} */


/* 
  import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Failed to load orders', err)
    });
  }
} */


  /* import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];  // All orders
  filteredOrders: any[] = [];  // Orders filtered by selected status
  selectedStatus: string = 'Show All';  // Default value for status filter

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    // Load all orders initially when the component is initialized
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;  // Store all orders
        this.filteredOrders = data;  // Initially show all orders
      },
      error: (err) => console.error('Failed to load orders', err)
    });
  }

  // Filter orders based on selected status
  filterOrders(): void {
    if (this.selectedStatus === 'Show All' || !this.selectedStatus) {
      this.filteredOrders = this.orders;  // Show all orders
    } else {
      // Filter orders based on selected status
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
  }
}



 */




import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];  // All orders
  filteredOrders: any[] = [];  // Orders filtered by selected status or ID
  selectedStatus: string = 'Show All';  // Default value for status filter
  orderId: string = '';  // Model for Order ID input
  customerName: string = '';  // Customer Name
  orderStatus: string = '';  // Order Status
  orderTotal: string = '';  // Order Total

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();  // Load all orders initially
  }

  // Load orders from the backend service
  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;  // Store all orders
        this.filteredOrders = data;  // Initially show all orders
      },
      error: (err) => console.error('Failed to load orders', err)
    });
  }

  // Filter orders based on the selected status
  filterOrders(): void {
    // Filter orders by selected status
    if (this.selectedStatus === 'Show All' || !this.selectedStatus) {
      this.filteredOrders = this.orders;  // Show all orders
    } else {
      // Filter orders based on selected status
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }

    // Also filter by Order ID if specified
    if (this.orderId) {
      this.filteredOrders = this.filteredOrders.filter(order => order.id === parseInt(this.orderId, 10));
    }
  }

  // Filter by Order ID only (if entered)
  filterOrderById(): void {
    if (this.orderId) {
      this.filteredOrders = this.orders.filter(order => order.id === parseInt(this.orderId, 10));
    }
  }
}
