import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { SecurityService } from '../../../shared/security.service';
import { Paging } from '../../../shared/paging';
import { environment } from '../../../../environments/environment';
import { Invoice } from '../../../model-interface/entities';
import { InvoiceService } from '../../../model-interface/invoice.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit, OnDestroy {
  query = '';
  page: Paging<Invoice> = new Paging();
  loading = false;

  withRefresh = false;
  private searchText$: Subject<string>;
  private subscription: Subscription;

  constructor(
    private invoiceService: InvoiceService,
    private securityService: SecurityService,
    private router: Router
  ) { }

  ngOnInit() {
    this.securityService.refresh();
    this.page.pageNumber = 0;
    this.loadData();
    this.createQueryStream();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createQueryStream = () => {
    if (this.searchText$) {
      this.searchText$.complete();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.searchText$ = new Subject<string>();
    this.subscription = this.searchText$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(query => this.query = query),
      switchMap(query => {
        this.loading = true;
        return this.invoiceService.search({query: query, page: this.page.pageNumber});
      }),
      catchError(err => {
        this.loading = false;
        return of(new Paging());
      }),
    ).subscribe((page: Paging<Invoice>) => {
      this.loading = false;
      this.page = page;
    }, console.log, this.createQueryStream);
  }

  keyupSearch(query: string) {
    this.searchText$.next(query);
  }

  loadData(page: number = 1) {
    this.loading = true;
    this.invoiceService.search({query: this.query, page: page - 1}).subscribe(data => {
      this.page = data;
      this.loading = false;
      console.log(data);
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
