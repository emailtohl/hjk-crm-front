import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
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
export class InvoiceListComponent implements OnInit, OnDestroy {
  query = '';
  page: Paging<Invoice> = new Paging();
  loading = false;

  withRefresh = false;
  private searchText$ = new Subject<string>();
  private queryResult$: Observable<Paging<Invoice>| Paging<{}>>;
  private subscription: Subscription;

  constructor(
    private invoiceService: InvoiceService,
    private securityService: SecurityService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.securityService.refresh();
    this.page.pageNumber = 0;
    this.loadData();

    this.queryResult$ = this.searchText$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(query => this.query = query),
      switchMap(query => {
        this.loading = true;
        return this.invoiceService.search({query: query, pageNumber: this.page.pageNumber});
      }),
      catchError(err => {
        this.loading = true;
        return of(new Paging());
      }),
    );
    this.subscription = this.queryResult$.subscribe((page: Paging<Invoice>) => {
      this.loading = false;
      this.page = page;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  keyupSearch(query: string) {
    this.searchText$.next(query);
  }

  loadData() {
    this.loading = true;
    this.invoiceService.search({query: this.query, pageNumber: this.page.pageNumber}).subscribe(data => {
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
