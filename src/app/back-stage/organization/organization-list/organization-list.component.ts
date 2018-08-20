import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SecurityService } from '../../../shared/security.service';
import { OrganizationService } from '../../../model-interface/organization.service';
import { Organization } from '../../../model-interface/entities';
import { Paging } from '../../../shared/paging';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.css']
})
export class OrganizationListComponent implements OnInit, OnDestroy {
  query = '';
  page: Paging<Organization> = new Paging();
  loading = false;

  withRefresh = false;
  private searchText$ = new Subject<string>();
  private queryResult$: Observable<Paging<Organization>| Paging<{}>>;
  private subscription: Subscription;

  constructor(
    private organizationService: OrganizationService,
    private securityService: SecurityService,
    private router: Router,
    private modalService: NzModalService,
    private message: NzMessageService
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
        return this.organizationService.search({query: query, pageNumber: this.page.pageNumber});
      }),
      catchError(err => {
        this.loading = true;
        return of(new Paging());
      }),
    );
    this.subscription = this.queryResult$.subscribe((page: Paging<Organization>) => {
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
    this.organizationService.search({query: this.query, pageNumber: this.page.pageNumber}).subscribe(data => {
      this.page = data;
      this.loading = false;
      console.log(data);
    }, err => this.loading = false);
  }

  getDetail(id: number): void {
    this.router.navigate(['back/organization/detail/businessKey', id, 'taskId', 0]);
  }

  delete(id: number): void {
    this.modalService.confirm({
      nzTitle: '警告！',
      nzContent: '<b style="color: red;">请确认是否删除此信息！</b>',
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.organizationService.delete(id).subscribe(data => {
          this.message.create('success', '已成功删除');
          this.loadData();
        });
      },
      nzCancelText: '否',
      nzOnCancel: () => {}
    });
  }

  pageIndexChange(pageNumber) {
    this.page.pageNumber = pageNumber;
    this.loadData();
  }

  exportExcel() {
    window.open(`${environment.SERVER_URL}/organization/export`);
  }
}
