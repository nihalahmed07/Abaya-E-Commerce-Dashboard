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
// import html2pdf from 'html2pdf.js';

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

  // loadOrder(id: string): void {
  //   this.orderService.getOrder(id).subscribe({
  //     next: (data) => {
  //       if (!data.shipping || Object.keys(data.shipping).length === 0) {
  //         data.shipping = { ...data.billing }; // Use billing address as shipping if not available
  //       }
  //       this.order = data;
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch order details for invoice', err);
  //     }
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
    },
    error: (err) => {
      console.error('Failed to fetch order details for invoice', err);
    }
  });
}
printInvoice(): void {
  const element = document.getElementById('print-section');

  if (!element || !this.order?.billing?.first_name) {
    console.error('Missing invoice data or element');
    return;
  }

  const firstName = this.order.billing.first_name.trim();
  const lastName = this.order.billing.last_name?.trim() || '';
  const fileName = `Invoice_${firstName}_${lastName || 'Customer'}.pdf`;

  const options = {
    margin: 0.5,
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

   element.classList.add('pdf-mode');

  // html2pdf()
  //   .set(options)
  //   .from(element)
  //   .save()
  //   .finally(() => {
  //     element.classList.remove('pdf-mode');
  //   });
}

printWithBrowser(): void {
  if (!this.order?.billing?.first_name) return;

  const firstName = this.order.billing.first_name.trim();
  const lastName = this.order.billing.last_name?.trim() || 'Customer';
  const titleBackup = document.title;

  document.title = `Invoice_${firstName}_${lastName}`;

  window.print();

  // Revert back title after print
  setTimeout(() => {
    document.title = titleBackup;
  }, 1000);
}
}



  