import { Directive, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Observable, Observer, Subscription } from 'rxjs';
/**
 * 使用指令实现异步唯一性校验，示例如下：
 * <input [custExist]="queryUrl" (exist)="onresult($event)" [ignore]="ignoreQueryUrl" (keyup)="setCurrentValue($event)">
 * [custExist]="queryUrl" 表示校验地址当queryUrl变化时，将触发异步校验
 * (exist)="onresult($event)" 表示异步校验的结果
 * [ignore]="ignoreQueryUrl" 表示当queryUrl === ignoreQueryUrl时，将不做校验，主要用于编辑时
 */
@Directive({
  selector: '[custExist]'
})
export class ExistDirective implements OnDestroy {
  private observe: Observer<string>;
  private subscription: Subscription;
  // 后台校验的地址
  @Input('custExist')
  set custExist(queryUrl: string) {
    if (!queryUrl) {
      return;
    }
    this.observe.next(queryUrl);
  }

  // 忽略该值的校验，主要用于编辑场景
  @Input()
  ignore: string;

  // 输出异步校验的结果
  @Output('exist')
  exist: EventEmitter<boolean>;

  constructor(http: HttpClient) {
    this.exist = new EventEmitter<boolean>();
    this.subscription = Observable.create((observe: Observer<string>) => {
      this.observe = observe;
    })
    .debounceTime(800)
    .filter(queryUrl => this.ignore !== queryUrl)
    .distinctUntilChanged()
    .switchMap(queryUrl => http.get(queryUrl))
    .subscribe((res: boolean) => this.exist.emit(res))
    ;
  }

  /**
   * 释放资源避免内存泄露
   */
  ngOnDestroy() {
    this.observe.complete();
    this.subscription.unsubscribe();
    this.observe = null;
    this.subscription = null;
  }
}
