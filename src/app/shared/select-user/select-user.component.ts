import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Subscription, Subject, of } from 'rxjs';
import { debounceTime, map, switchMap, distinctUntilChanged, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../model-interface/entities';
import { Paging } from '../paging';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent implements OnInit, OnDestroy {
  @Input()
  selectedUserIds: Array<number>;
  @Output()
  selectedUserIdsChange: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Input()
  userList: Array<User>;
  selectedUser;
  private searchText$: Subject<string>;
  private subscription: Subscription;
  loading = false;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    if (!this.selectedUserIds) {
      this.selectedUserIds = [];
    }
    if (!this.userList) {
      this.userList = [];
    }
    this.createQueryStream();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
      switchMap(query => {
        this.loading = true;
        return this.http.get<Paging<User>>(`${environment.SERVER_URL}/users/search?query=${query}`);
      }),
      catchError(err => {
        this.loading = false;
        return of(new Paging<User>());
      }),
    ).subscribe((page: Paging<User>) => {
      this.loading = false;
      this.userList = page.content;
    }, console.log, this.createQueryStream);
  }

  onSearch(value: string): void {
    this.searchText$.next(value);
  }

  selectedChange(ids: Array<number>) {
    this.selectedUserIds = ids;
    this.selectedUserIdsChange.emit(ids);
  }
}
