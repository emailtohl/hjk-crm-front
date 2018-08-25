import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SecurityService } from '../../../shared/security.service';
import { User } from '../../../model-interface/entities';
import { Paging } from '../../../shared/paging';
import { UserService } from '../../../model-interface/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  query = '';
  page: Paging<User> = new Paging();
  loading = false;

  withRefresh = false;
  private searchText$ = new Subject<string>();
  private subscription: Subscription;

  constructor(
    private userService: UserService,
    private securityService: SecurityService,
    private router: Router,
    private modalService: NzModalService,
    private message: NzMessageService
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
        return this.userService.search({query: query, page: this.page.pageNumber});
      }),
      catchError(err => {
        this.loading = false;
        return of(new Paging());
      }),
    ).subscribe((page: Paging<User>) => {
      this.loading = false;
      this.page = page;
    }, console.log, this.createQueryStream);
  }

  keyupSearch(query: string) {
    this.searchText$.next(query);
  }

  loadData(page: number = 1) {
    this.loading = true;
    this.userService.search({query: this.query, page: page - 1}).subscribe(data => {
      this.page = data;
      this.loading = false;
    }, err => this.loading = false);
  }

  getDetail(id: number): void {
    this.router.navigate(['back/user/detail/', id]);
  }

  delete(id: number): void {
    this.modalService.confirm({
      nzTitle: '警告！',
      nzContent: '<b style="color: red;">若该用户已与其他信息关联，则无法删除。请确认是否删除此用户！</b>',
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.userService.delete(id).subscribe(data => {
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

}
