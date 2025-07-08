import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];             // All orders
  filteredOrders: any[] = [];     // Orders after filter/search
  paginatedOrders: any[] = [];    // Orders to display on current page

  selectedStatus: string = 'Show All';  // Status dropdown
  searchTerm: string = '';              // Search input
  orderId: string = '';                 // Not used now, but declared
  customerName: string = '';           // Not used now, but declared
  orderStatus: string = '';            // Not used now, but declared
  orderTotal: string = '';             // Not used now, but declared

  currentPage: number = 1;
  itemsPerPage: number = 10;
 


  editableOrder: any = {
  billing: {
    first_name: '',
    last_name: ''
  },
  total: '',
  status: ''
};
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders(); // Fetch orders on init
  }

  // Fetch data from service
  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filterOrders(); // Apply filters after loading
      },
      error: (err) => console.error('Failed to load orders', err)
    });
  }

  // Filter orders based on search term + status
  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch =
        order.id.toString().includes(this.searchTerm.toLowerCase()) ||
        `${order.billing.first_name} ${order.billing.last_name}`.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'Show All' || order.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }

  // Pagination logic
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    const totalPages = this.getTotalPages().length;
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getTotalPages(): number[] {
    return Array(Math.ceil(this.filteredOrders.length / this.itemsPerPage)).fill(0);
  }
  onItemsPerPageChange(): void {
  this.currentPage = 1;
  this.updatePagination();
}


editOrder(order: any): void {
  this.editableOrder = {
    billing: {
      first_name: order.billing?.first_name || '',
      last_name: order.billing?.last_name || ''
    },
    total: order.total,
    status: order.status,
    id: order.id
  };

  const modal = new (window as any).bootstrap.Modal(document.getElementById('editOrderModal'));
  modal.show();
}

saveOrderEdits(): void {
  this.orderService.updateOrder(this.editableOrder.id, this.editableOrder).subscribe({
    next: (updatedOrder) => {
      const index = this.orders.findIndex(o => o.id === updatedOrder.id);
      if (index !== -1) {
        this.orders[index] = updatedOrder;
        this.filterOrders();  // Refresh filtered list
      }
      (window as any).bootstrap.Modal.getInstance(document.getElementById('editOrderModal')).hide();
    },
    error: (err) => {
      console.error('Update failed', err);
      alert('Update failed. Try again.');
    }
  });
}
deleteOrder(orderId: number): void {
  if (confirm('Are you sure you want to delete this order?')) {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        // ✅ Remove the full order object from the array
        this.orders = this.orders.filter(order => order.id !== orderId);
        this.filterOrders();  // Re-filter and update pagination
        alert(' deleted successfully.');
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete the order.');
      }
    });
  }
}
  // (Optional) If you want to use orderId filter separately later
  filterOrderById(): void {
    if (this.orderId) {
      this.filteredOrders = this.orders.filter(order => order.id === parseInt(this.orderId, 10));
      this.updatePagination();
    }
  }
}
