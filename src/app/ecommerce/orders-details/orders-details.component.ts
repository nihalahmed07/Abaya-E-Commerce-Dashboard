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
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {
  order: any;  // To store the order details
  orderId: string | null = null;
  selectedStatus: string = '';  // To hold the selected status from the dropdown

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Get the order ID from the route parameters
    this.orderId = this.route.snapshot.paramMap.get('id');

    if (this.orderId) {
      this.loadOrder(this.orderId); // Load order data
    }
  }

  // Method to fetch order by ID
  // loadOrder(id: string): void {
  //   this.orderService.getOrder(id).subscribe({
  //     next: (data) => {
  //       this.order = data;
  //       this.selectedStatus = data.status;  // Set initial status from the order data
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch order details', err);
  //     },
  //   });
  // }
  loadOrder(id: string): void {
  this.orderService.getOrder(id).subscribe({
    next: (data) => {
      const shipping = data.shipping || {};
      const isShippingEmpty = ['address_1', 'city', 'state', 'postcode', 'country'].every(
        (field) => !shipping[field]?.trim()
      );

      if (isShippingEmpty) {
        data.shipping = { ...data.billing };
      }

      this.order = data;
      this.selectedStatus = data.status;
    },
    error: (err) => {
      console.error('Failed to fetch order details', err);
    }
  });
}

  // Method to update order status
  updateOrderStatus(): void {
    if (this.orderId && this.selectedStatus) {
      this.order.status = this.selectedStatus; // Update the status

      this.orderService.updateOrderStatus(this.orderId, this.order).subscribe({
        next: (data) => {
          console.log('Order status updated successfully', data);
        },
        error: (err) => {
          console.error('Failed to update order status', err);
        },
      });
    }
  }

  // Print functionality
  printOrderDetails(): void {
    const printContent = document.getElementById('printable-content')?.innerHTML;

    if (printContent) {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      printWindow?.document.write('<html><head><title>Print Order</title></head><body>');
      printWindow?.document.write(printContent);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.print();
    }
  }

//   navigateToInvoice(): void {
//   this.router.navigate(['/application/invoice']);  // Redirects to the invoice page without the orderId
// }

navigateToInvoice(): void {
  if (this.orderId) {
    this.router.navigate(['/application/invoice', this.orderId]);  // ✅ Pass the orderId as a route param
  }
}
}
