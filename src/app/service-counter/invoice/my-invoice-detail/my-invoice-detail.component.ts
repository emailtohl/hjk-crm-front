import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { InvoiceService } from '../../../model-interface/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Invoice } from '../../../model-interface/entities';

@Component({
  selector: 'app-my-invoice-detail',
  templateUrl: './my-invoice-detail.component.html',
  styleUrls: ['./my-invoice-detail.component.css']
})
export class MyInvoiceDetailComponent implements OnInit {
  id: number;
  data: Invoice;

  constructor(
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getDetail();
  }

  getDetail() {
    this.invoiceService.getDetail(this.id).subscribe((data: Invoice) => {
      this.data = data;
    });
  }

  userUrl(id: string): string {
    return `${environment.SERVER_URL}/users/userPicture/${id}`;
  }

  getCurrent() {
    if (!this.data || !this.data.flow) {
      return 0;
    }
    if (this.data.flow.pass != null) {
      return 3;
    }
    switch (this.data.flow.taskDefinitionKey) {
      case 'finance_handle':
        return 1;
      case 'foreign_handle':
        return 2;
    }
  }

}
