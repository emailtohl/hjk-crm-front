import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../../../shared/security.service';
import { Paging } from '../../../shared/paging';
import { environment } from '../../../../environments/environment';
import { Invoice } from '../../../model-interface/entities';
import { InvoiceService } from '../../../model-interface/invoice.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  query = '';
  page: Paging<Invoice> = new Paging();
  loading = false;

  withRefresh = false;

  constructor(
    private invoiceService: InvoiceService,
    private securityService: SecurityService,
    private router: Router
  ) { }

  ngOnInit() {
    this.securityService.refresh();
    this.page.pageNumber = 0;
    this.loadData();
  }

  search = (query: string): Observable<Paging<Invoice>> => {
    return this.invoiceService.search({query: query, page: 0});
  }

  loadData(page: number = 1) {
    this.loading = true;
    this.invoiceService.search({query: this.query, page: page - 1}).subscribe(data => {
      this.page = data;
      this.loading = false;
    }, err => this.loading = false);
  }

  getDetail(id: number): void {
    this.router.navigate(['back/invoice/detail/businessKey', id, 'taskId', 0]);
  }

  pageIndexChange(pageNumber) {
    this.page.pageNumber = pageNumber;
    this.loadData();
  }

  exportExcel() {
    window.open(`${environment.SERVER_URL}/invoice/export`);
  }

}
