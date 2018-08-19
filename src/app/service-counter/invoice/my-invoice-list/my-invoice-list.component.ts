import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../model-interface/invoice.service';
import { Invoice } from '../../../model-interface/entities';

@Component({
  selector: 'app-my-invoice-list',
  templateUrl: './my-invoice-list.component.html',
  styleUrls: ['./my-invoice-list.component.css']
})
export class MyInvoiceListComponent implements OnInit {
  invoices: Array<Invoice> = [];
  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.invoiceService.myApply().subscribe((data: Array<Invoice>) => {
      this.invoices = data;
    });
  }

  getDetail(id: number) {
    this.router.navigate(['service/invoice/detail', id]);
  }
}
