import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Subscription, Subject, of, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit, OnDestroy {
  // 搜索函数
  @Input()
  search: (query: string) => Observable<any>;
  // 当前输入框的值
  @Output()
  private current: EventEmitter<string> = new EventEmitter();
  // 是否处于搜索中
  @Output()
  private loading: EventEmitter<boolean> = new EventEmitter();
  // 搜索结果
  @Output()
  private result: EventEmitter<any> = new EventEmitter();
  private searchText$: Subject<string>;
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
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
      switchMap(query => {
        this.loading.emit(true);
        return this.search(query);
      }),
      catchError(err => {
        this.loading.emit(false);
        return of({});
      }),
    ).subscribe((data: any) => {
      this.loading.emit(false);
      this.result.emit(data);
    }, console.log, this.createQueryStream);
  }

  keyupSearch(query: string) {
    this.current.emit(query);
    this.searchText$.next(query);
  }
}
